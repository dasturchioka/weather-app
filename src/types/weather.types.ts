export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  icon: string;
  timestamp: Date;
}

export interface ForecastData {
  date: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  description: string;
  icon: string;
  humidity: number;
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData[];
  selectedCity: string;
  unit: 'celsius' | 'fahrenheit';
  isLoading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

export type WeatherAction =
  | { type: 'FETCH_WEATHER'; payload: { weather: WeatherData; forecast: ForecastData[] } }
  | { type: 'CHANGE_CITY'; payload: string }
  | { type: 'TOGGLE_UNIT' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };