"use client";

import React, { useState } from "react";

interface CircleWithTriangleProps {
  width?: number;
  height?: number;
}

const CircleAndTriangle: React.FC<CircleWithTriangleProps> = ({
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
  const [showTriangle, setShowTriangle] = useState(true);
  const [showNinePoint, setShowNinePoint] = useState(false);

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

  // Incircle //

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

  // nine point circle //

  const calculateMidpoints = () => {
    const [A, B, C] = points;
    return [
      { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 },
      { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 },
      { x: (C.x + A.x) / 2, y: (C.y + A.y) / 2 },
    ];
  };

  const calculateOrthocenter = () => {
    const [A, B, C] = points;
    const mAB = (B.y - A.y) / (B.x - A.x);
    const mBC = (C.y - B.y) / (C.x - B.x);

    const hA = {
      x: (B.x + C.x) / 2,
      y: (B.y + C.y) / 2,
    };
    const hB = {
      x: (A.x + C.x) / 2,
      y: (A.y + C.y) / 2,
    };

    const orthocenter = {
      x:
        (mAB * mBC * (hA.y - hB.y) +
          mBC * (hA.x + hB.x) -
          mAB * (hA.x + hB.x)) /
        (2 * (mBC - mAB)),
      y: (hA.y + hB.y) / 2,
    };
    return orthocenter;
  };

  const calculateCircumcenter = () => {
    const [A, B, C] = points;
    const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));

    const Ux =
      ((A.x ** 2 + A.y ** 2) * (B.y - C.y) +
        (B.x ** 2 + B.y ** 2) * (C.y - A.y) +
        (C.x ** 2 + C.y ** 2) * (A.y - B.y)) /
      D;
    const Uy =
      ((A.x ** 2 + A.y ** 2) * (C.x - B.x) +
        (B.x ** 2 + B.y ** 2) * (A.x - C.x) +
        (C.x ** 2 + C.y ** 2) * (B.x - A.x)) /
      D;

    return { x: Ux, y: Uy };
  };

  const midpoints = calculateMidpoints();
  const orthocenter = calculateOrthocenter();
  const circumcenter = calculateCircumcenter();

  const ninePointCenter = {
    x: (circumcenter.x + orthocenter.x) / 2,
    y: (circumcenter.y + orthocenter.y) / 2,
  };

  const ninePointRadius = Math.sqrt(
    (ninePointCenter.x - midpoints[0].x) ** 2 +
      (ninePointCenter.y - midpoints[0].y) ** 2
  );

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

        {/* Draw triangle */}
        {showTriangle && (
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

        {/* Draw nine-point circle */}
        {showNinePoint && (
          <circle
            cx={ninePointCenter.x}
            cy={ninePointCenter.y}
            r={ninePointRadius}
            stroke="purple"
            fill="none"
          />
        )}

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
            checked={showTriangle}
            onChange={() => setShowTriangle(!showTriangle)}
            className="mr-2"
          />
          Show Triangle
        </label>
        <label>
          <input
            type="checkbox"
            checked={showNinePoint}
            onChange={() => setShowNinePoint(!showNinePoint)}
            className="mr-2"
          />
          Show 9-Point Circle
        </label>
      </div>
    </div>
  );
};

export default CircleAndTriangle;
