"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import AdminStats from "./AdminStats";
import FeedbackPieChart from "./FeedbackPieChart";
import ImageStatsCard from "./ImageStatsCard";
import Sitemap from "./Sitemap";

export default function Admin() {
  const [feedbackStatusData, setFeedbackStatusData] = useState({ complete: 0, incomplete: 0 });
  const [totalImagesData, setTotalImagesData] = useState({ realImages: 0, aiImages: 0, realImagesPercent: 0, aiImagesPercent: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackStatusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getFeedbackResolutionStatus`);
        const feedbackStatus = await feedbackStatusResponse.json();

        const complete = feedbackStatus?.resolvedCount || 0;
        const incomplete = feedbackStatus?.unresolvedCount || 0;
        setFeedbackStatusData({ complete, incomplete });

        const realImagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getTotalRealImages`);
        const aiImagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getTotalAIImages`);
        const realImages = (await realImagesResponse.json());
        const aiImages = (await aiImagesResponse.json());

        setTotalImagesData({
          realImages: realImages.totalReal || 0,
          aiImages: aiImages.totalAI || 0,
          realImagesPercent: (realImages.percentageDetected || 0) * 100,
          aiImagesPercent: (aiImages.percentageDetected || 0) * 100,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="h-screen bg-[var(--background)] text-[var(--foreground)] overflow-y-auto">
      <Navbar />

      <section className="p-8 bg-white">
        <AdminStats />
      </section>

      <section className="p-8 bg-white">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-8 w-full lg:w-3/4">
            <ImageStatsCard
              title="Real Images"
              imageData={{
                total: totalImagesData.realImages,
                percentage: totalImagesData.realImagesPercent,
              }}
              uploadType="real"
              feedbackLink="/admin/feedback-page?filter=real"
              uploadEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/uploadRealImage`}
            />
            <ImageStatsCard
              title="AI Images"
              imageData={{
                total: totalImagesData.aiImages,
                percentage: totalImagesData.aiImagesPercent,
              }}
              uploadType="ai"
              feedbackLink="/admin/feedback-page?filter=ai"
              uploadEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/uploadAIImage`}
            />
          </div>
          <Sitemap />
        </div>
      </section>

      <section className="p-8 bg-white text-black text-center">
        <h2 className="text-2xl font-bold mb-6">Feedback Navigation</h2>
        <FeedbackPieChart
          feedbackStatusData={feedbackStatusData}
          onClick={(filter) => window.location.href = `admin/feedback-page?filter=${filter}`}
        />
      </section>
    </main>
  );
}
