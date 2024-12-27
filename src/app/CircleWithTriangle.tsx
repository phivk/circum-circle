import React from "react";

const CircleWithTriangle: React.FC = () => {
  // Circle properties
  const centerX = 200;
  const centerY = 200;
  const radius = 150;

  // Calculate three points on the circle
  const points = [
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

  return (
    <svg width="400" height="400">
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
        <circle key={index} cx={point.x} cy={point.y} r={5} fill="red" />
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
