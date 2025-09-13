import { Sun, Moon, Cloud, CloudRain, CloudSnow } from 'lucide-react';

export const WEATHER_ICON_MAP = {
  '01d': Sun,
  '01n': Moon,
  '02d': Cloud,
  '02n': Cloud,
  '03d': Cloud,
  '03n': Cloud,
  '04d': Cloud,
  '04n': Cloud,
  '09d': CloudRain,
  '09n': CloudRain,
  '10d': CloudRain,
  '10n': CloudRain,
  '11d': CloudRain,
  '11n': CloudRain,
  '13d': CloudSnow,
  '13n': CloudSnow,
  '50d': Cloud,
  '50n': Cloud,
} as const;