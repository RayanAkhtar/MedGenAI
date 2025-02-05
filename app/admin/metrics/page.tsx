"use client"

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

  useEffect(() => {
    const fetchData = async () => {
      const dummyData = {
        accuracyData: [
          { month: 'Jan', accuracy: 0.85 },
          { month: 'Feb', accuracy: 0.88 },
          { month: 'Mar', accuracy: 0.90 },
          { month: 'Apr', accuracy: 0.87 },
          { month: 'May', accuracy: 0.92 },
        ],
        confusionMatrix: {
          truePositive: 1500,
          falsePositive: 200,
          trueNegative: 1300,
          falseNegative: 300,
        },
        accuracy: 0.85,
        precision: 0.88,
        recall: 0.82,
        f1Score: 0.85,
        leaderboardData: [
          { user: 'Alice', accuracy: 0.90 },
          { user: 'Bob', accuracy: 0.87 },
          { user: 'Charlie', accuracy: 0.92 },
        ],
        sampleDifficulty: [
          { sampleId: 'Sample1', difficultyScore: 0.75 },
          { sampleId: 'Sample2', difficultyScore: 0.85 },
          { sampleId: 'Sample3', difficultyScore: 0.65 },
        ],
      };

      setMetricsData(dummyData);
    };

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
