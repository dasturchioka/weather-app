import {
  OpenWeatherMapForecastResponse,
  OpenWeatherMapResponse,
  WeatherData,
  ForecastData,
} from "../../types";

interface WeatherApiError {
  cod: string | number;
  message: string;
}

class WeatherApiService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly requestCache = new Map<
    string,
    { data: any; timestamp: number }
  >();
  private readonly cacheTimeout = 5 * 1000;

  constructor() {
    this.baseUrl =
      import.meta.env.VITE_WEATHER_API_BASE_URL ||
      "https://api.openweathermap.org/data/2.5";
    this.apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!this.apiKey) {
      throw new Error(
        "Weather API key is not configured. Please add VITE_WEATHER_API_KEY to your .env file."
      );
    }
  }

  private async makeRequest<T>(url: string): Promise<T> {
    const cacheKey = url;
    const cached = this.requestCache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData: WeatherApiError = await response.json();
        throw new Error(this.getErrorMessage(response.status, errorData));
      }

      const data: T = await response.json();

      // Cache successful response
      this.requestCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred while fetching weather data");
    }
  }

  private getErrorMessage(status: number, errorData?: WeatherApiError): string {
    switch (status) {
      case 401:
        return "Invalid API key. Please check your OpenWeatherMap API key configuration.";
      case 404:
        return `City not found. Please check the city name and try again.`;
      case 429:
        return "API rate limit exceeded. Please try again in a few minutes.";
      case 500:
        return "Weather service is temporarily unavailable. Please try again later.";
      default:
        return (
          errorData?.message ||
          `Weather service error (${status}). Please try again.`
        );
    }
  }

  private transformWeatherData(data: OpenWeatherMapResponse): WeatherData {
    return {
      city: data.name,
      temperature: data.main.temp - 273.15, // Convert from Kelvin to Celsius
      description: data.weather[0]?.description || "Unknown",
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility,
      icon: data.weather[0]?.icon || "01d",
      timestamp: new Date(data.dt * 1000),
    };
  }

  private calculateDailyAverages(
    hourlyData: OpenWeatherMapForecastResponse["list"]
  ): ForecastData[] {
    const dailyData: { [key: string]: typeof hourlyData } = {};

    hourlyData.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(item);
    });

    return Object.entries(dailyData)
      .slice(0, 5) // Only return 5 days
      .map(([date, items]) => {
        const temps = items.map((item) => item.main.temp - 273.15); // Convert to Celsius
        return {
          date,
          temperature: {
            min: Math.min(...temps),
            max: Math.max(...temps),
            avg: temps.reduce((sum, temp) => sum + temp, 0) / temps.length,
          },
          description: items[0].weather[0]?.description || "Unknown",
          icon: items[0].weather[0]?.icon || "01d",
          humidity: Math.round(
            items.reduce((sum, item) => sum + item.main.humidity, 0) /
              items.length
          ),
        };
      });
  }

  async fetchWeather(city: string): Promise<WeatherData> {
    if (!city.trim()) {
      throw new Error("City name cannot be empty");
    }

    const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${
      this.apiKey
    }`;

    try {
      const data = await this.makeRequest<OpenWeatherMapResponse>(url);
      return this.transformWeatherData(data);
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      throw error;
    }
  }

  async fetchForecast(city: string): Promise<ForecastData[]> {
    if (!city.trim()) {
      throw new Error("City name cannot be empty");
    }

    const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${
      this.apiKey
    }`;

    try {
      const data = await this.makeRequest<OpenWeatherMapForecastResponse>(url);
      return this.calculateDailyAverages(data.list);
    } catch (error) {
      console.error(`Error fetching forecast for ${city}:`, error);
      throw error;
    }
  }

  async fetchWeatherAndForecast(
    city: string
  ): Promise<{ weather: WeatherData; forecast: ForecastData[] }> {
    try {
      const [weather, forecast] = await Promise.all([
        this.fetchWeather(city),
        this.fetchForecast(city),
      ]);

      return { weather, forecast };
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
      throw error;
    }
  }

  clearCache(): void {
    this.requestCache.clear();
  }

  getCacheSize(): number {
    return this.requestCache.size;
  }
}

// Export singleton instance
export const weatherApiService = new WeatherApiService();

// Export class for testing purposes
export { WeatherApiService };
