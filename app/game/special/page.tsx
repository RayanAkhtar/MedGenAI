'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function SpecialGame() {
  // Game state
  const [showRules, setShowRules] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentRound, setCurrentRound] = useState({
    images: {
      left: '/images/placeholder1.jpg',
      right: '/images/placeholder2.jpg'
    },
    aiSide: Math.random() > 0.5 ? 'left' : 'right'
  });

  // Handle player's guess and update score
  const handleGuess = (side: 'left' | 'right') => {
    const correct = side === currentRound.aiSide;
    
    if (correct) {
      setScore(s => s + (streak + 1) * 10); // Bonus points for streaks
      setStreak(s => s + 1);
    } else {
      setStreak(0); // Reset streak on wrong guess
    }

    // Load next pair
    setCurrentRound({
      images: {
        left: `/images/placeholder${Math.floor(Math.random() * 2) + 1}.jpg`,
        right: `/images/placeholder${Math.floor(Math.random() * 2) + 1}.jpg`
      },
      aiSide: Math.random() > 0.5 ? 'left' : 'right'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Rules Modal */}
      {showRules && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowRules(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Special Challenge Mode</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Build streaks for bonus points</li>
              <li>Each correct guess multiplies your score</li>
              <li>Wrong guesses reset your streak</li>
              <li>Special themed image pairs</li>
            </ul>
            <button 
              onClick={() => setShowRules(false)}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Start Challenge
            </button>
          </div>
        </div>
      )}

      {/* Main Game UI */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Special Challenge</h1>
          <div className="flex justify-center gap-8">
            <p className="text-xl">Score: {score}</p>
            {streak > 0 && (
              <p className="text-xl text-green-600">Streak: {streak}x</p>
            )}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-8">
          {['left', 'right'].map((side) => (
            <div 
              key={side}
              onClick={() => handleGuess(side as 'left' | 'right')}
              className="relative aspect-square cursor-pointer 
                         hover:opacity-90 transition-opacity"
            >
              <Image
                src={currentRound.images[side as keyof typeof currentRound.images]}
                alt="Game image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-lg mb-4">Pick the AI-generated image</p>
          <button 
            onClick={() => setShowRules(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Rules
          </button>
        </div>
      </div>
    </div>
  );
}
