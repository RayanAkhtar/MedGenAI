'use client';

import React from 'react';

interface ScoreBoxProps {
  score: number;
}

export function ScoreBox({ score }: ScoreBoxProps) {
  return (
    <div className="p-10 border rounded-lg shadow-md text-2xl col-span-1 md:col-span-2">
      <h2 className="text-3xl font-semibold">Score</h2>
      <p className="text-gray-600 text-5xl font-bold">{score}</p>
    </div>
  );
}
