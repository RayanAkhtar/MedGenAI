"use client";

import React from "react";

interface SummaryProps {
  stats: {
    score: number;
    correct: number;
    avgTime: number;
  };
  gameMode: "classic" | "competition" | "custom";
}

const Summary: React.FC<SummaryProps> = ({ stats, gameMode }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Game Summary</h2>
      {gameMode !== "competition" && (
        <>
          <p className="text-lg">Score: {stats.score}</p>
          <p className="text-lg">Correct Answers: {stats.correct}</p>
        </>
      )}
      <p className="text-lg">Average Time: {stats.avgTime}s</p>
      <div className="mt-4 space-x-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Play Again
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Share
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Home
        </button>
      </div>
    </div>
  );
};

export default Summary;
