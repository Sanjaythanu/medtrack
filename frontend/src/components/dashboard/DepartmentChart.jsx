import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import GlassCard from '../common/GlassCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DepartmentChart = ({ departmentStats = [] }) => {
  const labels = departmentStats.map((d) => d._id || 'Unknown');
  const counts = departmentStats.map((d) => d.count || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Equipment Count',
        data: counts,
        backgroundColor: 'rgba(79, 124, 255, 0.75)',
        borderColor: '#4F7CFF',
        borderWidth: 1.5,
        borderRadius: 8,
        hoverBackgroundColor: '#8B5CF6',
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
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0, font: { family: 'Poppins' } } },
      x: { ticks: { font: { family: 'Poppins' } } },
    },
  };

  return (
    <GlassCard title="Equipment Distribution by Department" icon="bi-bar-chart-line-fill" className="h-100">
      <div style={{ height: '260px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </GlassCard>
  );
};

export default DepartmentChart;

