'use client';
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

export default function AdminStats({ title }: { title: string }) {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Engagement',
        data: [75, 85, 92, 80, 95, 88],
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
      x: { beginAtZero: true },
      y: {
        beginAtZero: false,
        suggestedMin: Math.min(...data.datasets[0].data) - 10,
        suggestedMax: Math.max(...data.datasets[0].data) + 10,
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
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
