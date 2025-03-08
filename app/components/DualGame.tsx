"use client";
import React, { useState, useEffect } from "react";
import DualImageViewer from "./DualImageViewer";
import ConfidenceSelector from "./ConfidenceSelector";
import FeedbackPopup from "./FeedbackPopup";
import Summary from "./Summary";
import Timer from "./Timer";
import ScoreDisplay from "./ScoreDisplay";
import Loader from "./Loader";
import { useGame } from "@/app/context/GameContext";

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

  if (!gameId) {
    return <Loader message="Loading game..." />;
  }

  return (
    <div className="p-4 space-y-4">
      {isTimerRunning && currentRound < rounds.length && (
        <Timer onTimeUp={handleTimeUp} duration={timerPerRound} />
      )}
      {!isTimeUp && currentRound < rounds.length && (
        <>
          <DualImageViewer
            images={rounds[currentRound].images.map((img) => img.url)}
            onSelect={handleImageSelect}
            selectedImage={selectedImage}
          />
          {selectedImage && (
            <div className="mt-4 flex flex-col items-center">
              <p className="mb-2 text-lg font-semibold">Select confidence</p>
              <ConfidenceSelector onSelect={handleConfidenceSelect} />
            </div>
          )}
          {selectedImage && confidenceScore !== null && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <ScoreDisplay
              score={score}
              correctCount={correctCount}
              isHidden={gameMode === "competition"}
            />
          </div>
        </>
      )}
      {isTimeUp && (
        <div className="text-center text-red-500">
          Time's up!
          <Summary
            stats={{ score, correct: correctCount, avgTime: 10 }} // Example avgTime
            gameMode={gameMode}
          />
        </div>
      )}
      <FeedbackPopup
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
        imageUrl={selectedImage || ""}
      />
    </div>
  );
};

export default DualGame;
