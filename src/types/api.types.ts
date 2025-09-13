export interface OpenWeatherMapResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  dt: number;
}

export interface OpenWeatherMapForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
  city: {
    name: string;
  };
}

export interface WeatherApiError {
  cod: string | number;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  timestamp: number;
}

export interface ApiCacheEntry<T> {
  data: T;
  timestamp: number;
}