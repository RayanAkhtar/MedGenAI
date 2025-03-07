"use client";
import React, { useEffect } from "react";
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
  images: string[];
  gameCode: string;
}

const DualGame: React.FC<DualGameProps> = ({ gameMode, images, gameCode }) => {
  const {
    gameId,
    images: gameImages,
    selectedImages,
    setSelectedImages,
    setGameData,
    clearGameData,
  } = useGame();

  useEffect(() => {
    setGameData(
      gameCode,
      images.length,
      images.map((image, index) => ({ id: index, path: image, type: "real" }))
    );
  }, [gameCode, images, setGameData]);

  const handleImageSelect = (image: string) => {
    setSelectedImages([{ id: 1, path: image, type: "real" }]); // Mock data for selected image
  };

  const handleFeedbackSubmit = (feedback: string) => {
    // Mock feedback submission logic
    console.log("Feedback submitted:", feedback);
    setSelectedImages([]);
  };

  if (!gameId) {
    return <Loader message="Loading game..." />;
  }

  if (selectedImages && selectedImages.length >= 10) {
    return (
      <Summary
        stats={{
          score: selectedImages.length,
          correct: selectedImages.length,
          avgTime: 0,
        }}
        gameMode={gameMode}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Timer onTimeUp={() => setSelectedImages([])} />
      <ScoreDisplay
        score={selectedImages ? selectedImages.length : 0}
        correctCount={selectedImages ? selectedImages.length : 0}
        isHidden={gameMode === "competition"}
      />
      <DualImageViewer
        images={gameImages.map((image) => image.path)}
        onSelect={handleImageSelect}
        selectedImage={
          selectedImages && selectedImages.length > 0
            ? selectedImages[0].path
            : null
        }
      />
      <ConfidenceSelector
        onSelect={(confidence) =>
          console.log("Confidence selected:", confidence)
        }
      />
      <FeedbackPopup
        isOpen={!!selectedImages && selectedImages.length > 0}
        onClose={() => setSelectedImages([])}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default DualGame;
