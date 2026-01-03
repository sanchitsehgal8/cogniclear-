import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface ScoreChartProps {
  metrics: {
    rationality: number;
    objectivity: number;
    completeness: number;
  };
}

const ScoreChart: React.FC<ScoreChartProps> = ({ metrics }) => {
  const data = [
    {
      subject: 'Rationality',
      A: metrics.rationality,
      fullMark: 100,
    },
    {
      subject: 'Objectivity',
      A: metrics.objectivity,
      fullMark: 100,
    },
    {
      subject: 'Completeness',
      A: metrics.completeness,
      fullMark: 100,
    },
  ];

  return (
    <div className="h-64 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Metrics"
            dataKey="A"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="#22d3ee"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
