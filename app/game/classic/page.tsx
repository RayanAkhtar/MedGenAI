'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useGame } from '@/app/context/GameContext';

interface UserGuess {
    imageId: number;
    userGuessType: 'real' | 'ai';
    correct: boolean;
}

export default function ClassicGame() {
    const router = useRouter();
    const { user } = useAuth();
    const { gameId, imageCount, images, clearGameData } = useGame();
    
    const [score, setScore] = useState(0);
    const [showRules, setShowRules] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [userGuesses, setUserGuesses] = useState<UserGuess[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Redirect if no game data is present
        if (!gameId || !imageCount || images.length === 0) {
            router.push('/dashboard');
        }
    }, [gameId, imageCount, images, router]);

    const handleGuess = async (guess: 'real' | 'ai') => {
        const currentImage = images[currentIndex];
        const correct = guess === currentImage.type;
        
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
        }

        // Store the guess
        setUserGuesses(prev => [...prev, {
            imageId: currentImage.id,
            userGuessType: guess,
            correct: correct
        }]);
        
        setShowFeedback(true);
        
        setTimeout(() => {
            setShowFeedback(false);
            setCurrentIndex(prev => prev + 1);
        }, 1500);
    };

    const finishGame = async () => {
        try {
            setIsSubmitting(true);
            const idToken = await user?.getIdToken(true);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/game/finish-classic-game`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    gameId: gameId,
                    userGuesses: userGuesses
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit game results');
            }

            // Clear game data and redirect to dashboard
            clearGameData();
            router.push('/dashboard');
        } catch (error) {
            console.error('Error submitting game results:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show game completion
    const isGameComplete = currentIndex >= images.length;

    if (isGameComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-white">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <h2 className="text-3xl font-bold mb-6">Game Complete!</h2>
                    <p className="text-2xl mb-4">Final Score: {score}/{images.length}</p>
                    <p className="text-lg mb-6 text-gray-600">
                        Accuracy: {Math.round((score / images.length) * 100)}%
                    </p>
                    <button 
                        onClick={finishGame}
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
                        ) : (
                            'Return to Dashboard'
                        )}
                    </button>
                </div>
            </div>
        );
    }

    const currentImage = images[currentIndex];

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
                        <h2 className="text-2xl font-bold mb-4">Game #{gameId}</h2>
                        <p className="mb-6">Analyze {imageCount} images and determine if they're real or AI-generated.</p>
                        <ul className="mb-6 space-y-2">
                            <li>• Each correct guess earns you a point</li>
                            <li>• You'll get immediate feedback after each guess</li>
                            <li>• Try to get the highest score possible!</li>
                        </ul>
                        <button 
                            onClick={() => setShowRules(false)}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
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
                    <div className="flex justify-center gap-4">
                        <p className="text-xl">Score: {score}</p>
                        <p className="text-xl">Image: {currentIndex + 1}/{images.length}</p>
                    </div>
                </div>

                {/* Single Image Display */}
                <div className="relative aspect-[4/3] mb-8 rounded-xl overflow-hidden shadow-lg">
                    {currentImage?.path && (
                        <Image
                            src={currentImage.path}
                            alt="Game image"
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    )}
                    
                    {/* Feedback Overlay */}
                    {showFeedback && (
                        <div className={`absolute inset-0 flex items-center justify-center
                            ${isCorrect ? 'bg-green-500/50' : 'bg-red-500/50'}`}>
                            <div className="bg-white px-6 py-3 rounded-lg text-xl font-bold">
                                {isCorrect ? 'Correct!' : 'Incorrect!'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Game Controls */}
                <div className="flex justify-center gap-6">
                    <button
                        onClick={() => !showFeedback && handleGuess('real')}
                        disabled={showFeedback}
                        className="px-8 py-4 bg-green-500 text-white text-lg font-medium rounded-xl
                                 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors"
                    >
                        Real Image
                    </button>
                    <button
                        onClick={() => !showFeedback && handleGuess('ai')}
                        disabled={showFeedback}
                        className="px-8 py-4 bg-red-500 text-white text-lg font-medium rounded-xl
                                 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors"
                    >
                        AI Generated
                    </button>
                </div>
            </div>
        </div>
    );
}
