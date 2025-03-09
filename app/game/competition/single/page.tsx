'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useGame } from '@/app/context/GameContext';
import { auth } from '@/app/firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface UserGuess {
    url: string;
    guess: 'real' | 'ai';
    feedback?: string;
    x?: number;  // Percentage from left (0-100)
    y?: number;  // Percentage from top (0-100)
}

interface ClickPosition {
    x: number;
    y: number;
}

export default function CompetitionGame() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { } = useAuth();
    const { gameId, imageCount, images, setGameData, clearGameData } = useGame();
    const imageRef = useRef<HTMLDivElement>(null);
    
    // This is the game identifier from the URL
    const urlGameId = searchParams.get('code');
    
    const [score, setScore] = useState(0);
    console.log(score)
    const [showRules, setShowRules] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userGuesses, setUserGuesses] = useState<UserGuess[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log(setIsSubmitting)
    const [clickPosition, setClickPosition] = useState<ClickPosition | null>(null);
    const [showClickPrompt, setShowClickPrompt] = useState(false);
    const [canRepositionMarker, setCanRepositionMarker] = useState(false);
    const [showCompletionScreen, setShowCompletionScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchGameData() {
            if (!gameId && urlGameId && !isLoading) {
                try {
                    setIsLoading(true);
                    const user = auth.currentUser;
                    if (!user) {
                        throw new Error("No user logged in");
                    }
                    const idToken = await user.getIdToken(true);
                    console.log('Fetching competition game data for game:', urlGameId);
                    
                    const response: Response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/game/get-game/${urlGameId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to fetch game data');
                    }

                    const data = await response.json();
                    console.log("Raw API response:", data);

                    if (data.images.length > 0) {
                        const formattedImages = data.images.map(
                            (img: { url: string; type: string }, index: number) => ({
                                id: index + 1,
                                path: `${process.env.NEXT_PUBLIC_API_BASE_URL}${img.url}`,
                                type: img.type,
                            })
                        );

                        console.log("Formatted images:", formattedImages);

                        // Set game data in context using the game ID from the response
                        setGameData(data.game_id, data.images.length, formattedImages);
                    }
                    
                } catch (error) {
                    console.error('Error fetching competition game data:', error);
                    setShowCompletionScreen(true);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        fetchGameData();
    }, [urlGameId, gameId, setGameData, isLoading]);

    const completeGame = () => {
        setShowCompletionScreen(true);
        // Play confetti animation on completion
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const handleGuess = async (guess: 'real' | 'ai') => {
        const currentImage = images[currentIndex];
        
        const correct = guess === currentImage.type;
        if (correct) {
            setScore(prev => prev + 1);
        }

        const newGuess: UserGuess = {
            url: currentImage.path,
            guess: guess
        };
        
        setUserGuesses(prev => [...prev, newGuess]);
        
        if (guess === 'ai') {
            setShowClickPrompt(true);
            setCanRepositionMarker(true);
        } else {
            if (currentIndex === images.length - 1) {
                completeGame();
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((!showClickPrompt && !canRepositionMarker) || !imageRef.current) return;
        
        const rect = imageRef.current.getBoundingClientRect();
        
        // Calculate position as percentage of the image dimensions
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        
        setClickPosition({ x, y });
        
        if (showClickPrompt) {
            setShowClickPrompt(false);
            
            // Update the last guess with the click position
            const updatedGuesses = [...userGuesses];
            updatedGuesses[updatedGuesses.length - 1] = {
                ...updatedGuesses[updatedGuesses.length - 1],
                x: x,
                y: y
            };
            
            setUserGuesses(updatedGuesses);
            
            // Check if this was the last image
            if (currentIndex === images.length - 1) {
                // This was the last image, show completion screen
                completeGame();
            } else {
                // Move to next image
                setCanRepositionMarker(false);
                setClickPosition(null);
                setCurrentIndex(prev => prev + 1);
            }
        }
    };

    const returnToDashboard = async () => {
        try {
            // Wait for a short delay to ensure data is processed
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Clear game data
            clearGameData();
            
            // Navigate to dashboard
            router.push('/dashboard');
        } catch (error) {
            console.error('Error returning to dashboard:', error);
            // Navigate anyway
            router.push('/dashboard');
        }
    };

    // Progress bar calculation
    const progressPercentage = ((currentIndex) / images.length) * 100;

    // Show game completion screen
    if (showCompletionScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full mx-4"
                >
                    <div className="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Competition Complete!</h2>
                    <p className="text-xl mb-6 text-blue-500 font-medium">Thank you for participating</p>
                    <p className="text-gray-600 mb-8 px-4">
                        Your results have been submitted and will be compared with other participants.
                    </p>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={returnToDashboard}
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
                                 shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed
                                 font-medium text-lg"
                    >
                        {isSubmitting ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mx-auto"></div>
                        ) : (
                            'Return to Dashboard'
                        )}
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const currentImage = images[currentIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-8">
            {/* Rules Modal */}
            <AnimatePresence>
                {showRules && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowRules(false)}
                    >
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-white rounded-2xl p-8 max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Competition Game #{gameId}</h2>
                            <div className="mb-6 px-4 py-2 bg-blue-50 rounded-lg text-blue-800 text-center">
                                Analyze {imageCount} images to win!
                            </div>
                            <ul className="mb-8 space-y-3">
                                <li className="flex items-start">
                                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">This is competition mode - no immediate feedback</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Click to mark AI-generated features</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Reposition markers by clicking elsewhere</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Results submit automatically when finished</span>
                                </li>
                            </ul>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowRules(false)}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium text-lg"
                            >
                                Start Competition
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Game UI */}
            <div className="max-w-4xl mx-auto">
                {/* Header with progress bar */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 text-white">Competition: Real or AI?</h1>
                    <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
                        <div className="flex justify-between w-full text-white">
                            <p className="text-lg">Image {currentIndex + 1} of {images.length}</p>
                            <p className="text-lg">Progress: {Math.round(progressPercentage)}%</p>
                        </div>
                        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Image Card */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-xl mb-8"
                >
                    {/* Image area */}
                    <div
                        ref={imageRef}
                        onClick={handleImageClick}
                        className={`relative aspect-[4/3] 
                                ${(showClickPrompt || canRepositionMarker) ? 'cursor-pointer' : ''}`}
                    >
                        {currentImage && (
                            <Image
                                src={currentImage.path}
                                alt={`Medical image ${currentIndex + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 800px"
                                className="object-contain"
                                priority
                            />
                        )}

                        {/* Click marker with pulse effect */}
                        {clickPosition && canRepositionMarker && (
                            <div className="absolute pointer-events-none" style={{ 
                                left: `${clickPosition.x}%`, 
                                top: `${clickPosition.y}%`
                            }}>
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full border-2 border-red-500 bg-red-500/30 transform -translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="absolute w-12 h-12 rounded-full border-2 border-red-500/50 animate-ping transform -translate-x-[calc(50%-2px)] -translate-y-[calc(50%-2px)]"></div>
                                </div>
                            </div>
                        )}

                        {/* Click prompt overlay */}
                        <AnimatePresence>
                            {showClickPrompt && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center"
                                >
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white p-6 rounded-xl max-w-xs text-center shadow-lg"
                                    >
                                        <div className="mb-2 mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <p className="font-medium text-gray-800">Click on the part of the image that looks AI-generated</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Action area at the bottom of the card */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        {/* Guess Buttons */}
                        {!showClickPrompt && !canRepositionMarker && (
                            <div className="flex flex-col items-center">
                                <p className="text-lg text-gray-700 mb-4 font-medium">Is this image real or AI-generated?</p>
                                <div className="flex justify-center gap-6 w-full max-w-xs">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleGuess('real')}
                                        className="w-full py-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-md font-medium text-lg flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Real
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleGuess('ai')}
                                        className="w-full py-4 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl shadow-md font-medium text-lg flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                        AI
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Repositioning instructions */}
                        {canRepositionMarker && !showClickPrompt && (
                            <div className="text-center">
                                <p className="text-gray-800 mb-4">Click anywhere on the image to reposition the marker</p>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        if (currentIndex === images.length - 1) {
                                            completeGame();
                                        } else {
                                            setCanRepositionMarker(false);
                                            setClickPosition(null);
                                            setCurrentIndex(prev => prev + 1);
                                        }
                                    }}
                                    className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                                >
                                    Continue
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
