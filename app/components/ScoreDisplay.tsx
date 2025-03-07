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
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <p className="text-lg font-semibold">Score: {score}</p>
      <p className="text-lg font-semibold">Correct Answers: {correctCount}</p>
    </div>
  );
};

export default ScoreDisplay;
