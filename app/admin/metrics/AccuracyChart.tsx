import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AccuracyChart = ({ accuracyData }: { accuracyData: { month: string; accuracy: number }[] }) => {
  const chartData = {
    labels: accuracyData.map((data) => data.month),
    datasets: [
      {
        label: 'Accuracy',
        data: accuracyData.map((data) => data.accuracy),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <Line className="mt-10 mb-10 w-full h-full" data={chartData} options={chartOptions} />
    </div>
  );
};

export default AccuracyChart;
