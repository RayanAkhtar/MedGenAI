'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CompetitiveGame() {
  const [showRules, setShowRules] = useState(true);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds game
  const [currentImages, setCurrentImages] = useState({
    image1: '/images/placeholder1.jpg',
    image2: '/images/placeholder2.jpg',
    aiImage: 'image1' // tracks which image is AI-generated
  });

  // Start timer when rules are closed
  useEffect(() => {
    if (!showRules && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            clearInterval(timer);
            // Game over - show final score
            setShowRules(true);
          }
          return time - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showRules, timeLeft]);

  const loadNextImages = () => {
    // TODO: Replace with real image loading
    setCurrentImages(prev => ({
      ...prev,
      aiImage: prev.aiImage === 'image1' ? 'image2' : 'image1'
    }));
  };

  const handleImageClick = (guess: 'ai' | 'real') => {
    const correct = (guess === 'ai' && currentImages.aiImage === 'image1') ||
                   (guess === 'real' && currentImages.aiImage === 'image2');
    
    if (correct) setScore(s => s + 100);
    loadNextImages();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {showRules && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => timeLeft > 0 && setShowRules(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {timeLeft === 60 ? 'Ready to Play?' : 'Game Over!'}
            </h2>
            
            {timeLeft === 60 ? (
              <>
                <p className="mb-4">Quick rules:</p>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                  <li>60 seconds on the clock</li>
                  <li>100 points per correct guess</li>
                  <li>Click the AI-generated image</li>
                  <li>Beat your high score!</li>
                </ul>
              </>
            ) : (
              <div className="text-center mb-6">
                <p className="text-xl mb-2">Final Score:</p>
                <p className="text-4xl font-bold text-blue-500">{score}</p>
              </div>
            )}

            <button 
              onClick={() => {
                if (timeLeft === 0) {
                  // Reset game
                  setScore(0);
                  setTimeLeft(60);
                }
                setShowRules(false);
              }}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {timeLeft === 60 ? "Let's Go!" : 'Play Again'}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Speed Round</h1>
          <div className="flex justify-center gap-8 text-xl">
            <p>Score: {score}</p>
            <p>Time: {timeLeft}s</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {[['ai', currentImages.image1], ['real', currentImages.image2]].map(([type, src]) => (
            <div 
              key={type}
              onClick={() => handleImageClick(type as 'ai' | 'real')}
              className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Image
                src={src}
                alt="Game image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowRules(true)}
          className="mx-auto mt-8 block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Show Rules
        </button>
      </div>
    </div>
  );
}
