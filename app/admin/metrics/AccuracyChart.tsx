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

const AccuracyChart = ({ accuracyData }) => {
  const maxAccuracy = Math.max(...accuracyData.map(data => data.accuracy));
  const yAxisMax = maxAccuracy < 1 ? 1 : maxAccuracy + 0.05;

  const data = {
    labels: accuracyData.map(item => item.month),
    datasets: [
      {
        label: 'Accuracy',
        data: accuracyData.map(item => item.accuracy),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0,
        max: yAxisMax,
        ticks: {
          stepSize: 0.1,
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
