import type { Rng } from "./rng";

export function pick(rng: Rng, array: string[]): string {
  const length_ = array.length;

  if (length_ === 0) {
    throw new Error("pick() called with an empty array");
  }

  const index = Math.floor(rng() * length_);
  return array[index]!;
}

export function int(rng: Rng, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export type GeneratorWithPick<T> = (() => T) & {
  pick: (n: number) => T[];
  source?: readonly T[];
};

export function fromArray(
  rng: Rng,
  source: string[],
): GeneratorWithPick<string> {
  const fn = (() => pick(rng, source)) as GeneratorWithPick<string>;

  fn.pick = (n: number) => {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error(".pick(n): n must be a non-negative integer");
    }

    const out: string[] = [];
    for (let index = 0; index < n; index++) {
      out.push(fn());
    }
    return out;
  };

  fn.source = source;
  return fn;
}

export function fromFactory<T>(factory: () => T): GeneratorWithPick<T> {
  const fn = ((): T => factory()) as GeneratorWithPick<T>;

  fn.pick = (n: number) => {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error(".pick(n): n must be a non-negative integer");
    }
    const out: T[] = [];
    for (let index = 0; index < n; index++) {
      out.push(factory());
    }
    return out;
  };

  return fn;
}
