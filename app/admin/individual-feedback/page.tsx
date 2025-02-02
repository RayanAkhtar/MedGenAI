'use client';

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

// Card Component
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white shadow-md rounded-2xl p-6 ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b pb-2 mb-4 text-xl font-bold text-black">{children}</div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="text-black">{children}</div>
);

// Badge Component
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-block px-4 py-1 text-sm font-semibold rounded-full text-white ${className}`}>
    {children}
  </span>
);

interface FeedbackData {
  imageUrl: string;
  x: number; // X pixel coordinate
  y: number; // Y pixel coordinate
  correct: boolean;
  message: string;
  imageWidth: number; // Image width for positioning dot
  imageHeight: number; // Image height for positioning dot
}

const dummyFeedback: FeedbackData = {
  imageUrl: "/sample-image.jpg", // Replace with a real image path
  x: 150, // Example pixel coordinates
  y: 220,
  correct: true,
  message: "Excellent focus on the main subject!",
  imageWidth: 600, // Set your image width here
  imageHeight: 400, // Set your image height here
};

export default function IndividualFeedbackPage() {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const toggleImageExpansion = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
      <Navbar />
      
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-8">
        <Card className="max-w-3xl w-full">
          <CardHeader>Individual Feedback</CardHeader>
          <CardContent>
            <div className="relative">
              {/* Clickable Image */}
              <Image
                src={dummyFeedback.imageUrl}
                alt="Feedback Image"
                width={dummyFeedback.imageWidth}
                height={dummyFeedback.imageHeight}
                className="rounded-lg cursor-pointer mx-auto"
                onClick={toggleImageExpansion}
              />
              {/* Dot overlay */}
              <div
                className="absolute bg-red-500 w-4 h-4 rounded-full border-2 border-white"
                style={{
                  top: `${dummyFeedback.y}px`,
                  left: `${dummyFeedback.x}px`,
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
            </div>

            {/* Correct or Incorrect Guess */}
            <div className="my-4 text-center">
              <Badge className={dummyFeedback.correct ? "bg-[var(--heartflow-blue)]" : "bg-[var(--heartflow-red)]"}>
                {dummyFeedback.correct ? "Accurate Guess" : "Incorrect Guess"}
              </Badge>
            </div>

            {/* Feedback Message */}
            <p className="text-center text-black mt-4">{dummyFeedback.message}</p>
          </CardContent>
        </Card>

        {/* Expanded Image Modal */}
        <Dialog open={isImageExpanded} onClose={toggleImageExpansion} className="relative z-50">
          <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="relative">
              <Image
                src={dummyFeedback.imageUrl}
                alt="Expanded Feedback Image"
                width={dummyFeedback.imageWidth}
                height={dummyFeedback.imageHeight}
                className="rounded-lg"
              />
              <button
                onClick={toggleImageExpansion}
                className="absolute top-2 right-2 bg-white rounded-full p-1"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </main>
  );
}
