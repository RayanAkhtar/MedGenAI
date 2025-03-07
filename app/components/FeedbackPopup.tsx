"use client";

import React, { useState } from "react";
import Modal from "./Modal";

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Provide Feedback">
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </Modal>
  );
};

export default FeedbackPopup;
