'use client';

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface HeatmapPoint {
  x: number;
  y: number;
  message: string;
}

const dummyHeatmapData = {
  imageUrl: "/images/placeholder1.jpg",
  imageWidth: 600,
  imageHeight: 400,
  heatmapPoints: [
    { x: 150, y: 220, message: "This area indicates an abnormal density." },
    { x: 300, y: 180, message: "Possible artifact interference detected." },
    { x: 400, y: 300, message: "Bright spot observed, needs review." },
    { x: 310, y: 190, message: "Edge artifact near tissue boundary." },
    { x: 290, y: 170, message: "Potential lesion detected in this region." },
    { x: 405, y: 305, message: "Consider verifying this shadowed region." },
    { x: 250, y: 250, message: "New potential observation here." },
    { x: 370, y: 320, message: "Verify adjacent tissue contrast." },
    { x: 420, y: 280, message: "Irregular shape requires assessment." },
    { x: 120, y: 350, message: "Unusual bright spot at this location." },
    { x: 500, y: 90, message: "Check for consistent contrast." },
    { x: 180, y: 200, message: "Review this shadowed zone." },
    { x: 220, y: 260, message: "Potential irregular structure." },
    { x: 400, y: 150, message: "Possible abnormal density detected." },
    { x: 420, y: 310, message: "Bright tissue anomaly observed." },
    { x: 300, y: 100, message: "Evaluate possible misalignment." },
    { x: 360, y: 250, message: "Check texture variation in this region." },
    { x: 520, y: 320, message: "Assess bright area near tissue boundary." },
    { x: 480, y: 220, message: "High density structure observed." },
    { x: 250, y: 150, message: "Irregular shadow near midpoint." },
  ],
};

function getHeatmapColor(frequency: number, maxFrequency: number): string {
    const percentage = frequency / maxFrequency;
    const red = Math.min(255, 255 * percentage);
    const green = Math.min(255, 255 * (1 - percentage));
    const blue = 0;
    return `rgba(${red}, ${green}, ${blue}, 0.6)`;
  }
  
  function calculateHeatmapFrequency(points: HeatmapPoint[], range: number) {
    const frequencyMap: { [key: string]: HeatmapPoint[] } = {};
  
    points.forEach(point => {
      const key = `${Math.floor(point.x / range) * range},${Math.floor(point.y / range) * range}`;
      if (!frequencyMap[key]) frequencyMap[key] = [];
      frequencyMap[key].push(point);
    });
  
    const maxFrequency = Math.max(...Object.values(frequencyMap).map(points => points.length));
  
    return Object.entries(frequencyMap).map(([key, points]) => {
      const [x, y] = key.split(",").map(Number);
      return { x, y, points, frequency: points.length, maxFrequency };
    });
  }
  

  export default function HeatmapFeedbackPage() {
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(true);
    const [selectedPoints, setSelectedPoints] = useState<HeatmapPoint[]>([]);
    const [showFeedbackOverlay, setShowFeedbackOverlay] = useState(false);
  
    const heatmapFrequencyData = calculateHeatmapFrequency(
      dummyHeatmapData.heatmapPoints,
      50 // Heat range grouping ~50px for better blending of colors
    );
  
    const maxFrequency = Math.max(...heatmapFrequencyData.map((data) => data.frequency));
  
    const toggleImageExpansion = () => {
      setIsImageExpanded(!isImageExpanded);
    };
  
    const toggleHeatmapVisibility = () => {
      setShowHeatmap(!showHeatmap);
    };
  
    const handleHeatmapRegionClick = (x: number, y: number) => {
      if (!isImageExpanded) return;
  
      
      const clickedRegion = heatmapFrequencyData.find(
        (data) => data.x === x && data.y === y
      );
  
      if (clickedRegion) {
        setSelectedPoints(clickedRegion.points); 
        setShowFeedbackOverlay(true);
      } else {
        setShowFeedbackOverlay(false); 
      }
    };
  
    const closeOverlay = () => {
      setShowFeedbackOverlay(false);
    };
  
    return (
      <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
        <Navbar />
  
        <div className="min-h-screen flex justify-center items-center bg-gray-50 p-8">
          <div className="w-full max-w-3xl">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h1 className="border-b pb-2 mb-4 text-xl font-bold text-black">
                Heatmap Feedback
              </h1>
  
              <div className="relative">
                <Image
                  src={dummyHeatmapData.imageUrl}
                  alt="Feedback Image"
                  width={dummyHeatmapData.imageWidth}
                  height={dummyHeatmapData.imageHeight}
                  className="rounded-lg cursor-pointer mx-auto"
                  onClick={toggleImageExpansion}
                />
                {showHeatmap &&
                  heatmapFrequencyData.map((data, index) => (
                    <div
                      key={index}
                      className="absolute rounded-md"
                      onClick={() => isImageExpanded && handleHeatmapRegionClick(data.x, data.y)}
                      style={{
                        top: `${data.y}px`,
                        left: `${data.x}px`,
                        width: "50px",
                        height: "50px",
                        backgroundColor: getHeatmapColor(data.frequency, maxFrequency),
                        borderRadius: "12px",
                        transform: "translate(-50%, -50%)",
                        transition: "background-color 0.3s ease-in-out",
                      }}
                    ></div>
                  ))}
              </div>
  
              <div className="my-4 text-center">
                <button
                  onClick={toggleHeatmapVisibility}
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    showHeatmap ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                </button>
              </div>
            </div>
          </div>
  
          <Dialog open={isImageExpanded} onClose={toggleImageExpansion} className="relative z-50">
            <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="relative">
                <div className="relative">
                  <Image
                    src={dummyHeatmapData.imageUrl}
                    alt="Expanded Feedback Image"
                    width={dummyHeatmapData.imageWidth}
                    height={dummyHeatmapData.imageHeight}
                    className="rounded-lg"
                  />
                  {showHeatmap &&
                    heatmapFrequencyData.map((data, index) => (
                      <div
                        key={index}
                        className="absolute cursor-pointer rounded-md"
                        onClick={() => handleHeatmapRegionClick(data.x, data.y)}
                        style={{
                          top: `${data.y}px`,
                          left: `${data.x}px`,
                          width: "50px",
                          height: "50px",
                          backgroundColor: getHeatmapColor(data.frequency, maxFrequency),
                          borderRadius: "12px",
                          transform: "translate(-50%, -50%)",
                          transition: "background-color 0.3s ease-in-out",
                        }}
                      ></div>
                    ))}
  
                  {showFeedbackOverlay && selectedPoints.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-lg shadow-md max-w-sm">
                        {selectedPoints.map((point, i) => (
                          <p key={i} className="text-black">
                            {point.message}
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
                    <X className="w-5 h-5 text-black" />
                  </button>
  
                  {/* Button to toggle heatmap visibility inside the expanded view */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button
                      onClick={toggleHeatmapVisibility}
                      className={`px-4 py-2 text-sm font-semibold rounded-full ${
                        showHeatmap ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
                      }`}
                    >
                      {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </main>
    );
  }
  