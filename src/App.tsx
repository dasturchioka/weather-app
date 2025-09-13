import React from "react";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ThemeProvider } from "./contexts";
import { WeatherWidget } from "./components/weather/WeatherWidget";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <WeatherWidget />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
