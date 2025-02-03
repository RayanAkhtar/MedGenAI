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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminStats({ title, graphType }: { title: string, graphType: 'engagement' | 'accuracy' }) {
  const [guessesData, setGuessesData] = useState<any[]>([]);
  const [accuracyData, setAccuracyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (graphType === 'engagement') {
          const guessesResponse = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/getGuessesPerMonth');
          const guessesData = await guessesResponse.json();
          setGuessesData(guessesData);
        } else if (graphType === 'accuracy') {
          const accuracyResponse = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/getImageDetectionAccuracy');
          const accuracyData = await accuracyResponse.json();
          setAccuracyData(accuracyData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [graphType]);

  const formatMonthYear = (month: string) => {
    const date = new Date(month);
    return date.toLocaleString('en-US', { year: 'numeric', month: 'short' });
  };

  const chartData = graphType === 'engagement' ? {
    labels: guessesData.map((data) => formatMonthYear(data.month)),
    datasets: [
      {
        label: 'User Engagement (Guesses)',
        data: guessesData.map((data) => data.guessCount),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 10,
        hitRadius: 15,
      },
    ],
  } : {
    labels: accuracyData.map((data) => formatMonthYear(data.month)),
    datasets: [
      {
        label: 'Accuracy',
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

  const minValue = Math.min(
    Math.min(...guessesData.map((data) => data.guessCount)),
    Math.min(...accuracyData.map((data) => data.accuracy))
  );
  const maxValue = Math.max(
    Math.max(...guessesData.map((data) => data.guessCount)),
    Math.max(...accuracyData.map((data) => data.accuracy))
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `Value: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        labels: chartData.labels,
        beginAtZero: true,
      },
      y: {
        beginAtZero: false,
        suggestedMin: minValue - (minValue * 0.1),
        suggestedMax: maxValue + (maxValue * 0.1),
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 w-full flex items-center gap-6">
      <div className="flex flex-col w-1/2">
        <h3 className="text-xl font-semibold mb-4 text-black text-center">{title}</h3>
        <button className="mt-auto px-6 py-3 bg-[var(--heartflow-red)] text-white rounded-3xl hover:bg-[var(--heartflow-red)]/90 transition-transform duration-300 ease-in-out transform hover:scale-105">
          Collect Data
        </button>
      </div>

      <div className="w-1/2 h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
