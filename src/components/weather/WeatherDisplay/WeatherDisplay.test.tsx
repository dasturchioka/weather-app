// WeatherDisplay.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeatherData } from "@/types";
import { WeatherDisplay } from "./WeatherDisplay";

import "@testing-library/jest-dom/vitest";

// Mock the utility function
vi.mock("../src/utils/temperatureUtils", () => ({
  convertTemperature: vi.fn((temp, from, to) => {
    if (from === to) return temp;
    if (from === "celsius" && to === "fahrenheit") {
      return (temp * 9) / 5 + 32;
    }
    return ((temp - 32) * 5) / 9;
  }),
}));

// Mock the WeatherIcon component
vi.mock("../../common/WeatherIcon", () => ({
  WeatherIcon: ({ icon, size }: { icon: string; size: number }) => (
    <div data-testid="weather-icon" data-icon={icon} data-size={size}>
      Weather Icon: {icon}
    </div>
  ),
}));

const createMockWeatherData = (
  overrides?: Partial<WeatherData>
): WeatherData => ({
  city: "London",
  temperature: 20,
  description: "clear sky",
  humidity: 65,
  windSpeed: 3.5,
  pressure: 1013,
  visibility: 10000,
  icon: "01d",
  timestamp: new Date("2024-01-15T12:30:00Z"),
  ...overrides,
});

