import React from "react";
import { ForecastData } from "../../../types";
import { convertTemperature } from "../../../utils";
import { WeatherIcon } from "../../common/WeatherIcon";

interface ForecastListProps {
  forecast: ForecastData[];
  unit: "celsius" | "fahrenheit";
}

export const ForecastList: React.FC<ForecastListProps> = ({
  forecast,
  unit,
}) => {
  return (
    <div className="space-y-3">
      {forecast.map((day, index) => {
        const minTemp = convertTemperature(
          day.temperature.min,
          "celsius",
          unit
        );
        const maxTemp = convertTemperature(
          day.temperature.max,
          "celsius",
          unit
        );
        const unitSymbol = unit === "celsius" ? "°C" : "°F";

        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WeatherIcon icon={day.icon} size={32} />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {day.description}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(maxTemp)}
                  {unitSymbol}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(minTemp)}
                  {unitSymbol}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
