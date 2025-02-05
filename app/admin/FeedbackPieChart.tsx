'use client';

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Link from "next/link";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FeedbackPieChart({
  feedbackStatusData,
  onClick,
}: {
  feedbackStatusData: { complete: number; incomplete: number };
  onClick: (filter: string) => void;
}) {
  const { complete, incomplete } = feedbackStatusData;

  const chartData = {
    labels: ["Complete", "Incomplete"],
    datasets: [
      {
        label: "Feedback Status",
        data: [complete, incomplete],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        onClick(index === 0 ? "complete" : "incomplete");
      }
    },
    plugins: { legend: { position: "bottom" } },
  };

  // Calculate the ratio of complete to incomplete feedbacks
  const totalFeedbacks = complete + incomplete;
  const completeRatio = totalFeedbacks > 0 ? ((complete / totalFeedbacks) * 100).toFixed(2) : 0;
  const incompleteRatio = totalFeedbacks > 0 ? ((incomplete / totalFeedbacks) * 100).toFixed(2) : 0;

  return (
    <div className="w-full mx-auto flex flex-col md:flex-row justify-between gap-8 md:gap-12">
      {/* Pie Chart Section */}
      <div className="w-full md:w-1/2 h-64 flex justify-center md:px-8">
        <Pie data={chartData} options={chartOptions} />
      </div>

      {/* Stats and Button Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-6">
        {/* Feedback Counts and Ratios */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-black">
            Resolved: {complete} ({completeRatio}%)
          </p>
          <p className="text-lg font-semibold text-black">
            Unresolved: {incomplete} ({incompleteRatio}%)
          </p>
        </div>

        {/* View All Feedback Button */}
        <div className="w-full flex justify-center">
          <Link
            href="admin/feedback-page?filter=all"
            className="px-6 py-3 bg-[var(--heartflow-blue)] text-white rounded-3xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            View All Feedback
          </Link>
        </div>
      </div>
    </div>
  );
}
