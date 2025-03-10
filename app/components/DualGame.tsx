"use client";
import React, { useState, useEffect } from "react";
import ConfidenceSelector from "./ConfidenceSelector";
import FeedbackPopup from "./FeedbackPopup";
import GameComplete from "./GameComplete";
import Timer from "./Timer";
import ScoreDisplay from "./ScoreDisplay";
import Loader from "./Loader";
import GameBackground from "./GameBackground";
import { useGame } from "@/app/context/GameContext";
import { useRouter } from "next/navigation";

interface DualGameProps {
  gameMode: "classic" | "competition" | "custom";
  gameData: {
    gameId: string;
    gameCode: string;
    gameMode: string;
    rounds: {
      roundId: string;
      images: {
        id: string;
        url: string;
        isCorrect: boolean;
      }[];
    }[];
    settings: {
      timerPerRound: number;
      maxRounds: number;
    };
  };
}

const DualGame: React.FC<DualGameProps> = ({ gameMode, gameData }) => {
  const {
    gameId,
    images: gameImages,
    selectedImages,
    setSelectedImages,
    setGameData,
    clearGameData,
  } = useGame();

  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [currentRound, setCurrentRound] = useState(0);

  const rounds = gameData.rounds;
  const timerPerRound = gameData.settings.timerPerRound;
  console.log("gameData", gameData);
  useEffect(() => {
    setGameData(
      gameData.gameCode,
      rounds.length,
      rounds.flatMap((round) =>
        round.images.map((image) => ({
          id: Number(image.id),
          path: image.url,
          type: image.isCorrect ? "real" : "ai",
        }))
      )
    );
  }, []); // Ensure this useEffect runs only once

  useEffect(() => {
    if (currentRound >= rounds.length) {
      setIsTimeUp(true);
    }
  }, [currentRound, rounds.length]);

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
  };

  const handleConfidenceSelect = (score: number) => {
    setConfidenceScore(score);
  };

  const handleNext = () => {
    const selectedImageData = rounds[currentRound].images.find(
      (img) => img.url === selectedImage
    );
    if (selectedImageData) {
      if (selectedImageData.isCorrect) {
        setScore(score + 10);
        setCorrectCount(correctCount + 1);
      } else {
        setScore(score + 2);
      }
    }
    setIsFeedbackOpen(true);
    setIsTimerRunning(false);
  };

  const handleFeedbackSubmit = (
    feedback: string,
    clickPosition: { x: number; y: number } | null
  ) => {
    console.log("Feedback submitted:", feedback, clickPosition);
    setIsFeedbackOpen(false);
    setSelectedImage(null);
    setConfidenceScore(null);
    setIsTimerRunning(true);
    setCurrentRound(currentRound + 1);
  };

  const handleSkipFeedback = () => {
    setIsFeedbackOpen(false);
    setSelectedImage(null);
    setConfidenceScore(null);
    setIsTimerRunning(true);
    setCurrentRound(currentRound + 1);
  };

  const handleReturnToDashboard = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearGameData();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error clearing game data', error);
      router.push('/dashboard');
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  if (!gameId) {
    return <Loader message="Loading game..." />;
  }

  return (
    <div className="p-4 space-y-4 h-screen flex flex-col justify-center">
      <GameBackground />
      {!isTimeUp && currentRound < rounds.length && (
        <div className="flex justify-between items-start gap-6 p-4 flex-grow">
          <div className="flex-1 flex justify-center">
            {rounds[currentRound].images.slice(0, 1).map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 ${
                  selectedImage === image.url
                    ? "border-4 border-blue-500"
                    : "border-2 border-gray-300"
                }`}
                style={{
                  width: "100%",
                  height: "auto",
                  padding: "4px", // Ensures consistent padding inside borders
                  backgroundColor: "white", // Keeps a consistent background
                }}
                onClick={() => handleImageSelect(image.url)}
              >
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
          <div className="h-full flex flex-col items-center justify-apart space-y-4">
            <ScoreDisplay
              score={score}
              correctCount={correctCount}
              isHidden={gameMode === "competition"}
            />
            {isTimerRunning && (
              <Timer onTimeUp={handleTimeUp} duration={timerPerRound} />
            )}
            {selectedImage && (
              <div>
                <p className="text-lg font-semibold">Select confidence</p>
                <ConfidenceSelector onSelect={handleConfidenceSelect} />
              </div>
            )}
            {selectedImage && confidenceScore !== null && (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            {rounds[currentRound].images.slice(1).map((image, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 ${
                  selectedImage === image.url
                    ? "border-4 border-blue-500"
                    : "border-2 border-gray-300"
                }`}
                style={{
                  width: "100%",
                  height: "auto",
                  padding: "4px", // Ensures consistent padding inside borders
                  backgroundColor: "white", // Keeps a consistent background
                }}
                onClick={() => handleImageSelect(image.url)}
              >
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {isTimeUp && (
        
          <GameComplete
            score={score}
            totalImages={rounds.length}
            gameId={gameId}
            returnToDashboard={handleReturnToDashboard}
            playAgain={handlePlayAgain}
          />
      )}
      <FeedbackPopup
        isOpen={isFeedbackOpen}
        onClose={() => {
          setIsFeedbackOpen(false);
          setIsTimerRunning(true);
        }}
        onSubmit={handleFeedbackSubmit}
        onSkip={handleSkipFeedback}
        imageUrl={selectedImage || ""}
      />
    </div>
  );
};

export default DualGame;
