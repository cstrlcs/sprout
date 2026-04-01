import { describe, expect, test } from "bun:test";

import { mulberry32 } from "@/core/rng";
import { fromArray, fromFactory, int, pick } from "@/core/utils";

describe("pick", () => {
  test("throws on empty array", () => {
    const rng = mulberry32(1);
    expect(() => pick(rng, [])).toThrow("pick() called with an empty array");
  });

  test("returns item from array", () => {
    const rng = mulberry32(1);
    const arr = ["a", "b", "c"];
    expect(arr).toContain(pick(rng, arr));
  });
});

describe("int", () => {
  test("returns integer within range", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      const v = int(rng, 5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});

describe("fromArray", () => {
  test("returns values from source", () => {
    const rng = mulberry32(1);
    const arr = ["x", "y", "z"];
    const gen = fromArray(rng, arr);
    expect(arr).toContain(gen());
  });

  test("exposes source", () => {
    const rng = mulberry32(1);
    const arr = ["x", "y", "z"];
    expect(fromArray(rng, arr).source).toBe(arr);
  });

  test(".pick(n) returns n items", () => {
    const rng = mulberry32(1);
    const arr = ["a", "b", "c"];
    const gen = fromArray(rng, arr);
    const result = gen.pick(3);
    expect(result).toHaveLength(3);
    expect(result.every((v) => arr.includes(v))).toBe(true);
  });

  test(".pick(0) returns empty array", () => {
    const rng = mulberry32(1);
    const gen = fromArray(rng, ["a"]);
    expect(gen.pick(0)).toEqual([]);
  });

  test(".pick(n) throws for negative n", () => {
    const rng = mulberry32(1);
    const gen = fromArray(rng, ["a"]);
    expect(() => gen.pick(-1)).toThrow(".pick(n): n must be a non-negative integer");
  });

  test(".pick(n) throws for non-integer n", () => {
    const rng = mulberry32(1);
    const gen = fromArray(rng, ["a"]);
    expect(() => gen.pick(1.5)).toThrow(".pick(n): n must be a non-negative integer");
  });
});

describe("fromFactory", () => {
  test("calls factory on each invocation", () => {
    let count = 0;
    const gen = fromFactory(() => ++count);
    gen();
    gen();
    expect(count).toBe(2);
  });

  test(".pick(n) returns n items", () => {
    let count = 0;
    const gen = fromFactory(() => ++count);
    const result = gen.pick(4);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  test(".pick(0) returns empty array", () => {
    const gen = fromFactory(() => "x");
    expect(gen.pick(0)).toEqual([]);
  });

  test(".pick(n) throws for negative n", () => {
    const gen = fromFactory(() => "x");
    expect(() => gen.pick(-1)).toThrow(".pick(n): n must be a non-negative integer");
  });

  test(".pick(n) throws for non-integer n", () => {
    const gen = fromFactory(() => "x");
    expect(() => gen.pick(2.5)).toThrow(".pick(n): n must be a non-negative integer");
  });
});
