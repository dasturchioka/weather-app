import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useWeatherData } from '../../../hooks';
import { convertTemperature } from '../../../utils';
import { CitySelector } from '../CitySelector';
import { WeatherDisplay } from '../WeatherDisplay';
import { ForecastList } from '../ForecastList';
import { DataVisualization } from '../DataVisualization';
import { SettingsPanel } from '../SettingsPanel';

export const WeatherWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'forecast' | 'statistics'>('current');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const {
    currentWeather,
    forecast,
    selectedCity,
    unit,
    isLoading,
    error,
    changeCity,
    toggleUnit,
    clearError,
    refetch
  } = useWeatherData();

  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleCityChange = async (city: string) => {
    setIsTransitioning(true);
    await sleep(300)
    changeCity(city);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const statistics = useMemo(() => {
    if (!forecast.length) return null;
    
    const temperatures = forecast.map(day => day.temperature.avg);
    return {
      avgTemp: temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length,
      minTemp: Math.min(...forecast.map(day => day.temperature.min)),
      maxTemp: Math.max(...forecast.map(day => day.temperature.max)),
      avgHumidity: forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length
    };
  }, [forecast]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Weather Dashboard</h1>
          <CitySelector selectedCity={selectedCity} onCityChange={handleCityChange} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-red-800 dark:text-red-200">{error}</span>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading weather data...</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div role="tablist" className="flex space-x-1 mb-6 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
          {(['current', 'forecast', 'statistics'] as const).map(tab => (
            <button
              key={tab}
              role="tab"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content */}
        {!isLoading && currentWeather && (
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {activeTab === 'current' && (
              <div className="space-y-6">
                <WeatherDisplay weather={currentWeather} unit={unit} />
                <SettingsPanel 
                  unit={unit} 
                  onToggleUnit={toggleUnit} 
                  onRefresh={refetch}
                />
              </div>
            )}

            {activeTab === 'forecast' && (
              <div className="space-y-6">
                <ForecastList forecast={forecast} unit={unit} />
                <DataVisualization forecast={forecast} unit={unit} />
              </div>
            )}

            {activeTab === 'statistics' && statistics && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5-Day Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(convertTemperature(statistics.avgTemp, 'celsius', unit))}°{unit === 'celsius' ? 'C' : 'F'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Average Temperature</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {Math.round(convertTemperature(statistics.maxTemp, 'celsius', unit))}°{unit === 'celsius' ? 'C' : 'F'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Highest Temperature</div>
                    </div>
                    <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                        {Math.round(convertTemperature(statistics.minTemp, 'celsius', unit))}°{unit === 'celsius' ? 'C' : 'F'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Lowest Temperature</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {Math.round(statistics.avgHumidity)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Average Humidity</div>
                    </div>
                  </div>
                </div>
                <DataVisualization forecast={forecast} unit={unit} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};