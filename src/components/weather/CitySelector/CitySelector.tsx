import React, { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { CITIES } from "../../../constants";
import { debounce } from "../../../utils";

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onCityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        console.log("Searching for:", term);
      }, 300),
    []
  );

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    onCityChange(city);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {selectedCity}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 w-[200px]">
          <div className="p-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                autoFocus={isOpen}
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              >
                {city}
              </button>
            ))}
            {filteredCities.length === 0 && (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                No cities found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
