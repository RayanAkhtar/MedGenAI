"use client";
import React from "react";

interface ScoreDisplayProps {
  score: number;
  correctCount: number;
  isHidden: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  correctCount,
  isHidden,
}) => {
  if (isHidden) return null;

  return (
    <div className="py-3 px-2 bg-gray-100 rounded-lg shadow-md flex flex-row items-center space-x-4">
      <p className="text-lg font-semibold">Score: {score}</p>
      <p className="text-lg font-semibold">Correct Answers: {correctCount}</p>
    </div>
  );
};

export default ScoreDisplay;
