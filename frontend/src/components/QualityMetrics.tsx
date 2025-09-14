import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Metric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "good" | "warning" | "critical";
}

interface QualityMetricsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QualityMetrics: React.FC<QualityMetricsProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const metrics: Metric[] = [
    {
      name: "Defect Rate",
      value: 2.3,
      target: 1.5,
      unit: "%",
      trend: "down",
      status: "warning",
    },
    {
      name: "Customer Satisfaction",
      value: 94.2,
      target: 95.0,
      unit: "%",
      trend: "up",
      status: "good",
    },
    {
      name: "Process Capability (Cpk)",
      value: 1.45,
      target: 1.33,
      unit: "",
      trend: "up",
      status: "good",
    },
    {
      name: "First Pass Yield",
      value: 87.5,
      target: 90.0,
      unit: "%",
      trend: "down",
      status: "warning",
    },
    {
      name: "Cost of Quality",
      value: 3.2,
      target: 2.5,
      unit: "% of revenue",
      trend: "up",
      status: "critical",
    },
    {
      name: "Supplier Quality Score",
      value: 96.8,
      target: 95.0,
      unit: "%",
      trend: "up",
      status: "good",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle size={20} className="text-green-400" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-400" />;
      case "critical":
        return <XCircle size={20} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp size={16} className="text-green-400" />;
      case "down":
        return <TrendingDown size={16} className="text-red-400" />;
      default:
        return <Target size={16} className="text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "border-green-500/30 bg-green-500/10";
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "critical":
        return "border-red-500/30 bg-red-500/10";
      default:
        return "border-gray-500/30 bg-gray-500/10";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-4 sm:p-6 w-full max-w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-auto my-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center gap-2">
            <TrendingUp size={20} sm:size={24} />
            Quality Metrics Dashboard
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg sm:text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Period Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label className="text-sm font-medium text-gray-300">
              Time Period:
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 w-full sm:w-auto text-sm sm:text-base"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-green-300">
                    Good Metrics
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-400">
                    3
                  </p>
                </div>
                <CheckCircle
                  size={20}
                  sm:size={24}
                  className="text-green-400"
                />
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-yellow-300">
                    Warning Metrics
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                    2
                  </p>
                </div>
                <AlertTriangle
                  size={20}
                  sm:size={24}
                  className="text-yellow-400"
                />
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-red-300">
                    Critical Metrics
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-red-400">
                    1
                  </p>
                </div>
                <XCircle size={20} sm:size={24} className="text-red-400" />
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className={`border rounded-lg p-3 sm:p-4 ${getStatusColor(
                  metric.status
                )}`}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h3 className="font-semibold text-gray-200 text-sm sm:text-base">
                    {metric.name}
                  </h3>
                  {getStatusIcon(metric.status)}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {metric.value}
                      {metric.unit}
                    </span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className="text-xs sm:text-sm text-gray-400">
                        Target: {metric.target}
                        {metric.unit}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div
                      className={`h-1.5 sm:h-2 rounded-full ${
                        metric.status === "good"
                          ? "bg-green-500"
                          : metric.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (metric.value / metric.target) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-400">
                      {metric.value > metric.target
                        ? "Above Target"
                        : "Below Target"}
                    </span>
                    <span
                      className={`${
                        metric.status === "good"
                          ? "text-green-400"
                          : metric.status === "warning"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {Math.abs(metric.value - metric.target).toFixed(1)}
                      {metric.unit}{" "}
                      {metric.value > metric.target ? "over" : "under"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-black/30 border border-blue-500/30 rounded-lg p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-300 mb-2 sm:mb-3">
              Recommendations
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
              <p>
                • Focus on reducing defect rate through process improvement
                initiatives
              </p>
              <p>
                • Implement additional quality checks to improve first pass
                yield
              </p>
              <p>
                • Review cost of quality drivers and implement cost reduction
                strategies
              </p>
              <p>• Continue supplier quality improvement programs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