describe("WeatherDisplay Component", () => {
  describe("Rendering and Structure", () => {
    it("should render with celsius temperature", () => {
      const weatherData = createMockWeatherData();
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("London")).toBeInTheDocument();
      expect(screen.getByText("20°C")).toBeInTheDocument();
      expect(screen.getByText("clear sky")).toBeInTheDocument();

      const icon = screen.getByTestId("weather-icon");
      expect(icon).toHaveAttribute("data-icon", "01d");
    });

    it("should render with fahrenheit temperature", () => {
      const weatherData = createMockWeatherData();
      const { container } = render(
        <WeatherDisplay weather={weatherData} unit="fahrenheit" />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("should render correctly with different cities", () => {
      const weatherData = createMockWeatherData({ city: "New York" });
      const { container } = render(
        <WeatherDisplay weather={weatherData} unit="celsius" />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("should render correctly with different weather conditions", () => {
      const weatherData = createMockWeatherData({
        description: "heavy rain",
        icon: "10d",
        humidity: 85,
        windSpeed: 7.2,
        pressure: 995,
        visibility: 5000,
      });
      const { container } = render(
        <WeatherDisplay weather={weatherData} unit="celsius" />
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("Content Display", () => {
    it("should display city name correctly", () => {
      const weatherData = createMockWeatherData({ city: "Tokyo" });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("Tokyo")).toBeInTheDocument();
    });

    it("should display weather description correctly", () => {
      const weatherData = createMockWeatherData({
        description: "partly cloudy",
      });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("partly cloudy")).toBeInTheDocument();
    });

    it("should display temperature in celsius", () => {
      const weatherData = createMockWeatherData({ temperature: 25 });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("25°C")).toBeInTheDocument();
    });

    it("should display temperature in fahrenheit", () => {
      const weatherData = createMockWeatherData({ temperature: 20 });
      render(<WeatherDisplay weather={weatherData} unit="fahrenheit" />);

      expect(screen.getByText("68°F")).toBeInTheDocument();
    });

    it("should display humidity percentage", () => {
      const weatherData = createMockWeatherData({ humidity: 75 });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("should display wind speed", () => {
      const weatherData = createMockWeatherData({ windSpeed: 4.2 });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("4.2 m/s")).toBeInTheDocument();
    });

    it("should display pressure", () => {
      const weatherData = createMockWeatherData({ pressure: 1020 });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("1020 hPa")).toBeInTheDocument();
    });

    it("should display visibility in kilometers", () => {
      const weatherData = createMockWeatherData({ visibility: 8000 });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("8 km")).toBeInTheDocument();
    });

    it("should display formatted timestamp", () => {
      const timestamp = new Date("2024-01-15T14:30:00Z");
      const weatherData = createMockWeatherData({ timestamp });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      const timeString = timestamp.toLocaleTimeString();
      expect(screen.getByText(`Updated ${timeString}`)).toBeInTheDocument();
    });

    it("should render weather icon with correct props", () => {
      const weatherData = createMockWeatherData({ icon: "02n" });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      const weatherIcon = screen.getByTestId("weather-icon");
      expect(weatherIcon).toHaveAttribute("data-icon", "02n");
      expect(weatherIcon).toHaveAttribute("data-size", "64");
    });
  });

  describe("Temperature Rounding", () => {
    it("should round temperature to nearest integer", () => {
      const weatherData = createMockWeatherData({ temperature: 22.7 });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("23°C")).toBeInTheDocument();
    });

    it("should round down when temperature is below .5", () => {
      const weatherData = createMockWeatherData({ temperature: 22.3 });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("22°C")).toBeInTheDocument();
    });

    it("should handle negative temperatures correctly", () => {
      const weatherData = createMockWeatherData({ temperature: -5.2 });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("-5°C")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero values correctly", () => {
      const weatherData = createMockWeatherData({
        temperature: 0,
        humidity: 0,
        windSpeed: 0,
        pressure: 0,
        visibility: 0,
      });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("0°C")).toBeInTheDocument();
      expect(screen.getByText("0%")).toBeInTheDocument();
      expect(screen.getByText("0 m/s")).toBeInTheDocument();
      expect(screen.getByText("0 hPa")).toBeInTheDocument();
      expect(screen.getByText("0 km")).toBeInTheDocument();
    });

    it("should handle very high values correctly", () => {
      const weatherData = createMockWeatherData({
        temperature: 50,
        humidity: 100,
        windSpeed: 25.5,
        pressure: 1050,
        visibility: 50000,
      });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("50°C")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(screen.getByText("25.5 m/s")).toBeInTheDocument();
      expect(screen.getByText("1050 hPa")).toBeInTheDocument();
      expect(screen.getByText("50 km")).toBeInTheDocument();
    });

    it("should handle empty or special characters in city name", () => {
      const weatherData = createMockWeatherData({ city: "São Paulo" });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("São Paulo")).toBeInTheDocument();
    });

    it("should handle special characters in description", () => {
      const weatherData = createMockWeatherData({
        description: "heavy rain & thunderstorm",
      });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      expect(screen.getByText("heavy rain & thunderstorm")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      const weatherData = createMockWeatherData();
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      const cityHeading = screen.getByRole("heading", { level: 2 });
      expect(cityHeading).toHaveTextContent("London");
    });

    it("should render all metric values as text content", () => {
      const weatherData = createMockWeatherData({
        humidity: 80,
        windSpeed: 5.5,
        pressure: 1015,
        visibility: 12000,
      });
      render(<WeatherDisplay weather={weatherData} unit="celsius" />);

      // Verify all metrics are accessible as text
      expect(screen.getByText("80%")).toBeInTheDocument();
      expect(screen.getByText("5.5 m/s")).toBeInTheDocument();
      expect(screen.getByText("1015 hPa")).toBeInTheDocument();
      expect(screen.getByText("12 km")).toBeInTheDocument();
    });
  });

  describe("Responsive Design Elements", () => {
    it("should render with proper CSS grid structure", () => {
      const weatherData = createMockWeatherData();
      const { container } = render(
        <WeatherDisplay weather={weatherData} unit="celsius" />
      );

      const metricsGrid = container.querySelector(
        ".grid.grid-cols-2.md\\:grid-cols-4"
      );
      expect(metricsGrid).toBeInTheDocument();
    });

    it("should apply correct background gradient classes", () => {
      const weatherData = createMockWeatherData();
      const { container } = render(
        <WeatherDisplay weather={weatherData} unit="celsius" />
      );

      const mainContainer = container.querySelector(
        ".bg-gradient-to-br.from-blue-50.to-indigo-100"
      );
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe("Props Validation", () => {
    it("should handle missing optional properties gracefully", () => {
      // This test ensures the component doesn't break with minimal data
      const minimalWeatherData = {
        city: "Test City",
        temperature: 15,
        description: "test weather",
        humidity: 50,
        windSpeed: 2.0,
        pressure: 1000,
        visibility: 10000,
        icon: "01d",
        timestamp: new Date(),
      } as WeatherData;

      const { container } = render(
        <WeatherDisplay weather={minimalWeatherData} unit="celsius" />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("should update correctly when props change", () => {
      const initialWeather = createMockWeatherData({
        city: "London",
        temperature: 20,
      });
      const { rerender } = render(
        <WeatherDisplay weather={initialWeather} unit="celsius" />
      );

      expect(screen.getByText("London")).toBeInTheDocument();
      expect(screen.getByText("20°C")).toBeInTheDocument();

      const updatedWeather = createMockWeatherData({
        city: "Paris",
        temperature: 25,
      });
      rerender(<WeatherDisplay weather={updatedWeather} unit="fahrenheit" />);

      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.getByText("77°F")).toBeInTheDocument();
    });
  });

  describe("Snapshot Tests for Different States", () => {
    it("should render correctly with rainy weather", () => {
      const rainyWeather = createMockWeatherData({
        description: "moderate rain",
        icon: "10d",
        temperature: 15,
      });
      render(<WeatherDisplay weather={rainyWeather} unit="fahrenheit" />);

      expect(screen.getByText("moderate rain")).toBeInTheDocument();
      expect(screen.getByText("59°F")).toBeInTheDocument();

      const icon = screen.getByTestId("weather-icon");
      expect(icon).toHaveAttribute("data-icon", "10d");
    });

    it("should match snapshot for rainy weather", () => {
      const rainyWeather = createMockWeatherData({
        description: "moderate rain",
        icon: "10d",
        temperature: 15,
        humidity: 90,
        windSpeed: 8.5,
        pressure: 995,
        visibility: 3000,
      });
      const { container } = render(
        <WeatherDisplay weather={rainyWeather} unit="fahrenheit" />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for snowy weather", () => {
      const snowyWeather = createMockWeatherData({
        description: "light snow",
        icon: "13d",
        temperature: -2,
        humidity: 85,
        windSpeed: 4.2,
        pressure: 1008,
        visibility: 2000,
      });
      const { container } = render(
        <WeatherDisplay weather={snowyWeather} unit="celsius" />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for cloudy weather", () => {
      const cloudyWeather = createMockWeatherData({
        description: "overcast clouds",
        icon: "04d",
        temperature: 18,
        humidity: 70,
        windSpeed: 3.8,
        pressure: 1012,
        visibility: 8000,
      });
      const { container } = render(
        <WeatherDisplay weather={cloudyWeather} unit="celsius" />
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
