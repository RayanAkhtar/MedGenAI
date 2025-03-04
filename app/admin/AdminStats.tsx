'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useRouter } from 'next/navigation';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface EngagementDataItem {
  month: string;
  guess_count: number;
}

interface AccuracyDataItem {
  month: string;
  accuracy: number;
}

export default function AdminStats() {
  const [engagementData, setEngagementData] = useState<EngagementDataItem[]>([]);
  const [accuracyData, setAccuracyData] = useState<AccuracyDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guessesResponse, accuracyResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getGuessesPerMonth`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/getImageDetectionAccuracy`),
        ]);

        if (!guessesResponse.ok || !accuracyResponse.ok) {
          throw new Error('Failed to fetch admin stats data');
        }

        const guessesData: EngagementDataItem[] = await guessesResponse.json();
        const accuracyData: AccuracyDataItem[] = await accuracyResponse.json();
        setEngagementData(guessesData);
        setAccuracyData(accuracyData);
      } catch (err) {
        setError('Error fetching data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatMonthYear = (month: string) => {
    const date = new Date(month);
    return date.toLocaleString('en-US', { year: 'numeric', month: 'short' });
  };

  const engagementChartData = {
    labels: engagementData.map((data) => formatMonthYear(data.month)),
    datasets: [
      {
        label: 'User Engagement (Guesses)',
        data: engagementData.map((data) => data.guess_count),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 10,
        hitRadius: 15,
      },
    ],
  };

  const accuracyChartData = {
    labels: accuracyData.map((data) => formatMonthYear(data.month)),
    datasets: [
      {
        label: 'Image Detection Accuracy',
        data: accuracyData.map((data) => data.accuracy),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 10,
        hitRadius: 15,
      },
    ],
  };

  const chartOptionsEngagement: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMin: Math.max(0, Math.min(...engagementData.map((data) => data.guess_count)) * 0.8),
        suggestedMax: Math.max(...engagementData.map((data) => data.guess_count)) * 1.2,
      },
    },
  };

  const chartOptionsAccuracy: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 1.1,
      },
    },
  };

  if (loading) {
    return <div className="p-8 text-center">Loading stats...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  const handleMetricsClick = () => {
    router.push('/admin/metrics');
  };

  const handleDownloadClick = () => {
    router.push('/admin/download');
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 w-full flex flex-col gap-8">
      <div className="w-full h-64 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-black text-center">User Engagement</h3>
        <Line data={engagementChartData} options={chartOptionsEngagement} />
      </div>

      <div className="w-full h-64 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-black text-center">Image Detection Accuracy</h3>
        <Line data={accuracyChartData} options={chartOptionsAccuracy} />
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleMetricsClick}
          className="bg-[var(--heartflow-blue)] text-white px-6 py-2 rounded-lg transition-transform transform hover:scale-105"
        >
          View Detailed Metrics
        </button>
        <button
          onClick={handleDownloadClick}
          className="bg-[var(--heartflow-red)] text-white px-6 py-2 rounded-lg transition-transform transform hover:scale-105"
        >
          Download Data
        </button>
      </div>
    </div>
  );
}
