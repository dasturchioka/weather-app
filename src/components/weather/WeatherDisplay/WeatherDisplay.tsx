import React from 'react';
import { Droplets, Wind, Thermometer, Eye } from 'lucide-react';
import { WeatherData } from '../../../types';
import { convertTemperature } from '../../../utils';
import { WeatherIcon } from '../../common/WeatherIcon';

interface WeatherDisplayProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, unit }) => {
  const temperature = convertTemperature(weather.temperature, 'celsius', unit);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{weather.city}</h2>
          <p className="text-gray-600 dark:text-gray-300 capitalize">{weather.description}</p>
        </div>
        <WeatherIcon icon={weather.icon} size={64} />
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="text-4xl font-bold text-gray-900 dark:text-white">
          {Math.round(temperature)}{unitSymbol}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Updated {weather.timestamp.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Droplets size={16} />
          <span className="text-sm">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Wind size={16} />
          <span className="text-sm">{weather.windSpeed} m/s</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Thermometer size={16} />
          <span className="text-sm">{weather.pressure} hPa</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Eye size={16} />
          <span className="text-sm">{weather.visibility / 1000} km</span>
        </div>
      </div>
    </div>
  );
};