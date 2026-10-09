import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import GlassCard from '../common/GlassCard';

ChartJS.register(ArcElement, Tooltip, Legend);

const HealthChart = ({ data }) => {
  const chartData = {
    labels: ['Healthy', 'Due Soon', 'Warranty Expiring', 'Overdue', 'Critical', 'Under Repair'],
    datasets: [
      {
        data: [
          data?.Healthy || 0,
          data?.['Due Soon'] || 0,
          data?.['Warranty Expiring'] || 0,
          data?.['Maintenance Overdue'] || 0,
          data?.Critical || 0,
          data?.['Under Repair'] || 0,
        ],
        backgroundColor: ['#00C897', '#F4B400', '#FF9F43', '#FF4D4F', '#C1121F', '#8B5CF6'],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        hoverOffset: 6,
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
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 15, font: { family: 'Poppins', size: 11, weight: '500' } },
      },
    },
    cutout: '72%',
  };

  return (
    <GlassCard title="Equipment Health Distribution" icon="bi-pie-chart-fill" className="h-100">
      <div style={{ height: '260px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </GlassCard>
  );
};

export default HealthChart;

