import { ForecastData } from '../types';

export const calculateDailyAverages = (hourlyData: any[]): ForecastData[] => {
  const dailyData: { [key: string]: any[] } = {};
  
  hourlyData.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyData[date]) dailyData[date] = [];
    dailyData[date].push(item);
  });

  return Object.entries(dailyData).slice(0, 5).map(([date, items]) => {
    const temps = items.map(item => item.main.temp - 273.15);
    return {
      date,
      temperature: {
        min: Math.min(...temps),
        max: Math.max(...temps),
        avg: temps.reduce((sum, temp) => sum + temp, 0) / temps.length
      },
      description: items[0].weather[0].description,
      icon: items[0].weather[0].icon,
      humidity: Math.round(items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length)
    };
  });
};