# API Documentation

## Overview

The Weather Dashboard integrates with the OpenWeatherMap API to fetch current weather data and 5-day forecasts. The API layer is abstracted through a service class that handles caching, error management, and data transformation.

## API Service Architecture

### WeatherApiService Class

Located in `src/services/api/weatherApi.ts`, this singleton service manages all weather data operations.

#### Configuration

The service requires environment variables:
- `VITE_WEATHER_API_KEY`: Your OpenWeatherMap API key
- `VITE_WEATHER_API_BASE_URL`: API base URL (defaults to `https://api.openweathermap.org/data/2.5`)

#### Core Methods

##### `fetchWeather(city: string): Promise<WeatherData>`
Fetches current weather data for a specified city.

**Parameters:**
- `city`: City name (string, required, non-empty)

**Returns:** Promise resolving to `WeatherData` object

**Throws:**
- Error if city name is empty
- Network errors
- API-specific errors (401, 404, 429, 500)

##### `fetchForecast(city: string): Promise<ForecastData[]>`
Fetches 5-day weather forecast for a specified city.

**Parameters:**
- `city`: City name (string, required, non-empty)

**Returns:** Promise resolving to array of `ForecastData` objects

##### `fetchWeatherAndForecast(city: string): Promise<{weather: WeatherData, forecast: ForecastData[]}>`
Fetches both current weather and forecast data concurrently.

**Parameters:**
- `city`: City name (string, required, non-empty)

**Returns:** Promise resolving to object containing both weather and forecast data

## Data Models

### OpenWeatherMap Response Types

#### OpenWeatherMapResponse
```typescript
interface OpenWeatherMapResponse {
  name: string;
  main: {
    temp: number;        // Temperature in Kelvin
    humidity: number;    // Humidity percentage
    pressure: number;    // Atmospheric pressure in hPa
  };
  weather: Array<{
    description: string; // Weather description
    icon: string;       // Icon code
  }>;
  wind: {
    speed: number;      // Wind speed in m/s
  };
  visibility: number;   // Visibility in meters
  dt: number;          // Unix timestamp
}
```

#### OpenWeatherMapForecastResponse
```typescript
interface OpenWeatherMapForecastResponse {
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
```

### Application Data Types

#### WeatherData
```typescript
interface WeatherData {
  city: string;
  temperature: number;    // Temperature in Celsius
  description: string;
  humidity: number;       // Percentage
  windSpeed: number;      // m/s
  pressure: number;       // hPa
  visibility: number;     // meters
  icon: string;          // Weather icon code
  timestamp: Date;       // When data was fetched
}
```

#### ForecastData
```typescript
interface ForecastData {
  date: string;
  temperature: {
    min: number;    // Minimum temperature (Celsius)
    max: number;    // Maximum temperature (Celsius)
    avg: number;    // Average temperature (Celsius)
  };
  description: string;
  icon: string;
  humidity: number;  // Average humidity percentage
}
```

## Caching Strategy

### Request Caching
- **Cache Duration**: 5 seconds per request
- **Cache Key**: Full API URL
- **Cache Storage**: In-memory Map structure
- **Cache Management**: Automatic cleanup when cache size exceeds 10 entries

### Cache Methods
```typescript
clearCache(): void          // Manually clear all cached data
getCacheSize(): number      // Get current cache entry count
```

## Error Handling

### Error Types
The service handles various error scenarios with specific error messages:

- **401 Unauthorized**: Invalid API key
- **404 Not Found**: City not found
- **429 Rate Limited**: API rate limit exceeded
- **500 Server Error**: Weather service unavailable
- **Network Errors**: Connection issues

### Error Response Format
```typescript
interface WeatherApiError {
  cod: string | number;
  message: string;
}
```

## Data Transformation

### Temperature Conversion
All temperatures are automatically converted from Kelvin (API response) to Celsius for internal use.

### Forecast Aggregation
5-day forecast data is processed as follows:
1. Hourly data is grouped by date
2. Daily temperatures are calculated (min, max, average)
3. Humidity is averaged across the day
4. First weather condition of the day represents the entire day

## API Endpoints Used

### Current Weather
```
GET /weather?q={city}&appid={apiKey}
```

### 5-Day Forecast
```
GET /forecast?q={city}&appid={apiKey}
```

## Rate Limiting

OpenWeatherMap free tier limitations:
- 60 calls per minute
- 1,000 calls per day

The application implements client-side caching to minimize API calls and respect rate limits.

## Security Considerations

- API keys are stored in environment variables
- No API keys are exposed in client-side code
- Input validation prevents empty city names
- Error messages don't expose sensitive information