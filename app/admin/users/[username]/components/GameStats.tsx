'use client';

import React from 'react';

interface GameStatsProps {
  gamesStarted: number;
  gamesWon: number;
}

export function GameStats({ gamesStarted, gamesWon }: GameStatsProps) {
  return (
    <div className="p-10 border rounded-2xl shadow-lg bg-white w-full">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Game Stats</h2>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between p-5 bg-gray-100 rounded-lg shadow-md">
          <span className="text-2xl text-gray-600 font-semibold">Games Started</span>
          <span className="text-3xl font-bold text-gray-900">{gamesStarted}</span>
        </div>
        <div className="flex items-center justify-between p-5 bg-gray-100 rounded-lg shadow-md">
          <span className="text-2xl text-gray-600 font-semibold">Games Won</span>
          <span className="text-3xl font-bold text-gray-900">{gamesWon}</span>
        </div>
      </div>
    </div>
  );
}
