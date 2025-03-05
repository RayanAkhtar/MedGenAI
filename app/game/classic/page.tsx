'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useGame } from '@/app/context/GameContext';
import FeedbackBox from '@/app/game/feedback';

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

export default function ClassicGame() {
    const router = useRouter();
    const { user } = useAuth();
    const { gameId, imageCount, images, clearGameData } = useGame();
    const imageRef = useRef<HTMLDivElement>(null);
    
    const [score, setScore] = useState(0);
    const [showRules, setShowRules] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [userGuesses, setUserGuesses] = useState<UserGuess[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState('');
    const [clickPosition, setClickPosition] = useState<ClickPosition | null>(null);
    const [showClickPrompt, setShowClickPrompt] = useState(false);
    const [canRepositionMarker, setCanRepositionMarker] = useState(false);
    const [showCompletionScreen, setShowCompletionScreen] = useState(false);

    useEffect(() => {
        // Redirect if no game data is present
        console.log("Game data check:", { gameId, imageCount, images }) // Debug log
        if (!gameId || !imageCount || images.length === 0) {
            console.log("Missing game data, redirecting to dashboard") // Debug log
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

        // Store the guess with the format expected by the backend
        const newGuess: UserGuess = {
            url: currentImage.path,
            guess: guess
        };
        
        setUserGuesses(prev => [...prev, newGuess]);
        setShowFeedback(true);
        
        // After showing feedback, if they guessed AI, show click prompt
        setTimeout(() => {
            setShowFeedback(false);
            if (guess === 'ai') {
                setShowClickPrompt(true);
                setCanRepositionMarker(true);
            } else {
                // If they guessed real, check if this was the last image
                if (currentIndex === images.length - 1) {
                    // This was the last image, submit results
                    submitGameResults([...userGuesses, newGuess]);
                } else {
                    // Move to next image
                    setCurrentIndex(prev => prev + 1);
                }
            }
        }, 1500);
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
            setShowFeedbackForm(true);
        }
    };

    const handleFeedbackSubmit = (feedback: string) => {
        // Update the last guess with the feedback and click position
        const updatedGuesses = [...userGuesses];
        updatedGuesses[updatedGuesses.length - 1] = {
            ...updatedGuesses[updatedGuesses.length - 1],
            feedback: feedback.trim() ? feedback : undefined,
            x: clickPosition?.x,
            y: clickPosition?.y
        };
        
        setUserGuesses(updatedGuesses);
        
        // Check if this was the last image
        if (currentIndex === images.length - 1) {
            // This was the last image, submit results
            submitGameResults(updatedGuesses);
        } else {
            // Move to next image
            setShowFeedbackForm(false);
            setCurrentFeedback('');
            setClickPosition(null);
            setCanRepositionMarker(false);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleSkipFeedback = () => {
        // Keep the click position even if they skip text feedback
        const updatedGuesses = [...userGuesses];
        if (clickPosition) {
            updatedGuesses[updatedGuesses.length - 1] = {
                ...updatedGuesses[updatedGuesses.length - 1],
                x: clickPosition.x,
                y: clickPosition.y
            };
        }
        
        setUserGuesses(updatedGuesses);
        
        // Check if this was the last image
        if (currentIndex === images.length - 1) {
            // This was the last image, submit results
            submitGameResults(updatedGuesses);
        } else {
            // Move to next image
            setShowFeedbackForm(false);
            setCurrentFeedback('');
            setClickPosition(null);
            setCanRepositionMarker(false);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const submitGameResults = async (finalGuesses: UserGuess[]) => {
        try {
            setIsSubmitting(true);
            const idToken = await user?.getIdToken(true);
            
            console.log("Submitting game results:", {
                gameId,
                userGuesses: finalGuesses
            });
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/game/finish-classic-game`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    gameId: gameId,
                    userGuesses: finalGuesses
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit game results');
            }

            const result = await response.json();
            console.log("Game submission result:", result);

            // Show completion screen
            setShowCompletionScreen(true);
            
        } catch (error) {
            console.error('Error submitting game results:', error);
            // Show completion screen anyway, but we could add an error state
            setShowCompletionScreen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const returnToDashboard = () => {
        // Clear game data and redirect to dashboard
        clearGameData();
        router.push('/dashboard');
    };

    // Show game completion screen
    if (showCompletionScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-white">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <h2 className="text-3xl font-bold mb-6">Game Complete!</h2>
                    <p className="text-2xl mb-4">Final Score: {score}/{images.length}</p>
                    <p className="text-lg mb-6 text-gray-600">
                        Accuracy: {Math.round((score / images.length) * 100)}%
                    </p>
                    <button 
                        onClick={returnToDashboard}
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
        <div className="min-h-screen bg-white dark:bg-white p-8">
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
                        <p className="mb-6">Analyze {imageCount} images and determine if they&apos;re real or AI-generated.</p>
                        <ul className="mb-6 space-y-2">
                            <li>• Each correct guess earns you a point</li>
                            <li>• You&apos;ll get immediate feedback after each guess</li>
                            <li>• For AI images, click on the part that looks AI-generated</li>
                            <li>• You can reposition the marker by clicking elsewhere</li>
                            <li>• You can provide optional feedback for each AI image</li>
                            <li>• Your results will be submitted automatically when you finish</li>
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
                <div 
                    ref={imageRef}
                    onClick={handleImageClick}
                    className={`relative aspect-[4/3] mb-8 rounded-xl overflow-hidden shadow-lg 
                              ${(showClickPrompt || canRepositionMarker) ? 'cursor-pointer' : ''}`}
                >
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
                    
                    {/* Click Prompt Overlay */}
                    {showClickPrompt && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="bg-white px-6 py-3 rounded-lg text-lg font-medium max-w-xs text-center">
                                Click on the part of the image that looks AI-generated
                            </div>
                        </div>
                    )}
                    
                    {/* Show marker where user clicked */}
                    {clickPosition && (showFeedbackForm || canRepositionMarker) && (
                        <div 
                            className="absolute w-6 h-6 rounded-full bg-red-500 border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ 
                                left: `${clickPosition.x}%`, 
                                top: `${clickPosition.y}%` 
                            }}
                        />
                    )}
                </div>

                {/* Repositioning hint */}
                {canRepositionMarker && clickPosition && showFeedbackForm && (
                    <div className="text-center mb-4 text-sm text-gray-600">
                        Click anywhere on the image to reposition the marker
                    </div>
                )}

                {/* Feedback Form */}
                {showFeedbackForm ? (
                    <div className="mb-8">
                        <FeedbackBox 
                            onSubmit={(feedback) => handleFeedbackSubmit(feedback)}
                            onSkip={handleSkipFeedback}
                            initialValue={currentFeedback}
                            showMarker={!!clickPosition}
                            isLastQuestion={currentIndex === images.length - 1}
                        />
                    </div>
                ) : (
                    /* Game Controls - Only show if not in click prompt mode */
                    !showClickPrompt && (
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
                    )
                )}
            </div>
        </div>
    );
}
