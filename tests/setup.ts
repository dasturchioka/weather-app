import "@testing-library/jest-dom/vitest";
import { vi, beforeAll, afterAll } from "vitest";

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  // Fix system clock for all tests
  vi.setSystemTime(new Date("2024-01-15T12:30:00Z"));

  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
  vi.useRealTimers(); // reset system time
});
