'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ClassicGame() {
  // Game state
  const [score, setScore] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [currentImages, setCurrentImages] = useState({
    image1: '/images/placeholder1.jpg',
    image2: '/images/placeholder2.jpg',
    aiIndex: Math.random() > 0.5 ? 1 : 2  // randomly pick which image is AI
  });

  // Load new image pair and update AI position
  const nextRound = () => {
    // For now using placeholder images 1-2, will be replaced with real images
    const img1 = Math.floor(Math.random() * 2) + 1;
    let img2 = img1;
    while (img2 === img1) {
      img2 = Math.floor(Math.random() * 2) + 1;
    }

    setCurrentImages({
      image1: `/images/placeholder${img1}.jpg`,
      image2: `/images/placeholder${img2}.jpg`,
      aiIndex: Math.random() > 0.5 ? 1 : 2
    });
  };

  // Handle player's guess
  const handleGuess = (selectedIndex: number) => {
    if (selectedIndex === currentImages.aiIndex) {
      setScore(s => s + 1);
    }
    nextRound();
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
            <h2 className="text-2xl font-bold mb-4">Ready to test your AI detection?</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Two images shown - one real, one AI</li>
              <li>Click the AI-generated one</li>
              <li>Score a point for each correct guess</li>
              <li>See how many you can get right!</li>
            </ul>
            <button 
              onClick={() => setShowRules(false)}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Start Playing
            </button>
          </div>
        </div>
      )}

      {/* Main Game UI */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Real or AI?</h1>
          <p className="text-xl">Score: {score}</p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-8">
          {[1, 2].map(index => (
            <div 
              key={index}
              onClick={() => handleGuess(index)}
              className="relative aspect-square cursor-pointer hover:opacity-90 
                         transition-opacity rounded-lg overflow-hidden"
            >
              <Image
                src={index === 1 ? currentImages.image1 : currentImages.image2}
                alt={`Image ${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-lg mb-4">Click the AI-generated image</p>
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
