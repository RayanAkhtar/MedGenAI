"use client";
import React, { useState } from "react";

const DualGameMaker = () => {
  const [rounds, setRounds] = useState<
    { realImage: string | null; aiImage: string | null }[]
  >([{ realImage: null, aiImage: null }]);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameCode, setGameCode] = useState("");

  const handleGetRandomImage = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/get_random_img");
      const data = await response.json();
      const newRounds = [...rounds];
      newRounds[currentRound].realImage = data.imageUrl;
      setRounds(newRounds);
    } catch (error) {
      console.error("Error fetching random image:", error);
    }
  };

  const handleGenerateAIImage = async (type: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/get_random_img?type=${type}`
      );
      const data = await response.json();
      const newRounds = [...rounds];
      newRounds[currentRound].aiImage = data.imageUrl;
      setRounds(newRounds);
    } catch (error) {
      console.error("Error generating AI image:", error);
    }
  };

  const handleNextRound = () => {
    setRounds([...rounds, { realImage: null, aiImage: null }]);
    setCurrentRound(currentRound + 1);
  };

  const handleFinish = () => {
    setGameCode(Math.random().toString(36).substring(2, 15));
  };

  return (
    <div className="p-4">
      {gameCode ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Created</h2>
          <p className="mb-4">Game Code: {gameCode}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            onClick={() => (window.location.href = "/game/competitions")}
          >
            Create Competition
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Round {currentRound + 1}</h2>
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div className="p-4 border rounded-lg shadow-md">
              <div>
                {rounds[currentRound].realImage && (
                  <img
                    src={rounds[currentRound].realImage}
                    alt="Real"
                    className="w-full h-96 object-cover rounded-lg mt-4"
                  />
                )}
              </div>
            </div>
            <div className="p-4 border rounded-lg shadow-md flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold mb-4">
                Counter Factual Options
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  onClick={() => handleGenerateAIImage("male")}
                >
                  Male
                </button>
                <button
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-700 transition-colors duration-300"
                  onClick={() => handleGenerateAIImage("female")}
                >
                  Female
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  onClick={() => handleGenerateAIImage("healthy")}
                >
                  Healthy
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                  onClick={() => handleGenerateAIImage("diseased")}
                >
                  Diseased
                </button>
              </div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 mb-8"
                onClick={handleGetRandomImage}
              >
                Get Random Image
              </button>
              <div className="text-center">
                <button
                  className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  onClick={handleNextRound}
                >
                  Next
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                  onClick={handleFinish}
                >
                  Finish
                </button>
              </div>
            </div>
            <div className="p-4 border rounded-lg shadow-md">
              <div>
                {rounds[currentRound].aiImage && (
                  <img
                    src={rounds[currentRound].aiImage}
                    alt="AI"
                    className="w-full h-96 object-cover rounded-lg mt-4"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualGameMaker;
