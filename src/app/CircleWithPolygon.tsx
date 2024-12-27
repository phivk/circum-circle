"use client";

import React, { useState } from "react";

interface CircleWithPolygonProps {
  width?: number;
  height?: number;
}

const CircleWithPolygon: React.FC<CircleWithPolygonProps> = ({
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
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Control panel state
  const [showPolygon, setShowPolygon] = useState(true);

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

  // Calculate incenter
  const calculateIncenter = () => {
    const [A, B, C] = points;
    const a = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
    const b = Math.sqrt((A.x - C.x) ** 2 + (A.y - C.y) ** 2);
    const c = Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
    const perimeter = a + b + c;

    const incenterX = (a * A.x + b * B.x + c * C.x) / perimeter;
    const incenterY = (a * A.y + b * B.y + c * C.y) / perimeter;

    return { x: incenterX, y: incenterY };
  };

  // Calculate inradius
  const calculateInradius = () => {
    const [A, B, C] = points;
    const a = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
    const b = Math.sqrt((A.x - C.x) ** 2 + (A.y - C.y) ** 2);
    const c = Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2);
    const s = (a + b + c) / 2;

    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    const inradius = area / s;

    return inradius;
  };

  const incenter = calculateIncenter();
  const inradius = calculateInradius();

  return (
    <div>
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

        {/* Draw polygon */}
        {showPolygon && (
          <polygon
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            stroke="blue"
            strokeWidth="2"
            fill="none"
          />
        )}

        {/* Draw incircle */}
        <circle
          cx={incenter.x}
          cy={incenter.y}
          r={inradius}
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
            r={draggingIndex === index ? 8 : hoverIndex === index ? 7 : 5}
            fill="red"
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          />
        ))}
      </svg>
      <div className="text-gray-800">
        <label>
          <input
            type="checkbox"
            checked={showPolygon}
            onChange={() => setShowPolygon(!showPolygon)}
            className="mr-2"
          />
          Show Polygon
        </label>
      </div>
    </div>
  );
};

export default CircleWithPolygon;
