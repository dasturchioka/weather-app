import React from "react";
import { ForecastData } from "../../../types";
import { convertTemperature } from "../../../utils";

interface DataVisualizationProps {
  forecast: ForecastData[];
  unit: "celsius" | "fahrenheit";
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  forecast,
  unit,
}) => {
  const width = 720;
  const height = 200;
  const padding = 40;

  if (forecast.length === 0) return null;

  const temperatures = forecast.map((day) =>
    convertTemperature(day.temperature.avg, "celsius", unit)
  );
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const tempRange = maxTemp - minTemp || 1;

  const points = forecast.map((_, index) => {
    const x = padding + (index * (width - 2 * padding)) / (forecast.length - 1);
    const y =
      height -
      padding -
      ((temperatures[index] - minTemp) / tempRange) * (height - 2 * padding);
    return { x, y, temp: temperatures[index] };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x},${point.y}`)
    .join(" ");

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Temperature Trend
      </h3>
      <svg width={width} height={height} className="w-full h-auto">
        <defs>
          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + (i * (height - 2 * padding)) / 4}
            x2={width - padding}
            y2={padding + (i * (height - 2 * padding)) / 4}
            stroke="#E5E7EB"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* Temperature line */}
        <path d={pathData} fill="none" stroke="#3B82F6" strokeWidth="2" />

        {/* Area under the line */}
        <path
          d={`${pathData} L ${points[points.length - 1].x},${
            height - padding
          } L ${points[0].x},${height - padding} Z`}
          fill="url(#tempGradient)"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              className="text-xs fill-gray-700 dark:fill-gray-300"
            >
              {Math.round(point.temp)}°
            </text>
            <text
              x={point.x}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500 dark:fill-gray-400"
            >
              {new Date(forecast[index].date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
