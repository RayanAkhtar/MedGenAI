"use client";
import React, { useState } from "react";
import Image from "next/image";

const DualGameMaker = () => {
  const [rounds, setRounds] = useState<
    { realImage: string | null; aiImage: string | null }[]
  >([{ realImage: null, aiImage: null }]);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameCode, setGameCode] = useState("");

  const handleGetRandomImage = async () => {
    // const response = await fetch("http://127.0.0.1:5000/api/get_random_img");
    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/generateImage`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch image");
      }

      const data = await response.json();
      console.log("Raw API response:", data);
      const newRounds = [...rounds];
      newRounds[currentRound].realImage = data.imagePath;
      setRounds(newRounds);
    } catch (error) {
      console.error("Error getting real image", error);
    }
  };

  const handleGenerateAIImage = async () => {
    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/generateImage`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch image");
      }
      const data = await response.json();
      const newRounds = [...rounds];
      newRounds[currentRound].aiImage = data.imagePath;
      setRounds(newRounds);
    } catch (error) {
      console.error("Error generating AI image:", error);
    }
  };

  const handleNextRound = () => {
    setRounds([...rounds, { realImage: null, aiImage: null }]);
    setCurrentRound(currentRound + 1);
  };

  const handleFinish = async () => {
    const img_urls = rounds.flatMap((round) => [
      round.realImage,
      round.aiImage,
    ]);
    const gameData = {
      username: "admin",
      image_urls: img_urls,
      game_board: "dual",
      game_mode: "competitive",
      game_status: "active",
    };
    console.log("gameData", gameData);

    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/createDualGame`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create dual game");
    }

    const data = await response.json();
    console.log("Raw API response:", data);

    setGameCode(data.game_code);

    // setGameCode(Math.random().toString(36).substring(2, 15));
  };

  return (
    <div className="p-4">
      {gameCode ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Created</h2>
          <p className="mb-4">Game Code: {gameCode}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            onClick={() =>
              (window.location.href =
                "/admin/competitions?game_code=" + gameCode)
            }
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
                  <Image
                    src={rounds[currentRound].realImage}
                    alt="Real"
                    className="w-full h-96 object-cover rounded-lg mt-4"
                    width={500}
                    height={500}
                  />
                )}
              </div>
            </div>
            <div className="p-4 border rounded-lg shadow-md flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold mb-4">
                Counter Factual Options
              </h3>
              {rounds[currentRound].realImage && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    onClick={() => handleGenerateAIImage()}
                  >
                    Male
                  </button>
                  <button
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-700 transition-colors duration-300"
                    onClick={() => handleGenerateAIImage()}
                  >
                    Female
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                    onClick={() => handleGenerateAIImage()}
                  >
                    Healthy
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                    onClick={() => handleGenerateAIImage()}
                  >
                    Diseased
                  </button>
                </div>
              )}
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 mb-8"
                onClick={handleGetRandomImage}
              >
                Get Random Image
              </button>
              <div className="text-center">
                {rounds[currentRound].realImage &&
                  rounds[currentRound].aiImage && (
                    <>
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
                    </>
                  )}
              </div>
            </div>
            <div className="p-4 border rounded-lg shadow-md">
              <div>
                {rounds[currentRound].aiImage && (
                  <Image
                    src={rounds[currentRound].aiImage}
                    alt="AI"
                    className="w-full h-96 object-cover rounded-lg mt-4"
                    width={500}
                    height={500}
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
