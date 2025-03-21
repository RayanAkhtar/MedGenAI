"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ConfusionMatrixProps {
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
}

const ConfusionMatrix = ({ confusionMatrix }: ConfusionMatrixProps) => {

  const chartData = {
    labels: ['True Positive', 'False Positive', 'True Negative', 'False Negative'],
    datasets: [
      {
        data: [
          confusionMatrix.truePositive,
          confusionMatrix.falsePositive,
          confusionMatrix.trueNegative,
          confusionMatrix.falseNegative,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="mb-12 flex flex-col lg:flex-row justify-between gap-8">
      <div className="w-full lg:w-1/2 h-64 flex flex-col items-center justify-center space-y-4">
        <h3 className="text-2xl font-semibold text-center">Confusion Matrix</h3>
        <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>

      <div className="w-full lg:w-1/2 h-64 flex flex-col items-center justify-center space-y-4">
        <h3 className="text-2xl font-semibold text-center">Confusion Matrix Values</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
            <span className="font-semibold text-gray-700">True Positive</span>
            <span>{confusionMatrix.truePositive}</span>
          </div>
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
            <span className="font-semibold text-gray-700">False Positive</span>
            <span>{confusionMatrix.falsePositive}</span>
          </div>
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
            <span className="font-semibold text-gray-700">True Negative</span>
            <span>{confusionMatrix.trueNegative}</span>
          </div>
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
            <span className="font-semibold text-gray-700">False Negative</span>
            <span>{confusionMatrix.falseNegative}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;
