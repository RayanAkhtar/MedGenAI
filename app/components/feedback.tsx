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
  isLastQuestion = false,
}: FeedbackBoxProps) {
  const [feedback, setFeedback] = useState(initialValue);
  const [charCount, setCharCount] = useState(0);
  
  useEffect(() => {
    setFeedback(initialValue);
    setCharCount(initialValue.length);
  }, [initialValue]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFeedback(value);
    setCharCount(value.length);
  };
  
  const handleSubmit = () => {
    onSubmit(feedback);
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8 animate-fadeIn">
      <div className="flex items-start mb-5">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {showMarker ? "What makes this part look AI-generated?" : "What makes this image look AI-generated?"}
          </h3>
          <p className="text-gray-500 text-sm">Your feedback helps improve AI detection</p>
        </div>
      </div>
      
      <div className="mb-5">
        <div className="relative">
          <textarea
            value={feedback}
            onChange={handleChange}
            placeholder="Describe what you noticed... (optional)"
            className="w-full h-32 p-4 bg-gray-50 rounded-xl border border-gray-200 
                     focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                     resize-none transition-all text-gray-700 placeholder-gray-400"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-100 py-1 px-2 rounded-full">
            {charCount}/500
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleSubmit}
          className="py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl
                   hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isLastQuestion ? "Submit & Finish" : "Submit & Continue"}
          </div>
        </button>
        <button
          onClick={onSkip}
          className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl
                   transition-all transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            {isLastQuestion ? "Skip & Finish" : "Skip & Continue"}
          </div>
        </button>
      </div>
    </div>
  );
}