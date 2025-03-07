"use client";
import React, { useState } from "react";
import DualImageViewer from "../components/DualImageViewer";
import Timer from "../components/Timer";
import ConfidenceSelector from "../components/ConfidenceSelector";
import ScoreDisplay from "../components/ScoreDisplay";
import Summary from "../components/Summary";
import FeedbackPopup from "../components/FeedbackPopup";

const ParentComponent: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const images = ["https://picsum.photos/200", "https://picsum.photos/300"];

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
    setScore(score + 10); // Example scoring logic
    setCorrectCount(correctCount + 1); // Example correct count logic
    setIsFeedbackOpen(true);
  };

  const handleFeedbackSubmit = (feedback: string) => {
    console.log("Feedback submitted:", feedback);
    setIsFeedbackOpen(false);
    setSelectedImage(null);
    setConfidenceScore(null);
  };

  return (
    <div>
      <Timer onTimeUp={handleTimeUp} duration={10} />
      {!isTimeUp && (
        <>
          <DualImageViewer
            images={images}
            onSelect={handleImageSelect}
            selectedImage={selectedImage}
          />
          {selectedImage && (
            <div className="mt-4 flex justify-center">
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
              isHidden={false}
            />
          </div>
        </>
      )}
      {isTimeUp && (
        <div className="text-center text-red-500">
          Time's up!
          <Summary
            stats={{ score, correct: correctCount, avgTime: 10 }} // Example avgTime
            gameMode="classic"
          />
        </div>
      )}
      <FeedbackPopup
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default ParentComponent;
