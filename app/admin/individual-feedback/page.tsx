'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

interface Dot {
  x: number;
  y: number;
  message: string;
}

export default function IndividualFeedbackPage() {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showDots, setShowDots] = useState(true);
  const [imageData, setImageData] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const imageId = searchParams?.get("imageid");

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        if (!imageId) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getImageById/${imageId}`);
        const metadata = await response.json();

        if (metadata && metadata.image_path) {
          const cleanedPath = metadata.image_path.split('/').slice(4).join('/');
          const apiUrl = `${process.env.NEXT_PUBLIC_API_IMAGE_URL}/fetchImageByPath/${encodeURIComponent(cleanedPath)}`;

          const imageResponse = await fetch(apiUrl);
          if (!imageResponse.ok) {
            throw new Error("Failed to fetch the image");
          }

          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob);

          setImageSrc(imageUrl);

          setImageData({
            imageWidth: 600,
            imageHeight: 400,
            dots: metadata.dots || [
              { x: 150, y: 220, message: "This part is too dark, real CT scans are brighter." },
              { x: 300, y: 180, message: "Focus on this brighter area for better clarity." },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImageData();
  }, [imageId]);

  const toggleImageExpansion = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  const toggleDotsVisibility = () => {
    setShowDots(!showDots);
  };

  if (!imageSrc) {
    return <div>Loading...</div>;
  }

  return (
    <main className="h-screen bg-white text-[var(--foreground)] overflow-y-auto">
      <Navbar />

      <div className="mt-10">
        <Link href="/admin/feedback-page">
          <button className="ml-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all duration-300 ease-in-out">
            Back to Feedback
          </button>
        </Link>
      </div>

      <div className="min-h-screen flex justify-center items-center  p-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h1 className="border-b pb-2 mb-4 text-xl font-bold text-black">Individual Feedback</h1>

            <div className="relative">
              <Image
                src={imageSrc}
                alt="Feedback Image"
                width={imageData.imageWidth}
                height={imageData.imageHeight}
                className="rounded-lg cursor-pointer mx-auto"
                onClick={toggleImageExpansion}
              />
              {showDots &&
                imageData.dots.map((dot, index) => (
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
                className={`px-4 py-2 text-sm font-semibold rounded-full ${showDots ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
              >
                {showDots ? "Hide Dots" : "Show Dots"}
              </button>
            </div>

            <div className="mt-4">
              {imageData.dots.map((dot, index) => (
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
                  src={imageSrc}
                  alt="Expanded Feedback Image"
                  width={imageData.imageWidth}
                  height={imageData.imageHeight}
                  className="rounded-lg"
                />
                {showDots &&
                  imageData.dots.map((dot, index) => (
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
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-black" />
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </main>
  );
}
