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
                const response = await fetch(`http://127.0.0.1:5000/api/get_dual_game/${gameCode}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch game data");
                }
                const data = await response.json();
                setGameData(data);
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
