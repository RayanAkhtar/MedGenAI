'use client';

import React from 'react';

interface ProgressBarProps {
  level: number;
  exp: number;
  maxExp?: number;
}

export function ProgressBar({ level, exp, maxExp = 1000 }: ProgressBarProps) {
  const progressPercent = Math.min((exp / maxExp) * 100, 100);

  return (
    <div className="p-8 border rounded-2xl shadow-lg bg-white lg:col-span-2 w-full space-y-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Progress</h2>
      <p className="text-2xl font-semibold text-gray-700 text-center mb-6">
        Level: <span className="font-extrabold text-blue-600">{level}</span>
      </p>

      <div className="relative w-full bg-gray-300 rounded-full h-10 shadow-inner overflow-hidden mb-6">
        <div
          className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out flex items-center justify-center text-white font-bold text-lg sm:text-xl"
          style={{ width: `${progressPercent}%` }}
        >
          {progressPercent > 20 && <span>{exp} / {maxExp} XP</span>}
        </div>
      </div>

      {progressPercent <= 20 && (
        <p className="text-center text-xl font-semibold text-gray-700 mt-3">{exp} / {maxExp} XP</p>
      )}
    </div>
  );
}
