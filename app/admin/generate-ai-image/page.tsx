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
