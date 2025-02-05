'use client';

import { useState } from "react";
import Link from "next/link";

export default function ImageStatsCard({
  title,
  imageData,
  uploadType,
  feedbackLink,
  uploadEndpoint,
}: {
  title: string;
  imageData: { total: number, percentage: number };
  uploadType: string;
  feedbackLink: string;
  uploadEndpoint: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [buttonState, setButtonState] = useState("select"); // 'select' | 'upload'

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setButtonState("upload");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", uploadType);

    try {
      const response = await fetch(uploadEndpoint, { method: "POST", body: formData });
      if (response.ok) {
        alert(`${title} uploaded successfully.`);
        setFile(null);
        setButtonState("select");
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-2xl text-black">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p>Total images: {imageData.total}</p>
      <p>Percentage detected: {imageData.percentage.toFixed(2)}%</p>
      <div className="flex flex-wrap gap-4 mt-6">
        <Link href={feedbackLink} className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-transform transform hover:scale-105">
          View Feedback
        </Link>
        <div className="flex-1 min-w-[150px]">
          <input
            type="file"
            id={`${uploadType}-image-input`}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            onClick={() => buttonState === "select" ? document.getElementById(`${uploadType}-image-input`)?.click() : handleUpload()}
            className={`w-full px-6 py-3 rounded-3xl text-white transition-transform transform hover:scale-105 ${
              buttonState === "select" ? "bg-[var(--heartflow-red)]" : "bg-[var(--heartflow-blue)]"
            }`}
          >
            {buttonState === "select" ? "Select New Image" : "Upload Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
