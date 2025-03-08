"use client";

import React, { useState } from "react";

interface ConfidenceSelectorProps {
  onSelect: (score: number) => void;
  maxScore?: number;
}

const ConfidenceSelector: React.FC<ConfidenceSelectorProps> = ({
  onSelect,
  maxScore = 3,
}) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const handleClick = (score: number) => {
    setSelectedScore(score);
    onSelect(score);
  };

  return (
    <div className="flex justify-center space-x-2">
      {[...Array(maxScore + 1)].map((_, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`px-6 py-3 text-lg rounded hover:bg-blue-600 ${
            selectedScore === index
              ? "bg-blue-500 text-white border-2 border-green-500"
              : "bg-blue-500 text-white"
          }`}
        >
          {index}
        </button>
      ))}
    </div>
  );
};

export default ConfidenceSelector;
