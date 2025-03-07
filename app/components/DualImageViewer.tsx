"use client";

import React, { useState } from "react";

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
  const [highlightedImage, setHighlightedImage] = useState<string | null>(
    selectedImage
  );

  const handleClick = (image: string) => {
    setHighlightedImage(image);
    onSelect(image);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 ${
              highlightedImage === image ? "border-4 border-green-500" : ""
            } ${
              highlightedImage && highlightedImage !== image ? "opacity-50" : ""
            }`}
            onClick={() => handleClick(image)}
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DualImageViewer;
