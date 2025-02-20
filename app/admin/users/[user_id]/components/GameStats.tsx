'use client';

import React from 'react';

interface GameStatsProps {
  gamesStarted: number;
  gamesWon: number;
}

export function GameStats({ gamesStarted, gamesWon }: GameStatsProps) {
  return (
    <div className="p-10 border rounded-lg shadow-md text-2xl">
      <h2 className="text-3xl font-semibold">Game Stats</h2>
      <p className="text-gray-600">Games Started: {gamesStarted}</p>
      <p className="text-gray-600">Games Won: {gamesWon}</p>
    </div>
  );
}
