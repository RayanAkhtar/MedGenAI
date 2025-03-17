"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DualGame from "@/app/components/DualGame";
import { auth } from "@/app/firebase/firebase";

const DualGamePage: React.FC = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const num_rounds = searchParams.get("num_rounds");

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("No user logged in");
        }
        const idToken = await currentUser.getIdToken(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/game/initialize-classic-dual-game`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              num_rounds: parseInt(num_rounds as string, 10),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to initialize game");
        }

        const data = await response.json();
        console.log("Custom game initialized:", data);
        const game_data = data.game_data;
        console.log("Game data:", game_data);

        const updatedGameData = {
          ...game_data,
          rounds: game_data.rounds.map((round: any) => ({
            ...round,
            images: round.images.map((image: any) => ({
              ...image,
              url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${image.url}`,
            })),
          })),
        };

        setGameData(updatedGameData);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing game:", error);
        setLoading(false);
      }
    };

    if (num_rounds) {
      initializeGame();
    }
  }, [num_rounds]); // Ensure this useEffect runs only once and re-runs if num_rounds changes

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
