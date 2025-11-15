import { describe, expect, test } from "bun:test";

import { sprout } from "./index";

describe("Sprout", () => {
  test("should be seedable and produce consistent results", () => {
    sprout(12_345);
    const name1 = sprout.person.name();
    const address1 = sprout.address.cityName();

    sprout(12_345);
    const name2 = sprout.person.name();
    const address2 = sprout.address.cityName();

    expect(name1).toBe(name2);
    expect(address1).toBe(address2);
  });

  test("should generate different results with different seeds", () => {
    sprout(111);
    const name1 = sprout.person.name();

    sprout(222);
    const name2 = sprout.person.name();

    expect(name1).not.toBe(name2);
  });

  describe("pick function", () => {
    test("should pick an item from array", () => {
      const items = ["a", "b", "c"];
      const result = sprout.pick(items);
      expect(items).toContain(result);
    });

    test("should throw error for empty array", () => {
      expect(() => sprout.pick([])).toThrow("pick() called with an empty array");
    });
  });

  describe("unique function", () => {
    test("should return unique items from array", () => {
      sprout(12_345);
      const items = ["a", "b", "c"];
      const result1 = sprout.unique(items);
      const result2 = sprout.unique(items);
      const result3 = sprout.unique(items);

      expect([result1, result2, result3]).toEqual(expect.arrayContaining(items));
      expect(new Set([result1, result2, result3]).size).toBe(3);
    });

    test("should throw error when exhausted", () => {
      sprout(12_345);
      const items = ["a"];
      sprout.unique(items);
      expect(() => sprout.unique(items)).toThrow("unique() exhausted all available items");
    });

    test("should throw error for empty array", () => {
      expect(() => sprout.unique([])).toThrow("unique() called with an empty array");
    });
  });

  describe("from function", () => {
    test("should generate array of items", () => {
      sprout(12_345);
      const results = sprout.from(3, () => sprout.person.name());
      expect(results).toHaveLength(3);
      expect(results.every((name) => typeof name === "string")).toBe(true);
    });
  });

  describe("domains", () => {
    test("person domain should work", () => {
      // Set seed for consistent test
      sprout(12_345);
      const name = sprout.person.name();
      // Reset seed to ensure same name
      sprout(12_345);
      const lastName = sprout.person.lastName();
      // Reset seed to ensure consistency
      sprout(12_345);
      const fullName = sprout.person.fullName();

      expect(typeof name).toBe("string");
      expect(typeof lastName).toBe("string");
      expect(typeof fullName).toBe("string");
      expect(fullName).toContain(" ");
    });

    test("address domain should work", () => {
      const city = sprout.address.cityName();
      const state = sprout.address.stateName();
      const postalCode = sprout.address.postalCode();
      const street = sprout.address.streetAddress();
      const buildingNumber = sprout.address.buildingNumber();

      expect(typeof city).toBe("string");
      expect(typeof state).toBe("string");
      expect(typeof postalCode).toBe("string");
      expect(typeof street).toBe("string");
      expect(typeof buildingNumber).toBe("string");
      expect(postalCode).toMatch(/^\d{5}-\d{3}$/);
    });

    test("automotive domain should work", () => {
      const brand = sprout.automotive.brand();
      const model = sprout.automotive.model();
      const service = sprout.automotive.service();

      expect(typeof brand).toBe("string");
      expect(typeof model).toBe("string");
      expect(typeof service).toBe("string");
    });

    test("company domain should work", () => {
      const name = sprout.company.name();
      expect(typeof name).toBe("string");
    });

    test("lorem domain should work", () => {
      const word = sprout.lorem.word();
      const sentence = sprout.lorem.sentence();
      const paragraph = sprout.lorem.paragraph();

      expect(typeof word).toBe("string");
      expect(typeof sentence).toBe("string");
      expect(typeof paragraph).toBe("string");
    });
  });
});
