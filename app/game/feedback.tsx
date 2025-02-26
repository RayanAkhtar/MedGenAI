import { useState, useEffect } from "react";

interface FeedbackBoxProps {
  initialValue?: string;
  onSubmit: (feedback: string) => void;
  onSkip: () => void;
  showMarker?: boolean;
  isLastQuestion?: boolean;
}

export default function FeedbackBox({ 
  initialValue = "", 
  onSubmit, 
  onSkip, 
  showMarker = false,
  isLastQuestion = false
}: FeedbackBoxProps) {
  const [feedback, setFeedback] = useState(initialValue);

  useEffect(() => {
    setFeedback(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    onSubmit(feedback);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-2xl">
      <div>
        <h2 className="text-xl font-bold mb-2 text-black">AI Feature Feedback</h2>
        {showMarker ? (
          <p className="text-sm text-gray-600 mb-4">
            Thanks for identifying the AI feature! Please share any additional thoughts about this image.
            {isLastQuestion && " This is the last question."}
          </p>
        ) : (
          <p className="text-sm text-gray-600 mb-4">
            Please share your thoughts about this AI-generated image.
            {isLastQuestion && " This is the last question."}
          </p>
        )}
        <textarea
          className="w-full p-2 border rounded-md text-black"
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
        />
        <div className="flex gap-2 mt-4">
          <button 
            className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 transition-colors" 
            onClick={onSkip}
          >
            {showMarker ? "Continue Without Comment" : "Skip"}
          </button>
          <button 
            className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors" 
            onClick={handleSubmit}
          >
            {isLastQuestion ? "Submit & Finish" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}