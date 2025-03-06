'use client';

import React from 'react';

interface ScoreBoxProps {
  score: number;
  accuracy: number;
  totalImagesAttempted: number;
}

export function ScoreBox({ score, accuracy, totalImagesAttempted }: ScoreBoxProps) {
  return (
    <div className="p-10 border rounded-2xl shadow-lg bg-white col-span-1 md:col-span-2 text-center space-y-8">
      <h2 className="text-4xl font-semibold text-gray-800">Player Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        <div className="flex flex-col justify-between p-6 border-2 border-blue-500 rounded-lg shadow-xl h-full">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Score</h3>
          <p className="text-6xl font-extrabold text-gray-900">{score}</p>
        </div>
        <div className="flex flex-col justify-between p-6 border-2 border-green-500 rounded-lg shadow-xl h-full">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Accuracy</h3>
          <p className="text-6xl font-extrabold text-gray-900">{accuracy}%</p> {/* Display accuracy */}
        </div>
        <div className="flex flex-col justify-between p-6 border-2 border-purple-500 rounded-lg shadow-xl h-full">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Total Images Attempted</h3>
          <p className="text-6xl font-extrabold text-gray-900">{totalImagesAttempted}</p> {/* Display total images attempted */}
        </div>
      </div>
    </div>
  );
}
