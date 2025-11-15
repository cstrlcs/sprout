import { describe, expect, test } from "bun:test";

import { hashSeed, mulberry32 } from "./rng";

describe("RNG", () => {
  describe("hashSeed", () => {
    test("should produce consistent hashes for same input", () => {
      const hash1 = hashSeed("test");
      const hash2 = hashSeed("test");
      expect(hash1).toBe(hash2);
    });

    test("should produce different hashes for different inputs", () => {
      const hash1 = hashSeed("test1");
      const hash2 = hashSeed("test2");
      expect(hash1).not.toBe(hash2);
    });

    test("should handle numbers", () => {
      const hash1 = hashSeed(123);
      const hash2 = hashSeed(123);
      expect(hash1).toBe(hash2);
    });
  });

  describe("mulberry32", () => {
    test("should produce consistent random numbers with same seed", () => {
      const rng1 = mulberry32(12_345);
      const rng2 = mulberry32(12_345);

      expect(rng1()).toBe(rng2());
      expect(rng1()).toBe(rng2());
      expect(rng1()).toBe(rng2());
    });

    test("should produce different sequences with different seeds", () => {
      const rng1 = mulberry32(111);
      const rng2 = mulberry32(222);

      expect(rng1()).not.toBe(rng2());
    });

    test("should produce numbers between 0 and 1", () => {
      const rng = mulberry32(12_345);

      for (let index = 0; index < 100; index++) {
        const value = rng();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });
});
