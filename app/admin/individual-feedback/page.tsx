'use client';

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Font Awesome close (X) icon

interface Dot {
  x: number;
  y: number;
  message: string;
}

const dummyFeedback = {
  imageUrl: "/images/placeholder1.jpg",
  imageWidth: 600,
  imageHeight: 400,
  dots: [
    { x: 150, y: 220, message: "This part is too dark, real CT scans are brighter." },
    { x: 300, y: 180, message: "Focus on this brighter area for better clarity." },
  ],
};

export default function IndividualFeedbackPage() {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showDots, setShowDots] = useState(true);

  const toggleImageExpansion = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  const toggleDotsVisibility = () => {
    setShowDots(!showDots);
  };

  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
      <Navbar />

      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h1 className="border-b pb-2 mb-4 text-xl font-bold text-black">Individual Feedback</h1>

            <div className="relative">
              <Image
                src={dummyFeedback.imageUrl}
                alt="Feedback Image"
                width={dummyFeedback.imageWidth}
                height={dummyFeedback.imageHeight}
                className="rounded-lg cursor-pointer mx-auto"
                onClick={toggleImageExpansion}
              />
              {showDots &&
                dummyFeedback.dots.map((dot, index) => (
                  <div
                    key={index}
                    className="absolute bg-red-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs"
                    style={{
                      top: `${dot.y}px`,
                      left: `${dot.x}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
            </div>

            <div className="my-4 text-center">
              <button
                onClick={toggleDotsVisibility}
                className={`px-4 py-2 text-sm font-semibold rounded-full ${
                  showDots ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {showDots ? "Hide Dots" : "Show Dots"}
              </button>
            </div>

            <div className="mt-4">
              {dummyFeedback.dots.map((dot, index) => (
                <p key={index} className="text-black">
                  <strong>Dot {index + 1}:</strong> {dot.message}
                </p>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={isImageExpanded} onClose={toggleImageExpansion} className="relative z-50">
          <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="relative">
              <div className="relative">
                <Image
                  src={dummyFeedback.imageUrl}
                  alt="Expanded Feedback Image"
                  width={dummyFeedback.imageWidth}
                  height={dummyFeedback.imageHeight}
                  className="rounded-lg"
                />
                {showDots &&
                  dummyFeedback.dots.map((dot, index) => (
                    <div
                      key={index}
                      className="absolute bg-red-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs"
                      style={{
                        top: `${dot.y}px`,
                        left: `${dot.x}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {index + 1}
                    </div>
                  ))}
              </div>
              <button
                onClick={toggleImageExpansion}
                className="absolute top-2 right-2 bg-white rounded-full p-1"
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-black" /> {/* Font Awesome X icon */}
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </main>
  );
}
