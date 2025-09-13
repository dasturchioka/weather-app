import React from "react";
import { Cloud } from "lucide-react";
import { WEATHER_ICON_MAP } from "../../../constants";

interface WeatherIconProps {
  icon: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  icon,
  size = 48,
}) => {
  const IconComponent =
    WEATHER_ICON_MAP[icon as keyof typeof WEATHER_ICON_MAP] || Cloud;
  return (
    <IconComponent size={size} className="text-blue-600 dark:text-blue-400" />
  );
};
