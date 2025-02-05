'use client';

import { useEffect, useState } from 'react';
import AccuracyChart from './AccuracyChart';
import ConfusionMatrix from './ConfusionMatrix';
import MLMetrics from './MLMetrics';
import Leaderboard from './Leaderboard';
import SampleDifficulty from './ImageDifficulty';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

const MetricsPage = () => {
  const [metricsData, setMetricsData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const accuracyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getImageDetectionAccuracy`);
      const accuracyData = await accuracyResponse.json();

      const confusionMatrixResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getConfusionMatrix`);
      const confusionMatrixData = await confusionMatrixResponse.json();

      const mlMetricsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getMLMetrics`);
      const mlMetricsData = await mlMetricsResponse.json();

      const leaderboardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getLeaderboard`);
      const leaderboardData = await leaderboardResponse.json();

      const sampleDifficultyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getImageDifficulty`);
      const sampleDifficultyData = await sampleDifficultyResponse.json();

      setMetricsData({
        accuracyData: accuracyData,
        confusionMatrix: confusionMatrixData,
        accuracy: mlMetricsData.accuracy,
        precision: mlMetricsData.precision,
        recall: mlMetricsData.recall,
        f1Score: mlMetricsData.f1Score,
        leaderboardData: leaderboardData,
        sampleDifficulty: sampleDifficultyData,
      });
      
    } catch (error) {
      console.error("Error fetching metrics data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!metricsData) return <div>Loading...</div>;

  return (
    <main className="h-screen bg-white text-black overflow-y-auto p-8">
      <Navbar />

      <div className="mt-10">
        <Link href="/admin">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all duration-300 ease-in-out">
            Back to Admin
          </button>
        </Link>
      </div>

      <AccuracyChart accuracyData={metricsData.accuracyData} />
      <ConfusionMatrix confusionMatrix={metricsData.confusionMatrix} />
      <MLMetrics
        accuracy={metricsData.accuracy}
        precision={metricsData.precision}
        recall={metricsData.recall}
        f1Score={metricsData.f1Score}
      />
      <Leaderboard leaderboardData={metricsData.leaderboardData} />
      <SampleDifficulty sampleDifficulty={metricsData.sampleDifficulty} />
    </main>
  );
};

export default MetricsPage;
