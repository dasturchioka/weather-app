import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce";

describe("debounce utility", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useFakeTimers();
  });

  it("should call the function after the specified delay", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should not call the function if called again before delay", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    vi.advanceTimersByTime(500);
    debouncedFn();
    vi.advanceTimersByTime(500);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should reset the timer on each call", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    vi.advanceTimersByTime(800);

    debouncedFn();
    vi.advanceTimersByTime(800);

    debouncedFn();
    vi.advanceTimersByTime(800);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments correctly to the debounced function", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn("arg1", "arg2", 123);

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  it("should use the latest arguments when called multiple times", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn("first");
    vi.advanceTimersByTime(500);

    debouncedFn("second");
    vi.advanceTimersByTime(500);

    debouncedFn("third");
    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("third");
  });

  it("should handle multiple separate calls after delay", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn("call1");
    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("call1");

    debouncedFn("call2");
    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith("call2");
  });

  it("should work with different delay values", () => {
    const mockFn = vi.fn();

    const shortDebounce = debounce(mockFn, 100);
    const longDebounce = debounce(mockFn, 2000);

    shortDebounce("short");
    longDebounce("long");

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("short");

    vi.advanceTimersByTime(1900);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith("long");
  });

  it("should handle zero delay", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should maintain proper this context", () => {
    const obj = {
      value: "test",
      method: function (arg: string) {
        return `${this.value}-${arg}`;
      },
    };

    const debouncedMethod = debounce(function (this: typeof obj, arg: string) {
      return obj.method.call(this, arg);
    }, 1000);

    const spy = vi.fn();
    const boundDebounced = debouncedMethod.bind(obj);

    // Mock the original method to test it was called
    obj.method = vi.fn().mockReturnValue("test-result");

    boundDebounced("input");
    vi.advanceTimersByTime(1000);

    expect(obj.method).toHaveBeenCalledWith("input");
  });

  it("should not call function if never advanced past delay", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(999);

    expect(mockFn).not.toHaveBeenCalled();
  });

  it("should handle rapid successive calls correctly", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    // Simulate rapid calls
    for (let i = 0; i < 10; i++) {
      debouncedFn(`call-${i}`);
      vi.advanceTimersByTime(50);
    }

    // Should not have been called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Advance past the delay from the last call
    vi.advanceTimersByTime(1000);

    // Should be called once with the last argument
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("call-9");
  });

  it("should work with functions that return values", () => {
    const mockFn = vi.fn().mockReturnValue("result");
    const debouncedFn = debounce(mockFn, 1000);

    // Note: debounced functions don't return the result immediately
    // since they execute asynchronously
    const result = debouncedFn();
    expect(result).toBeUndefined();

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveReturnedWith("result");
  });

  it("should handle complex argument types", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 1000);

    const complexArg = {
      nested: { value: 123 },
      array: [1, 2, 3],
      fn: () => "test",
    };

    debouncedFn(complexArg, null, undefined, true);

    vi.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledWith(complexArg, null, undefined, true);
  });

  it("should create independent debounced functions", () => {
    const mockFn1 = vi.fn();
    const mockFn2 = vi.fn();

    const debouncedFn1 = debounce(mockFn1, 1000);
    const debouncedFn2 = debounce(mockFn2, 500);

    debouncedFn1("fn1");
    debouncedFn2("fn2");

    vi.advanceTimersByTime(500);

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledWith("fn2");

    vi.advanceTimersByTime(500);

    expect(mockFn1).toHaveBeenCalledWith("fn1");
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
});
