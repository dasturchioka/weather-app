import { useReducer, useCallback, useEffect } from "react";
import { WeatherState, WeatherAction } from "../types";
import { weatherApiService } from "../services"; // Updated import

const weatherReducer = (
  state: WeatherState,
  action: WeatherAction
): WeatherState => {
  switch (action.type) {
    case "FETCH_WEATHER":
      return {
        ...state,
        currentWeather: action.payload.weather,
        forecast: action.payload.forecast,
        isLoading: false,
        error: null,
        lastFetch: new Date(),
      };
    case "CHANGE_CITY":
      return {
        ...state,
        selectedCity: action.payload,
        isLoading: true,
        error: null,
      };
    case "TOGGLE_UNIT":
      return {
        ...state,
        unit: state.unit === "celsius" ? "fahrenheit" : "celsius",
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const useWeatherData = () => {
  const [state, dispatch] = useReducer(weatherReducer, {
    currentWeather: null,
    forecast: [],
    selectedCity: "London",
    unit: "celsius",
    isLoading: false,
    error: null,
    lastFetch: null,
  });

  const fetchWeather = useCallback(async (city: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { weather, forecast } =
        await weatherApiService.fetchWeatherAndForecast(city);
      dispatch({ type: "FETCH_WEATHER", payload: { weather, forecast } });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch weather data. Please try again.";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  }, []);

  const changeCity = useCallback(
    (city: string) => {
      dispatch({ type: "CHANGE_CITY", payload: city });
      fetchWeather(city);
    },
    [fetchWeather]
  );

  const toggleUnit = useCallback(() => {
    dispatch({ type: "TOGGLE_UNIT" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const refetch = useCallback(() => {
    console.log('Refetching');
    
    fetchWeather(state.selectedCity);
  }, [state.selectedCity, fetchWeather]);

  // Clear cache when component unmounts or city changes
  useEffect(() => {
    return () => {
      if (weatherApiService.getCacheSize() > 10) {
        weatherApiService.clearCache();
      }
    };
  }, []);

  useEffect(() => {
    fetchWeather(state.selectedCity);
  }, []);

  return {
    ...state,
    changeCity,
    toggleUnit,
    clearError,
    refetch,
  };
};
