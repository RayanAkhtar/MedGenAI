"use client";

import React from "react";

interface DualImageViewerProps {
  images: string[];
  onSelect: (image: string) => void;
  selectedImage: string | null;
}

const DualImageViewer: React.FC<DualImageViewerProps> = ({
  images,
  onSelect,
  selectedImage,
}) => {
  return (
    <div className="flex justify-center gap-6 p-4">
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 ${
            selectedImage === image ? "border-4 border-blue-500" : "border-2 border-gray-300"
          }`}
          style={{
            maxWidth: "250px",
            maxHeight: "250px",
            padding: "4px",            // Ensures consistent padding inside borders
            backgroundColor: "white",  // Keeps a consistent background
          }}
          onClick={() => onSelect(image)}
        >
          <img
            src={image}
            alt={`Image ${index + 1}`}
            className="w-full h-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default DualImageViewer;
