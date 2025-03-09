"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import ImageFilters from "./ImageFilters";
import ImageDisplay from "./ImageDisplay";
import GenerateButton from "./GenerateButton";
import SaveButton from "./SaveButton";

const GenerateImagePage = () => {
  const [ageRange, setAgeRange] = useState("any");
  const [sex, setSex] = useState("any");
  const [disease, setDisease] = useState("any");
  const [realImagePath, setRealImagePath] = useState<string | null>(null);
  const [realImageFileName, setRealImageFileName] = useState<string | null>(null);
  const [generatedImagePath, setGeneratedImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null); // 🔹 New state

  const handleGenerateImage = async () => {
    setLoading(true);
    setGeneratedImagePath(null);
    setImageGenerationError(null); // Reset error on new request

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/generateImage?age=${ageRange}&sex=${sex}&disease=${disease}&realImageFileName=${realImageFileName || ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const { imagePath } = await response.json();

      if (!imagePath) {
        setImageGenerationError("No matching images found for the selected conditions.");
        return;
      }

      setGeneratedImagePath(imagePath);
    } catch (error) {
      console.error("❌ Error generating image:", error);
      setImageGenerationError("The backend API could not generate an image for the applied conditions.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRealImage = async () => {
    try {
      const pathResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getRandomRealImagePath`);
      if (!pathResponse.ok) throw new Error("Failed to get image path");

      const { imagePath, fileName } = await pathResponse.json();

      const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/${imagePath}`;

      setRealImagePath(imageUrl);
      setRealImageFileName(fileName);
    } catch (error) {
      console.error("❌ Error loading real image:", error);
      alert("Error loading real image. Please try again.");
    }
  };

  const handleSaveImage = async () => {
    if (!generatedImagePath) return;

    setSaving(true);

    try {
      const imageBlob = await fetch(generatedImagePath).then(res => res.blob());

      let ageToUse = -1;

      if (ageRange == "any") {
        ageToUse = Math.floor(Math.random() * (80 - 18 + 1)) + 18;
      } else {
        const rangeList = ageRange.split("-");
        const minAge = parseInt(rangeList[0]);
        const maxAge = parseInt(rangeList[1]);

        ageToUse = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
      }

      const formData = new FormData();
      formData.append("image", imageBlob, generatedImagePath.split("/").pop() || "generated-image.jpg");
      formData.append("gender", sex);
      formData.append("age", ageToUse.toString());
      formData.append("disease", disease);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/saveGeneratedImage`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to save image");

      alert("Image saved successfully!");
    } catch (error) {
      console.error("❌ Error saving image:", error);
      alert("Error saving image. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white">
      <main className="min-h-screen text-gray-900 flex flex-col items-center py-10 pt-10">
        <h1 className="text-3xl font-bold mb-6">Generate AI Image</h1>

        <ImageFilters 
          ageRange={ageRange} 
          setAgeRange={setAgeRange} 
          sex={sex} 
          setSex={setSex} 
          disease={disease} 
          setDisease={setDisease} 
        />

        <button
          onClick={handleLoadRealImage}
          className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600 transition mb-4 mt-10"
        >
          Get Real Image
        </button>

        <GenerateButton onClick={handleGenerateImage} loading={loading} />

        <div className="flex flex-row gap-8 mt-6">
          <ImageDisplay title="Real Image" imagePath={realImagePath} />
          <ImageDisplay title="Generated Image" imagePath={generatedImagePath} />
        </div>

        <SaveButton 
          onClick={handleSaveImage} 
          disabled={!generatedImagePath || saving} 
          saving={saving} 
        />

        {imageGenerationError && (
          <p className="text-red-600 font-semibold mt-4">{imageGenerationError}</p>
        )}
      </main>
    </div>
  );
};

export default GenerateImagePage;
