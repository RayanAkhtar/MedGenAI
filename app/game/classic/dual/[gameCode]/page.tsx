"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import DualGame from "@/app/components/DualGame";
import Loader from "@/app/components/Loader";

const DualGamePage: React.FC = () => {
    const { gameCode } = useParams();

    const [gameData, setGameData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                // const response = await fetch(`http://127.0.0.1:5000/api/get_dual_game/${gameCode}`);
                // if (!response.ok) {
                //     throw new Error("Failed to fetch game data");
                // }
                // const data = await response.json();
                //setGameData(data);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/game/get_dual_game_by_code`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      game_code: gameCode,
                    }),
                  });
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
                            url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${image.url}`
                        }))
                    }))
                };
                
                setGameData(updatedGameData);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        if (gameCode) {
            fetchGameData();
        }
    }, [gameCode]);

    if (isLoading) {
        return <Loader message="Loading game data..." />;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            {gameData && <DualGame gameMode="classic" gameData={gameData} />}
        </div>
    );
};

export default DualGamePage;
