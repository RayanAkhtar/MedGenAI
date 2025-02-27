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
  const [generatedImagePath, setGeneratedImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    setGeneratedImagePath(null);
  
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/generateImage?age=${ageRange}&sex=${sex}&disease=${disease}`;
  
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to generate image");

      const { imagePath } = await response.json();
      
      console.log("Image path received from backend:", imagePath);  // TODO: make sure this is piped to where we store images and make sure backend is returning a unique generated path, not the path it gets the image from
      
      setGeneratedImagePath(imagePath);

    } catch (error) {
      console.error("❌ Error generating image:", error);
      alert("Error generating image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!generatedImagePath) return;

    setSaving(true);

    try {
      const imageBlob = await fetch(generatedImagePath).then(res => res.blob());

      const formData = new FormData();
      formData.append("image", imageBlob, "generated_image.png");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/saveImage`, 
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
      <Navbar />
      <main className="min-h-screen text-gray-900 flex flex-col items-center py-10 mt-10">
        <h1 className="text-3xl font-bold mb-6">Generate AI Image</h1>
        
        <ImageFilters 
          ageRange={ageRange} 
          setAgeRange={setAgeRange} 
          sex={sex} 
          setSex={setSex} 
          disease={disease} 
          setDisease={setDisease} 
        />

        <GenerateButton onClick={handleGenerateImage} loading={loading} />

        <ImageDisplay imagePath={generatedImagePath} />

        <SaveButton 
          onClick={handleSaveImage} 
          disabled={!generatedImagePath || saving} 
          saving={saving} 
        />
      </main>
    </div>
  );
};

export default GenerateImagePage;
