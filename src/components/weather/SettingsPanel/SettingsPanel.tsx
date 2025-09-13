import React, { useContext } from "react";
import { RefreshCw } from "lucide-react";
import { ThemeContext } from "../../../contexts";

interface SettingsPanelProps {
  unit: "celsius" | "fahrenheit";
  onToggleUnit: () => void;
  onRefresh: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
}) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Settings
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            Temperature Unit
          </span>
          <button
            onClick={onToggleUnit}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            {unit === "celsius" ? "°C" : "°F"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Theme</span>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === "light" ? "Light" : "Dark"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Refresh Data</span>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};
