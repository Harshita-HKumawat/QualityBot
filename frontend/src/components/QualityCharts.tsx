import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

interface ChartProps {
  title: string;
  data: any;
  options?: any;
}

export const LineChart: React.FC<ChartProps> = ({ title, data, options }) => (
  <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-6">
    <h3 className="text-xl font-bold text-purple-300 mb-4">{title}</h3>
    <Line data={data} options={options} />
  </div>
);

export const BarChart: React.FC<ChartProps> = ({ title, data, options }) => (
  <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-6">
    <h3 className="text-xl font-bold text-purple-300 mb-4">{title}</h3>
    <Bar data={data} options={options} />
  </div>
);

export const PieChart: React.FC<ChartProps> = ({ title, data, options }) => (
  <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-6">
    <h3 className="text-xl font-bold text-purple-300 mb-4">{title}</h3>
    <Pie data={data} options={options} />
  </div>
);
