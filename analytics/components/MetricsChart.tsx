/**
 * Real-time Metrics Chart Component
 */

import React, { useEffect, useRef, useState } from 'react';
import { analytics, type MetricData } from '../src';

interface MetricsChartProps {
  metricName: string;
  maxPoints?: number;
  color?: string;
  height?: number;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  metricName,
  maxPoints = 50,
  color = '#3b82f6',
  height = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<MetricData[]>([]);

  useEffect(() => {
    const updateData = () => {
      const allMetrics = analytics.getMetrics();
      const filtered = allMetrics
        .filter(m => m.name === metricName)
        .slice(-maxPoints);
      setData(filtered);
    };

    updateData();
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, [metricName, maxPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scales
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const padding = 20;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5;
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
    }
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1);
      const y = padding + chartHeight - ((point.value - min) / range) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = color;
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1);
      const y = padding + chartHeight - ((point.value - min) / range) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(max.toFixed(2), padding - 5, padding + 5);
    ctx.fillText(min.toFixed(2), padding - 5, canvas.height - padding);

  }, [data, color]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No data available for {metricName}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">{metricName}</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        className="w-full"
      />
    </div>
  );
};
