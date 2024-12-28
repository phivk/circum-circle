import React from "react";
import CircleAndTriangle from "./CircleAndTriangle";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
        <CircleAndTriangle width={600} height={600} />
      </div>
    </main>
  );
}
