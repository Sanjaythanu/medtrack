import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import GlassCard from '../common/GlassCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MaintenanceTrendChart = ({ monthlyTrend = [] }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const labels = monthlyTrend.map((item) => `${monthNames[item._id.month - 1]} ${item._id.year}`);
  const scheduledData = monthlyTrend.map((item) => item.scheduled);
  const completedData = monthlyTrend.map((item) => item.completed);

  const chartData = {
    labels: labels.length ? labels : ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
    datasets: [
      {
        fill: true,
        label: 'Scheduled Tasks',
        data: scheduledData.length ? scheduledData : [3, 5, 8, 4],
        borderColor: '#4F7CFF',
        backgroundColor: 'rgba(79, 124, 255, 0.15)',
        tension: 0.4,
      },
      {
        fill: true,
        label: 'Completed Tasks',
        data: completedData.length ? completedData : [2, 4, 7, 3],
        borderColor: '#00C897',
        backgroundColor: 'rgba(0, 200, 151, 0.15)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { position: 'top', labels: { font: { family: 'Poppins' } } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0, font: { family: 'Poppins' } } },
      x: { ticks: { font: { family: 'Poppins' } } },
    },
  };

  return (
    <GlassCard title="Maintenance Operations Trend (Monthly)" icon="bi-graph-up-arrow" className="h-100">
      <div style={{ height: '260px' }}>
        <Line data={chartData} options={options} />
      </div>
    </GlassCard>
  );
};

export default MaintenanceTrendChart;

