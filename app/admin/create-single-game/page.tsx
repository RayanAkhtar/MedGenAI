'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/firebase';

export default function CreateSingleGame() {
    const router = useRouter();
    const [imageCount, setImageCount] = useState<number>(10);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gameCode, setGameCode] = useState<string | null>(null);

    const handleCreateGame = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No user logged in");
            }

            const idToken = await user.getIdToken(true);
            const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/game/initialize-classic-game`;

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    imageCount: imageCount,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to initialize game");
            }

            const data = await response.json();
            console.log("Game created successfully:", data);
            setGameCode(data.gameId);
            
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Failed to create game:", error.message);
                setError(error.message);
            } else {
                console.error("An unknown error occurred:", error);
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
            <div className="max-w-4xl mx-auto p-6 text-black">
                <h1 className="text-2xl font-bold mb-6">Create Single Game</h1>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Images
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {[5, 10, 15, 20, 30, 40, 50].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setImageCount(num)}
                                    className={`py-2 px-3 rounded border text-sm font-medium transition-colors
                                        ${
                                            imageCount === num
                                                ? "bg-blue-500 text-white border-blue-500"
                                                : "border-gray-300 hover:border-blue-500"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}
                    
                    {gameCode ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-green-700 font-medium">Game created successfully!</p>
                                <p className="text-green-600 mt-1">Game Code: <span className="font-mono font-bold">{gameCode}</span></p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => router.push(`/game/classic/single?code=${gameCode}`)}
                                    className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Play This Game
                                </button>
                                
                                <button
                                    onClick={() => router.push(`/admin/competitions?game_code=${gameCode}`)}
                                    className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                                >
                                    Create Competition with this Game
                                </button>
                            </div>
                            
                            <button
                                onClick={() => {
                                    setGameCode(null);
                                    setImageCount(10);
                                }}
                                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Create Another Game
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleCreateGame}
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                                     disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                                    Creating Game...
                                </div>
                            ) : (
                                "Create Single Game"
                            )}
                        </button>
                    )}
                </div>
            </div>
    );
}
