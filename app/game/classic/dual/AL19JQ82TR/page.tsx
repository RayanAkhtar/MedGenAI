"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const imageFilenames = [
  "181.jpg",
  "520.jpg",
  "734.jpg",
  "1008.jpg",
  "1214.jpg",
  "1325.jpg",
  "1835.jpg",
  "1917.jpg",
  "1971.jpg",
  "2098.jpg",
  "2254.jpg",
  "2374.jpg",
  "2921.jpg",
  "3123.jpg",
];

function getRandomImages() {
  const shuffled = imageFilenames.sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

export default function ClassicDualGame() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [leftImage, setLeftImage] = useState<string | null>(null);
  const [rightImage, setRightImage] = useState<string | null>(null);

  useEffect(() => {
    const [left, right] = getRandomImages();
    setLeftImage(`/images/mock/${left}`);
    setRightImage(`/images/mock/${right}`);
  }, [currentRound]);

  const handleGuess = (guess: "left" | "right") => {
    const correct = guess === "left"; // Mock logic for correct guess
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setCurrentRound((prev) => prev + 1);
    }, 1500);
  };

  if (currentRound >= 10) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-black">Game Complete!</h2>
          <p className="text-2xl mb-4 text-black">Final Score: {score}/10</p>
          <p className="text-lg mb-6 text-black">
            Accuracy: {Math.round((score / 10) * 100)}%
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-black">Counter Factual</h1>
          <div className="flex justify-center gap-4">
            <p className="text-xl text-black">Score: {score}</p>
            <p className="text-xl text-black">Round: {currentRound + 1}/10</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div
            onClick={() => handleGuess("left")}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
          >
            {leftImage && (
              <Image
                src={leftImage}
                alt="Left image"
                fill
                className="object-cover rounded-lg"
              />
            )}
          </div>
          <div
            onClick={() => handleGuess("right")}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
          >
            {rightImage && (
              <Image
                src={rightImage}
                alt="Right image"
                fill
                className="object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {showFeedback && (
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              isCorrect ? "bg-green-500/50" : "bg-red-500/50"
            }`}
          >
            <div className="bg-white px-6 py-3 rounded-lg text-xl font-bold text-black">
              {isCorrect ? "Correct!" : "Incorrect!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
