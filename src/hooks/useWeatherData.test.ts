import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useWeatherData } from "../hooks/useWeatherData";

const { mockFetchWeatherAndForecast, mockClearCache, mockGetCacheSize } =
  vi.hoisted(() => {
    return {
      mockFetchWeatherAndForecast: vi.fn(),
      mockClearCache: vi.fn(),
      mockGetCacheSize: vi.fn().mockReturnValue(5),
    };
  });

vi.mock("../services", () => ({
  weatherApiService: {
    fetchWeatherAndForecast: mockFetchWeatherAndForecast,
    clearCache: mockClearCache,
    getCacheSize: mockGetCacheSize,
  },
}));

const mockWeatherData = {
  city: "London",
  temperature: 20,
  description: "clear sky",
  humidity: 65,
  windSpeed: 3.5,
  pressure: 1013,
  visibility: 10000,
  icon: "01d",
  timestamp: new Date("2024-01-15T12:00:00Z"),
};

const mockForecastData = [
  {
    date: "Mon Jan 15 2024",
    temperature: { min: 15, max: 22, avg: 18.5 },
    description: "partly cloudy",
    icon: "02d",
    humidity: 70,
  },
  {
    date: "Tue Jan 16 2024",
    temperature: { min: 12, max: 18, avg: 15 },
    description: "overcast",
    icon: "04d",
    humidity: 80,
  },
];

describe("useWeatherData Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCacheSize.mockReturnValue(5); // reset default
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with default state", () => {
    mockFetchWeatherAndForecast.mockResolvedValue({
      weather: mockWeatherData,
      forecast: mockForecastData,
    });

    const { result } = renderHook(() => useWeatherData());

    expect(result.current.currentWeather).toBeNull();
    expect(result.current.forecast).toEqual([]);
    expect(result.current.selectedCity).toBe("London");
    expect(result.current.unit).toBe("celsius");
    expect(result.current.error).toBeNull();
    expect(result.current.lastFetch).toBeNull();
  });

  it("should fetch weather data on mount", async () => {
    mockFetchWeatherAndForecast.mockResolvedValue({
      weather: mockWeatherData,
      forecast: mockForecastData,
    });

    const { result } = renderHook(() => useWeatherData());

    await waitFor(() => {
      expect(mockFetchWeatherAndForecast).toHaveBeenCalledWith("London");
    });

    await waitFor(() => {
      expect(result.current.currentWeather).toEqual(mockWeatherData);
      expect(result.current.forecast).toEqual(mockForecastData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.lastFetch).toBeInstanceOf(Date);
    });
  });

  it("should handle API errors correctly", async () => {
    const errorMessage = "City not found";
    mockFetchWeatherAndForecast.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useWeatherData());

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.currentWeather).toBeNull();
    });
  });

  it("should change city and fetch new data", async () => {
    const newCityData = { ...mockWeatherData, city: "New York" };
    mockFetchWeatherAndForecast
      .mockResolvedValueOnce({
        weather: mockWeatherData,
        forecast: mockForecastData,
      })
      .mockResolvedValueOnce({
        weather: newCityData,
        forecast: mockForecastData,
      });

    const { result } = renderHook(() => useWeatherData());

    await waitFor(() => {
      expect(result.current.currentWeather).toEqual(mockWeatherData);
    });

    act(() => {
      result.current.changeCity("New York");
    });

    expect(result.current.selectedCity).toBe("New York");
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.currentWeather).toEqual(newCityData);
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchWeatherAndForecast).toHaveBeenCalledWith("New York");
  });

  it("should toggle temperature unit", () => {
    mockFetchWeatherAndForecast.mockResolvedValue({
      weather: mockWeatherData,
      forecast: mockForecastData,
    });

    const { result } = renderHook(() => useWeatherData());

    expect(result.current.unit).toBe("celsius");

    act(() => {
      result.current.toggleUnit();
    });

    expect(result.current.unit).toBe("fahrenheit");

    act(() => {
      result.current.toggleUnit();
    });

    expect(result.current.unit).toBe("celsius");
  });

  it("should clear error", async () => {
    mockFetchWeatherAndForecast.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useWeatherData());

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it("should refetch data when refetch is called", async () => {
    mockFetchWeatherAndForecast.mockResolvedValue({
      weather: mockWeatherData,
      forecast: mockForecastData,
    });

    const { result } = renderHook(() => useWeatherData());

    await waitFor(() => {
      expect(result.current.currentWeather).toEqual(mockWeatherData);
    });

    // Clear previous calls
    mockFetchWeatherAndForecast.mockClear();

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(mockFetchWeatherAndForecast).toHaveBeenCalledWith("London");
    });
  });

  it("should handle loading state correctly during city change", () => {
    mockFetchWeatherAndForecast.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({ weather: mockWeatherData, forecast: mockForecastData }),
            100
          );
        })
    );

    const { result } = renderHook(() => useWeatherData());

    act(() => {
      result.current.changeCity("Tokyo");
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.selectedCity).toBe("Tokyo");
  });

  it("should handle non-Error objects in catch block", async () => {
    mockFetchWeatherAndForecast.mockRejectedValue("String error");

    const { result } = renderHook(() => useWeatherData());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Failed to fetch weather data. Please try again."
      );
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should clear cache when cache size exceeds limit on unmount", () => {
    mockGetCacheSize.mockReturnValue(15);
    mockFetchWeatherAndForecast.mockResolvedValue({
      weather: mockWeatherData,
      forecast: mockForecastData,
    });

    const { unmount } = renderHook(() => useWeatherData());

    unmount();

    expect(mockClearCache).toHaveBeenCalled();
  });

  it("should not clear cache when cache size is within limit on unmount", () => {
    mockGetCacheSize.mockReturnValue(5);
    mockFetchWeatherAndForecast.mockResolvedValue({
      weather: mockWeatherData,
      forecast: mockForecastData,
    });

    const { unmount } = renderHook(() => useWeatherData());

    unmount();

    expect(mockClearCache).not.toHaveBeenCalled();
  });
});
