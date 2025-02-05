import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AccuracyChart = ({ accuracyData }) => {
  // Calculate max value and set a buffer
  const maxAccuracy = Math.max(...accuracyData.map(data => data.accuracy));
  const yAxisMax = maxAccuracy < 1 ? 1 : maxAccuracy + 0.05; // Adds 5% buffer to max accuracy

  const data = {
    labels: accuracyData.map(item => item.month),
    datasets: [
      {
        label: 'Accuracy',
        data: accuracyData.map(item => item.accuracy),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4, // Increase this value for a smoother curve (0 to 1)
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0,
        max: yAxisMax, // Set the maximum value of y-axis with a buffer
        ticks: {
          stepSize: 0.1, // You can adjust the step size depending on your range
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '400px', width: '100%' }} className='mb-10 mt-10'>
      <Line data={data} options={options} />
    </div>
  );
};

export default AccuracyChart;
