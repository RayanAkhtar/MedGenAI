"use client";
import React, { useEffect, useState } from "react";
import DualGame from "@/app/components/DualGame";

const DualGamePage: React.FC = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/initialize_dual_game",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ num_rounds: 5 }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to initialize game");
        }

        const data = await response.json();
        const { gameCode } = data;

        const gameResponse = await fetch(
          `http://localhost:5000/api/get_dual_game/${gameCode}`
        );

        if (!gameResponse.ok) {
          throw new Error("Failed to fetch game data");
        }

        const gameData = await gameResponse.json();
        setGameData(gameData);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing game:", error);
        setLoading(false);
      }
    };

    initializeGame();
  }, []); // Ensure this useEffect runs only once

  if (loading) {
    return <div>Loading...</div>;
  }

  return gameData ? (
    <DualGame gameMode="classic" gameData={gameData} />
  ) : (
    <div>Error loading game</div>
  );
};

export default DualGamePage;
