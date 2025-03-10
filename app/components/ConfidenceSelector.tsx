"use client";

import React, { useState } from "react";

interface ConfidenceSelectorProps {
  onSelect: (score: number) => void;
}

const ConfidenceSelector: React.FC<ConfidenceSelectorProps> = ({
  onSelect,
}) => {
  const confidenceLevels = [0, 1, 2, 3];
  const colors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleSelect = (level: number) => {
    setSelectedLevel(level);
    onSelect(level);
  };

  return (
    <div className="flex space-x-2">
      {confidenceLevels.map((level) => (
        <button
          key={level}
          onClick={() => handleSelect(level)}
          className={`px-6 py-2 text-white rounded hover:opacity-75 text-sm ${
            colors[level]
          } ${selectedLevel === level ? "ring-4 ring-gray-300" : ""}`}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default ConfidenceSelector;
