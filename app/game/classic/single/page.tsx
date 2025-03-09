'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useGame } from '@/app/context/GameContext';
import FeedbackBox from '@/app/game/feedback';
import { auth } from '@/app/firebase/firebase';
import Link from 'next/link';

interface UserGuess {
  url: string;
  guess: 'real' | 'ai';
  feedback?: string;
  x?: number; // Percentage from left (0-100)
  y?: number; // Percentage from top (0-100)
}

interface ClickPosition {
  x: number;
  y: number;
}

export default function ClassicGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { gameId, imageCount, images, setGameData, clearGameData } = useGame();
  const imageRef = useRef<HTMLDivElement>(null);

  // This is the game identifier from the URL
  const urlGameId = searchParams.get('code');

  const [score, setScore] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userGuesses, setUserGuesses] = useState<UserGuess[]>([]);
  const [, setIsSubmitting] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
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
          const currentUser = auth.currentUser;
          if (!currentUser) {
            throw new Error('No user logged in');
          }
          const idToken = await currentUser.getIdToken(true);
          console.log('Fetching game data for game:', urlGameId);

          const response: Response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/game/get-game/${urlGameId}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch game data');
          }

          const data = await response.json();
          console.log('Raw API response:', data);

          if (data.images.length > 0) {
            const formattedImages = data.images.map(
              (img: { url: string; type: string }, index: number) => ({
                id: index + 1,
                path: `${process.env.NEXT_PUBLIC_API_BASE_URL}${img.url}`,
                type: img.type,
              })
            );

            console.log('Formatted images:', formattedImages);

            // Set game data in context using the game ID from the response
            setGameData(data.game_id, data.images.length, formattedImages);
          }
        } catch (error) {
          console.error('Error fetching game data:', error);
          setShowCompletionScreen(true);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchGameData();
  }, [urlGameId, gameId, setGameData, isLoading]);

  const handleGuess = async (guess: 'real' | 'ai') => {
    const currentImage = images[currentIndex];
    const correct = guess === currentImage.type;

    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }

    // Store the guess with the format expected by the backend
    const newGuess: UserGuess = {
      url: currentImage.path,
      guess: guess,
    };

    setUserGuesses((prev) => [...prev, newGuess]);
    setShowFeedback(true);

    // After showing feedback, if they guessed AI, show click prompt
    setTimeout(() => {
      setShowFeedback(false);
      if (guess === 'ai') {
        setShowClickPrompt(true);
        setCanRepositionMarker(true);
      } else {
        if (currentIndex === images.length - 1) {
          submitGameResults([...userGuesses, newGuess]);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    }, 1500);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((!showClickPrompt && !canRepositionMarker) || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setClickPosition({ x, y });

    if (showClickPrompt) {
      setShowClickPrompt(false);
      setShowFeedbackForm(true);
    }
  };

  const handleFeedbackSubmit = (feedback: string) => {
    const updatedGuesses = [...userGuesses];
    updatedGuesses[updatedGuesses.length - 1] = {
      ...updatedGuesses[updatedGuesses.length - 1],
      feedback: feedback.trim() ? feedback : undefined,
      x: clickPosition?.x,
      y: clickPosition?.y,
    };

    setUserGuesses(updatedGuesses);

    if (currentIndex === images.length - 1) {
      submitGameResults(updatedGuesses);
    } else {
      setShowFeedbackForm(false);
      setCurrentFeedback('');
      setClickPosition(null);
      setCanRepositionMarker(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkipFeedback = () => {
    const updatedGuesses = [...userGuesses];
    if (clickPosition) {
      updatedGuesses[updatedGuesses.length - 1] = {
        ...updatedGuesses[updatedGuesses.length - 1],
        x: clickPosition.x,
        y: clickPosition.y,
      };
    }

    setUserGuesses(updatedGuesses);

    if (currentIndex === images.length - 1) {
      submitGameResults(updatedGuesses);
    } else {
      setShowFeedbackForm(false);
      setCurrentFeedback('');
      setClickPosition(null);
      setCanRepositionMarker(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkipMarker = () => {
    const updatedGuesses = [...userGuesses];

    if (currentIndex === images.length - 1) {
      submitGameResults(updatedGuesses);
    } else {
      setShowClickPrompt(false);
      setClickPosition(null);
      setCanRepositionMarker(false);
      setShowFeedbackForm(false);
      setCurrentFeedback('');
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const submitGameResults = async (finalGuesses: UserGuess[]) => {
    try {
      setIsSubmitting(true);
      const idToken = await user?.getIdToken(true);

      console.log('Submitting game results for gameId:', gameId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/game/finish-classic-game`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            gameId: gameId,
            userGuesses: finalGuesses,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit game results');
      }

      const result = await response.json();
      console.log('Game submission result:', result);
      setShowCompletionScreen(true);
    } catch (error) {
      console.error('Error submitting game results:', error);
      setShowCompletionScreen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnToDashboard = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearGameData();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error returning to dashboard:', error);
      router.push('/dashboard');
    }
  };

  if (showCompletionScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 animate-fadeIn">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Complete!</h2>
              <div className="w-full bg-gray-100 rounded-full h-1 mb-6"></div>

              <div className="grid grid-cols-2 gap-8 w-full text-center mb-6">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Your Score</p>
                  <p className="text-4xl font-bold text-gray-800">{score}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Accuracy</p>
                  <p className="text-4xl font-bold text-gray-800">
                    {Math.round((score / images.length) * 100)}%
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-100 h-3 rounded-full mb-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.round((score / images.length) * 100)}%` }}
                ></div>
              </div>
              <p className="text-gray-500 text-sm mb-8">
                You got {score} out of {images.length} images correct
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={returnToDashboard}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] hover:shadow-lg"
              >
                Return to Dashboard
              </button>

              <Link
                href={`/admin/competitions?game_code=${gameId}`}
                className="block w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-[1.02] hover:shadow-lg text-center"
              >
                Create Competition with this Game
              </Link>

              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setScore(0);
                  setUserGuesses([]);
                  setShowCompletionScreen(false);
                  setShowRules(true);
                }}
                className="w-full py-4 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, black 2%, transparent 0%), radial-gradient(circle at 75px 75px, black 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setShowRules(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200 shadow-2xl transform transition-all animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Game #{gameId}</h2>
            </div>

            <p className="mb-6 text-gray-700">
              Analyze {imageCount} images and determine if they&apos;re real or AI-generated.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold">1</span>
                </div>
                <p className="text-gray-600">Each correct guess earns you a point</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold">2</span>
                </div>
                <p className="text-gray-600">You&apos;ll get immediate feedback after each guess</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold">3</span>
                </div>
                <p className="text-gray-600">For AI images, click on the part that looks AI-generated</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold">4</span>
                </div>
                <p className="text-gray-600">You can reposition the marker by clicking elsewhere</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold">5</span>
                </div>
                <p className="text-gray-600">You can provide optional feedback for each AI image</p>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] hover:shadow-lg"
            >
              Start Playing
            </button>
          </div>
        </div>
      )}

      {/* Main Game UI */}
      <div className="container max-w-5xl mx-auto px-4 py-10 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
            Real or AI?
          </h1>

          <div className="grid grid-cols-2 gap-6 w-full max-w-xs mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Score</p>
              <p className="text-2xl font-bold text-gray-800">{score}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-center">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                {currentIndex + 1}/{images.length}
              </p>
            </div>
          </div>

          <div className="w-full max-w-xl h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex) / images.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Single Image Display */}
        <div
          ref={imageRef}
          onClick={handleImageClick}
          className={`relative mx-auto max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden shadow-xl mb-8 border border-gray-200 transform transition-all duration-300 ${
            showClickPrompt || canRepositionMarker
              ? 'cursor-pointer scale-[1.01] shadow-blue-500/20'
              : ''
          }`}
        >
          {currentImage?.path && (
            <div className="w-full h-full relative">
              <Image
                src={currentImage.path}
                alt="Game image"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Feedback Overlay */}
          {showFeedback && (
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                isCorrect
                  ? 'bg-gradient-to-br from-green-500/70 to-emerald-700/70'
                  : 'bg-gradient-to-br from-red-500/70 to-pink-700/70'
              } backdrop-blur-sm animate-fadeIn`}
            >
              <div
                className={`transform px-10 py-5 rounded-full text-2xl font-bold text-white ${
                  isCorrect
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-red-500 to-pink-600'
                } shadow-2xl animate-bounce-once`}
              >
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </div>
            </div>
          )}

          {/* Click Prompt Overlay with Skip Button */}
          {showClickPrompt && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white border border-gray-200 backdrop-blur-md px-8 py-5 rounded-xl text-xl font-medium max-w-md text-center mb-6 shadow-2xl text-gray-800 transform animate-bounce-once">
                Click on the part of the image that looks AI-generated
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkipMarker();
                }}
                className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-xl font-medium transition-all transform hover:scale-105"
              >
                Skip Marker
              </button>
            </div>
          )}

          {/* Show marker where user clicked */}
          {clickPosition && (showFeedbackForm || canRepositionMarker) && (
            <div
              className="absolute z-10 pointer-events-none"
              style={{ left: `${clickPosition.x}%`, top: `${clickPosition.y}%` }}
            >
              <div className="absolute w-12 h-12 -ml-6 -mt-6">
                <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-30 animate-ping"></div>
                <div className="absolute inset-[4px] rounded-full bg-red-500 transform-gpu animate-pulse"></div>
                <div className="absolute inset-[30%] rounded-full bg-white"></div>
              </div>
            </div>
          )}
        </div>

        {/* Repositioning hint */}
        {canRepositionMarker && clickPosition && showFeedbackForm && (
          <div className="flex justify-center mb-6">
            <div className="text-center text-sm text-gray-600 bg-white py-2 px-4 rounded-full inline-block shadow-md">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Click anywhere on the image to reposition the marker</span>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        {showFeedbackForm ? (
          <div className="max-w-2xl mx-auto animate-fadeIn">
            <FeedbackBox
              onSubmit={(feedback) => handleFeedbackSubmit(feedback)}
              onSkip={handleSkipFeedback}
              initialValue={currentFeedback}
              showMarker={!!clickPosition}
              isLastQuestion={currentIndex === images.length - 1}
            />
          </div>
        ) : (
          !showClickPrompt && (
            <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
              <button
                onClick={() => !showFeedback && handleGuess('real')}
                disabled={showFeedback}
                className="py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.03] disabled:transform-none"
              >
                <div className="flex items-center justify-center">
                  <div className="mr-3 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Real Image
                </div>
              </button>
              <button
                onClick={() => !showFeedback && handleGuess('ai')}
                disabled={showFeedback}
                className="py-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg font-medium rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.03] disabled:transform-none"
              >
                <div className="flex items-center justify-center">
                  <div className="mr-3 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  AI Generated
                </div>
              </button>
            </div>
          )
        )}
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceOnce {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-bounce-once {
          animation: bounceOnce 0.5s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
