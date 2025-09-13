export const CITIES = ['London', 'New York', 'Tokyo', 'Sydney', 'Cairo'] as const;

export type CityName = typeof CITIES[number];