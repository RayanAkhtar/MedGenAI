'use client'

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; 
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

import { 
  fetchFeedbackData,
  fetchMlMetrics,
  fetchImageData,
  HeatmapPoint     
} from "./api";
import { MLMetrics } from "./MLMetrics";
import { ConfusionMatrix } from "./ConfusionMatrix";

export default function HeatmapFeedbackPage() {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedPoints, setSelectedPoints] = useState<HeatmapPoint[]>([]);
  const [showFeedbackOverlay, setShowFeedbackOverlay] = useState(false);
  const [imageData, setImageData] = useState<{
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    feedbackDots: HeatmapPoint[];
  } | null>(null);

  const [mlMetrics, setMlMetrics] = useState({
    accuracy: 0, 
    precision: 0, 
    recall: 0, 
    f1Score: 0, 
    confusionMatrix: { truepositive: 0, falsepositive: 0, truenegative: 0, falsenegative: 0 }
  });

  const [isResolved, setIsResolved] = useState(false);
  const searchParams = useSearchParams();
  const imageId = searchParams?.get("imageid");

  useEffect(() => {
    const loadData = async () => {
      if (imageId) {
        const imageData = await fetchImageData(imageId);
        if (imageData) {
          const feedbackData = await fetchFeedbackData(imageId);
          setImageData({
            ...imageData,
            feedbackDots: feedbackData,
          });

          const metrics = await fetchMlMetrics(imageId);
          if (metrics) {
            console.log("metrics is", metrics)
            setMlMetrics(metrics);
          }
        }
      }
    };

    if (imageId) {
      loadData();
    }
  }, [imageId]);

  const { imageUrl, imageWidth, imageHeight, feedbackDots } = imageData || {
    imageUrl: "/images/placeholder1.jpg", 
    imageWidth: 600, 
    imageHeight: 400, 
    feedbackDots: [] 
  };

  function getHeatmapColor(frequency: number, maxFrequency: number): string {
    const percentage = frequency / maxFrequency;
    const red = Math.min(255, 255 * percentage);
    const green = Math.min(255, 255 * (1 - percentage));
    return `rgba(${red}, ${green}, 0, 0.6)`;
  }

  function calculateHeatmapFrequency(points: HeatmapPoint[], range: number) {
    const frequencyMap: { [key: string]: HeatmapPoint[] } = {};

    points.forEach((point) => {
      const key = `${Math.floor(point.x / range) * range},${Math.floor(point.y / range) * range}`;
      if (!frequencyMap[key]) frequencyMap[key] = [];
      frequencyMap[key].push(point);
    });

    const maxFrequency = Math.max(...Object.values(frequencyMap).map((points) => points.length));

    return Object.entries(frequencyMap).map(([key, points]) => {
      const [x, y] = key.split(',').map(Number);
      return { x, y, points, frequency: points.length, maxFrequency };
    });
  }

  const heatmapFrequencyData = calculateHeatmapFrequency(feedbackDots, 50);
  const maxFrequency = Math.max(...heatmapFrequencyData.map((data) => data.frequency));

  const toggleImageExpansion = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  const toggleHeatmapVisibility = () => {
    setShowHeatmap(!showHeatmap);
  };

  const handleHeatmapRegionClick = (x: number, y: number) => {
    if (!isImageExpanded) return;

    const clickedRegion = heatmapFrequencyData.find(data => data.x === x && data.y === y);
    if (clickedRegion) {
      setSelectedPoints(clickedRegion.points);
      setShowFeedbackOverlay(true);
    }
  };

  const closeOverlay = () => {
    setShowFeedbackOverlay(false);
  };

  const resolveAllFeedback = async () => {
    setIsResolved(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/resolveAllFeedbackByImage/${imageId}`,
        { method: 'POST' }
      );
      if (response.ok) {
        alert("All feedback has been resolved!");
      } else {
        console.error("Failed to resolve feedback");
      }
    } catch (error) {
      console.error("Error resolving feedback:", error);
    }
  };

  return (
    <main className="h-screen bg-white text-[var(--foreground)] overflow-y-auto">
      <Navbar />

      <div className="mt-10 flex justify-between items-center px-5">
        <Link href="/admin/feedback-page">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all duration-300 ease-in-out">
            Back to Feedback
          </button>
        </Link>
        <button
          onClick={resolveAllFeedback}
          className={`px-6 py-2 text-white rounded-lg transition-all duration-300 ease-in-out ${
            isResolved ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
          }`}
        >
          Resolve All Feedback
        </button>
      </div>

      <div className="mt-20 mb-20 flex justify-center items-center p-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h1 className="border-b pb-2 mb-4 text-xl font-bold text-black">
              Heatmap Feedback
            </h1>

            <div className="relative">
              <Image
                src={imageUrl}
                alt="Feedback Image"
                width={imageWidth}
                height={imageHeight}
                className="rounded-lg cursor-pointer mx-auto"
                onClick={toggleImageExpansion}
              />
              {showHeatmap &&
                heatmapFrequencyData.map((data, index) => (
                  <div
                    key={index}
                    className="absolute cursor-pointer"
                    onClick={() => handleHeatmapRegionClick(data.x, data.y)}
                    style={{
                      top: `${data.y}px`,
                      left: `${data.x + 60}px`,
                      width: "50px",
                      height: "50px",
                      backgroundColor: getHeatmapColor(data.frequency, maxFrequency),
                      transition: "background-color 0.3s ease-in-out",
                    }}
                  />
                ))}
            </div>

            <div className="my-4 text-center">
              <button
                onClick={toggleHeatmapVisibility}
                className={`px-4 py-2 text-sm font-semibold rounded-full ${showHeatmap ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
              >
                {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-3xl mx-auto flex flex-col lg:flex-row gap-8 text-black">
        <div className="w-full lg:w-1/2">
          <MLMetrics {...mlMetrics} />
        </div>
        <div className="w-full lg:w-1/2">
          <ConfusionMatrix confusionMatrix={mlMetrics.confusionMatrix} />
        </div>
      </div>

      <Dialog open={isImageExpanded} onClose={toggleImageExpansion} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative">
            <div className="relative">
              <Image
                src={imageUrl}
                alt="Expanded Feedback Image"
                width={imageWidth}
                height={imageHeight}
                className="rounded-lg"
              />
              {showHeatmap &&
                heatmapFrequencyData.map((data, index) => (
                  <div
                    key={index}
                    className="absolute cursor-pointer"
                    onClick={() => handleHeatmapRegionClick(data.x, data.y)}
                    style={{
                      top: `${data.y + 25}px`,
                      left: `${data.x + 25}px`,
                      width: "50px",
                      height: "50px",
                      backgroundColor: getHeatmapColor(data.frequency, maxFrequency),
                      transform: "translate(-50%, -50%)",
                      transition: "background-color 0.3s ease-in-out",
                    }}
                  />
                ))}
              {showFeedbackOverlay && selectedPoints.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-md max-w-sm">
                    {selectedPoints.map((point, i) => (
                      <p key={i} className="text-black">
                        {point.msg}
                      </p>
                    ))}
                    <button
                      onClick={closeOverlay}
                      className="mt-2 px-4 py-2 text-sm font-semibold rounded-full bg-red-600 text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={toggleImageExpansion}
                className="absolute top-2 right-2 bg-white rounded-full p-1"
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-black" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={toggleHeatmapVisibility}
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${showHeatmap ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                  {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </main>
  );
}
