'use client';

import React from 'react';

interface ProgressBarProps {
  level: number;
  exp: number;
  maxExp?: number;
}

export function ProgressBar({ level, exp, maxExp = 1000 }: ProgressBarProps) {
  // Calculate percentage for the XP bar
  const progressPercent = (exp / maxExp) * 100;

  return (
    <div className="p-10 border rounded-lg shadow-md text-2xl">
      <h2 className="text-3xl font-semibold">Progress</h2>
      <p className="text-gray-600">Level: {level}</p>

      <div className="w-full bg-gray-200 rounded-full h-6 mt-2 relative overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full text-lg font-semibold flex items-center justify-center text-white"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Show XP if there is enough space within the bar */}
        </div>
      </div>

      {/* Show the XP text below or inside the bar, depending on design */}
      <p className="text-lg font-semibold text-center mt-2">
        {exp} / {maxExp} XP
      </p>
    </div>
  );
}
