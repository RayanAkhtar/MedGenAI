import React from "react";

interface GameCompleteProps {
  score: number;
  totalImages: number;
  gameId: string | null;
  returnToDashboard: () => void;
  playAgain: () => void;
}

const GameComplete: React.FC<GameCompleteProps> = ({
  score,
  totalImages,
  gameId,
  returnToDashboard,
  playAgain,
}) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 animate-fadeIn">
        <div className="p-4">
          <div className="flex flex-col items-center mb-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Game Complete!
            </h2>
            <div className="w-full bg-gray-100 rounded-full h-1 mb-4"></div>

            <div className="grid grid-cols-2 gap-4 w-full text-center mb-4">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                  Your Score
                </p>
                <p className="text-3xl font-bold text-gray-800">{score}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                  Accuracy
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {Math.round((score / totalImages) * 100)}%
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded-full mb-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.round((score / totalImages) * 100)}%` }}
              ></div>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              You got {score} out of {totalImages} images correct
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={returnToDashboard}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] hover:shadow-lg"
            >
              Return to Dashboard
            </button>

            <button
              onClick={() => {
                if (gameId) {
                  navigator.clipboard.writeText(gameId);
                  alert("Game code copied to clipboard!");
                } else {
                  alert("Game code is not available.");
                }
              }}
              className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-[1.02] hover:shadow-lg text-center"
            >
              Share
            </button>

            <button
              onClick={playAgain}
              className="w-full py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameComplete;
