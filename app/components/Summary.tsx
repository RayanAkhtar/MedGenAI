"use client";

import React, { Fragment } from "react";
import { useRouter } from "next/navigation";

interface SummaryProps {
  stats: {
    score: number;
    correct: number;
    avgTime: number;
    roundsCompleted: number;
  };
  gameMode: "classic" | "competition" | "custom";
}

const Summary: React.FC<SummaryProps> = ({ stats, gameMode }) => {
  const router = useRouter();

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Game link copied to clipboard!");
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-start items-center bg-white p-6 bg-white rounded-lg shadow-md min-h-screen">
      <h2 className="text-2xl font-semibold">Game Summary</h2>
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        {gameMode !== "competition" && (
          <>
            <p className="text-lg">Score: {stats.score}</p>
            <p className="text-lg">Correct Answers: {stats.correct}</p>
          </>
        )}
        <p className="text-lg">Average Time: {stats.avgTime}s</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={handlePlayAgain}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Play Again
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Share
        </button>
        <button
          onClick={handleHome}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Summary;
