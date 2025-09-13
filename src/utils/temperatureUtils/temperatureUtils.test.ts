import { describe, it, expect } from 'vitest';
import { convertTemperature } from './temperatureUtils';

describe('Temperature Conversion Utilities', () => {
  describe('convertTemperature', () => {
    describe('Celsius to Fahrenheit conversion', () => {
      it('should convert 0°C to 32°F', () => {
        const result = convertTemperature(0, 'celsius', 'fahrenheit');
        expect(result).toBe(32);
      });

      it('should convert 100°C to 212°F', () => {
        const result = convertTemperature(100, 'celsius', 'fahrenheit');
        expect(result).toBe(212);
      });

      it('should convert 20°C to 68°F', () => {
        const result = convertTemperature(20, 'celsius', 'fahrenheit');
        expect(result).toBe(68);
      });

      it('should convert -40°C to -40°F', () => {
        const result = convertTemperature(-40, 'celsius', 'fahrenheit');
        expect(result).toBe(-40);
      });

      it('should handle decimal values correctly', () => {
        const result = convertTemperature(22.5, 'celsius', 'fahrenheit');
        expect(result).toBeCloseTo(72.5, 1);
      });

      it('should convert negative temperatures correctly', () => {
        const result = convertTemperature(-10, 'celsius', 'fahrenheit');
        expect(result).toBe(14);
      });
    });

    describe('Fahrenheit to Celsius conversion', () => {
      it('should convert 32°F to 0°C', () => {
        const result = convertTemperature(32, 'fahrenheit', 'celsius');
        expect(result).toBe(0);
      });

      it('should convert 212°F to 100°C', () => {
        const result = convertTemperature(212, 'fahrenheit', 'celsius');
        expect(result).toBe(100);
      });

      it('should convert 68°F to 20°C', () => {
        const result = convertTemperature(68, 'fahrenheit', 'celsius');
        expect(result).toBe(20);
      });

      it('should convert -40°F to -40°C', () => {
        const result = convertTemperature(-40, 'fahrenheit', 'celsius');
        expect(result).toBe(-40);
      });

      it('should handle decimal values correctly', () => {
        const result = convertTemperature(72.5, 'fahrenheit', 'celsius');
        expect(result).toBeCloseTo(22.5, 1);
      });

      it('should convert negative temperatures correctly', () => {
        const result = convertTemperature(14, 'fahrenheit', 'celsius');
        expect(result).toBe(-10);
      });
    });

    describe('Same unit conversion', () => {
      it('should return the same value when converting celsius to celsius', () => {
        const temperature = 25;
        const result = convertTemperature(temperature, 'celsius', 'celsius');
        expect(result).toBe(temperature);
      });

      it('should return the same value when converting fahrenheit to fahrenheit', () => {
        const temperature = 77;
        const result = convertTemperature(temperature, 'fahrenheit', 'fahrenheit');
        expect(result).toBe(temperature);
      });

      it('should handle zero when converting same units', () => {
        const result1 = convertTemperature(0, 'celsius', 'celsius');
        const result2 = convertTemperature(0, 'fahrenheit', 'fahrenheit');
        expect(result1).toBe(0);
        expect(result2).toBe(0);
      });

      it('should handle negative values when converting same units', () => {
        const result1 = convertTemperature(-15, 'celsius', 'celsius');
        const result2 = convertTemperature(-15, 'fahrenheit', 'fahrenheit');
        expect(result1).toBe(-15);
        expect(result2).toBe(-15);
      });
    });

    describe('Edge cases and precision', () => {
      it('should handle very large positive numbers', () => {
        const result = convertTemperature(1000, 'celsius', 'fahrenheit');
        expect(result).toBe(1832);
      });

      it('should handle very large negative numbers', () => {
        const result = convertTemperature(-1000, 'celsius', 'fahrenheit');
        expect(result).toBe(-1768);
      });

      it('should maintain precision for small decimal values', () => {
        const result = convertTemperature(0.1, 'celsius', 'fahrenheit');
        expect(result).toBeCloseTo(32.18, 2);
      });

      it('should handle floating point precision correctly', () => {
        const result = convertTemperature(36.6, 'celsius', 'fahrenheit');
        expect(result).toBeCloseTo(97.88, 2);
      });
    });

    describe('Real-world temperature scenarios', () => {
      it('should convert typical room temperature (20°C to 68°F)', () => {
        const result = convertTemperature(20, 'celsius', 'fahrenheit');
        expect(result).toBe(68);
      });

      it('should convert body temperature (37°C to 98.6°F)', () => {
        const result = convertTemperature(37, 'celsius', 'fahrenheit');
        expect(result).toBeCloseTo(98.6, 1);
      });

      it('should convert freezing point of water (0°C to 32°F)', () => {
        const result = convertTemperature(0, 'celsius', 'fahrenheit');
        expect(result).toBe(32);
      });

      it('should convert hot summer day (35°C to 95°F)', () => {
        const result = convertTemperature(35, 'celsius', 'fahrenheit');
        expect(result).toBe(95);
      });

      it('should convert cold winter day (-20°C to -4°F)', () => {
        const result = convertTemperature(-20, 'celsius', 'fahrenheit');
        expect(result).toBe(-4);
      });
    });

    describe('Bidirectional conversion accuracy', () => {
      it('should maintain accuracy when converting back and forth', () => {
        const original = 25;
        const toFahrenheit = convertTemperature(original, 'celsius', 'fahrenheit');
        const backToCelsius = convertTemperature(toFahrenheit, 'fahrenheit', 'celsius');
        expect(backToCelsius).toBeCloseTo(original, 10);
      });

      it('should maintain accuracy for negative temperatures', () => {
        const original = -15;
        const toFahrenheit = convertTemperature(original, 'celsius', 'fahrenheit');
        const backToCelsius = convertTemperature(toFahrenheit, 'fahrenheit', 'celsius');
        expect(backToCelsius).toBeCloseTo(original, 10);
      });

      it('should maintain accuracy for decimal temperatures', () => {
        const original = 23.7;
        const toFahrenheit = convertTemperature(original, 'celsius', 'fahrenheit');
        const backToCelsius = convertTemperature(toFahrenheit, 'fahrenheit', 'celsius');
        expect(backToCelsius).toBeCloseTo(original, 10);
      });
    });
  });
});