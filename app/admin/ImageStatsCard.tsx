"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ImageStatsCard({
  title,
  imageData,
  uploadType,
  feedbackLink,
  uploadEndpoint,
}: {
  title: string;
  imageData: { total: number; percentage: number };
  uploadType: string;
  feedbackLink: string;
  uploadEndpoint: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [buttonState, setButtonState] = useState("select"); // 'select' | 'upload'
  const [imageCount, setImageCount] = useState(imageData.total);
  const [sex, setSex] = useState<"Male" | "Female">("Male");
  const [disease, setDisease] = useState<"None" | "Pleural_Effusion">("None");
  const [age, setAge] = useState<number>(18);

  useEffect(() => {
    setImageCount(imageData.total);
  }, [imageData.total]);

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
    formData.append("sex", sex);
    formData.append("disease", disease);
    formData.append("age", age.toString());

    try {
      const response = await fetch(uploadEndpoint, { method: "POST", body: formData });
      if (response.ok) {
        alert(`${title} uploaded successfully.`);
        setFile(null);
        setButtonState("select");
        setImageCount((prevCount) => prevCount + 1);
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
      <p className="text-xl">Total images: {imageCount}</p>
      <p className="text-xl">Percentage detected as {title.split(" ")[0]}: {imageData.percentage.toFixed(2)}%</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Sex</h3>
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              value="male"
              checked={sex === "Male"}
              onChange={() => setSex("Male")}
              className="form-radio text-blue-500 transform scale-150"
            />
            <span className="text-xl">Male</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              value="female"
              checked={sex === "Female"}
              onChange={() => setSex("Female")}
              className="form-radio text-pink-500 transform scale-150"
            />
            <span className="text-xl">Female</span>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Disease</h3>
        <select
          value={disease}
          onChange={(e) => setDisease(e.target.value as "None" | "Pleural_Effusion")}
          className="block w-full mt-2 px-4 py-2 border rounded-lg bg-white text-lg text-gray-700 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
        >
          <option value="none">None</option>
          <option value="Pleural_Effusion">Pleural Effusion</option>
        </select>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Age</h3>
        <select
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="block w-full mt-2 px-4 py-2 border rounded-lg bg-white text-lg text-gray-700 shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
        >
          {Array.from({ length: 83 }, (_, index) => 18 + index).map((ageValue) => (
            <option key={ageValue} value={ageValue}>
              {ageValue}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <Link
          href={feedbackLink}
          className="flex-1 min-w-[150px] px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-transform transform hover:scale-105"
        >
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
            onClick={() =>
              buttonState === "select" ? document.getElementById(`${uploadType}-image-input`)?.click() : handleUpload()
            }
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
