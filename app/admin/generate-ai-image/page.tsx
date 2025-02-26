"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import ImageFilters from "./ImageFilters";
import ImageDisplay from "./ImageDisplay";
import GenerateButton from "./GenerateButton";
import SaveButton from "./SaveButton";

const GenerateImagePage = () => {
  const [ageRange, setAgeRange] = useState("");
  const [sex, setSex] = useState("");
  const [disease, setDisease] = useState("");
  const [generatedImagePath, setGeneratedImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    setGeneratedImagePath(null);

    try {
      const queryParams = new URLSearchParams();
      if (ageRange) queryParams.append("age", ageRange);
      if (sex) queryParams.append("sex", sex);
      if (disease) queryParams.append("disease", disease);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/generateImage?${queryParams.toString()}`
      );

      if (!response.ok) throw new Error("Failed to generate image");

      const data = await response.json();
      setGeneratedImagePath(data.imagePath);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!generatedImagePath) return;

    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/uploadAIImage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imagePath: generatedImagePath }),
        }
      );

      if (!response.ok) throw new Error("Failed to save image");

      alert("Image saved successfully!");
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Error saving image. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white">
      <Navbar />
      <main className="min-h-screen text-gray-900 flex flex-col items-center py-10 mt-10">
        <h1 className="text-3xl font-bold mb-6">Generate AI Image</h1>
        
        <ImageFilters ageRange={ageRange} setAgeRange={setAgeRange} sex={sex} setSex={setSex} disease={disease} setDisease={setDisease} />

        <GenerateButton onClick={handleGenerateImage} loading={loading} />

        <ImageDisplay imagePath={generatedImagePath} />

        <SaveButton onClick={handleSaveImage} disabled={!generatedImagePath || saving} saving={saving} />
      </main>
    </div>
  );
};

export default GenerateImagePage;
