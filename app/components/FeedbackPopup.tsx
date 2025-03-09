"use client";

import React, { useState } from "react";
import Modal from "./Modal";

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    feedback: string,
    clickPosition: { x: number; y: number } | null
  ) => void;
  onSkip: () => void;
  imageUrl: string;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
  imageUrl,
}) => {
  const [feedback, setFeedback] = useState("");
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setClickPosition({ x, y });
  };

  const handleSubmit = () => {
    onSubmit(feedback, clickPosition);
    setFeedback("");
    setClickPosition(null);
  };

  const handleSkip = () => {
    onSkip();
    setFeedback("");
    setClickPosition(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Provide Feedback">
      <div
        className="relative aspect-[4/3] mb-4 rounded-xl overflow-hidden shadow-lg cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={imageUrl}
          alt="Feedback Image"
          className="object-contain w-full h-full"
        />
        {clickPosition && (
          <div
            className="absolute w-6 h-6 rounded-full bg-red-500 border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${clickPosition.x}%`, top: `${clickPosition.y}%` }}
          />
        )}
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter your feedback here..."
      />
      <div className="flex justify-between">
        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Skip
        </button>
        {(feedback || clickPosition) && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        )}
      </div>
    </Modal>
  );
};

export default FeedbackPopup;
