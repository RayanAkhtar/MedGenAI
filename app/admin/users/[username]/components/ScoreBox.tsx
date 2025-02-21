'use client';

import React from 'react';

interface ScoreBoxProps {
  score: number;
}

export function ScoreBox({ score }: ScoreBoxProps) {
  return (
    <div className="p-10 border rounded-lg shadow-md text-2xl col-span-1 md:col-span-2 text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        <div>
            <h2 className="text-3xl font-semibold">Score</h2>
            <p className="text-gray-600 text-5xl font-bold">{score}</p>
        </div>
        <div>
            <h2 className="text-3xl font-semibold">Accuracy</h2>
            <p className="text-gray-600 text-5xl font-bold">83%</p>
        </div>        
        <div>
            <h2 className="text-3xl font-semibold"> Total Images Attempted</h2>
            <p className="text-gray-600 text-5xl font-bold">31</p>
        </div>

      </div>
    </div>
  );
}
