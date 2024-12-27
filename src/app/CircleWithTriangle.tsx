"use client";

import React, { useState } from "react";

interface CircleWithTriangleProps {
  width?: number;
  height?: number;
}

const CircleWithTriangle: React.FC<CircleWithTriangleProps> = ({
  width = 400,
  height = 400,
}) => {
  // Circle properties
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 50;

  // Calculate initial positions of points
  const initialPoints = [
    { x: centerX + radius * Math.cos(0), y: centerY + radius * Math.sin(0) },
    {
      x: centerX + radius * Math.cos((2 * Math.PI) / 3),
      y: centerY + radius * Math.sin((2 * Math.PI) / 3),
    },
    {
      x: centerX + radius * Math.cos((4 * Math.PI) / 3),
      y: centerY + radius * Math.sin((4 * Math.PI) / 3),
    },
  ];

  // State to track point positions
  const [points, setPoints] = useState(initialPoints);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Handle mouse down event
  const handleMouseDown = (index: number) => {
    setDraggingIndex(index);
  };

  // Handle mouse move event
  const handleMouseMove = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    if (draggingIndex === null) return;

    const { clientX, clientY } = event;
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const dx = cursor.x - centerX;
    const dy = cursor.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate new position constrained to the circle radius
    const newX = centerX + (radius * dx) / distance;
    const newY = centerY + (radius * dy) / distance;

    const updatedPoints = [...points];
    updatedPoints[draggingIndex] = { x: newX, y: newY };
    setPoints(updatedPoints);
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  return (
    <svg
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Draw circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke="black"
        strokeWidth="2"
        fill="none"
      />

      {/* Draw points */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={5}
          fill="red"
          onMouseDown={() => handleMouseDown(index)}
        />
      ))}

      {/* Draw triangle */}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        stroke="blue"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

export default CircleWithTriangle;
