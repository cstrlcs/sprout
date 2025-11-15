import { createAddressDomain } from "@/modules/address";
import { createAutomotiveDomain } from "@/modules/automotive";
import { createCompanyDomain } from "@/modules/company";
import { createLoremDomain } from "@/modules/lorem";
import { createPersonDomain } from "@/modules/person";
import { hashSeed, mulberry32, type Rng } from "@/core/rng";

let rng: Rng = mulberry32(Date.now());
interface State<T> { pool: T[]; index: number }

interface Sprout {
  (seed?: string | number): void;
  address: ReturnType<typeof createAddressDomain>;
  person: ReturnType<typeof createPersonDomain>;
  automotive: ReturnType<typeof createAutomotiveDomain>;
  lorem: ReturnType<typeof createLoremDomain>;
  company: ReturnType<typeof createCompanyDomain>;

  from: <T>(count: number, fn: () => T) => T[];
  pick: <T>(array: T[]) => T;
  unique: <T>(array: readonly T[]) => T | never;
}

function makeDomains(r: Rng) {
  return {
    address: createAddressDomain(r),
    person: createPersonDomain(r),
    automotive: createAutomotiveDomain(r),
    lorem: createLoremDomain(r),
    company: createCompanyDomain(r),
  };
}

const domains = makeDomains(rng);

const sproutFn = ((seed?: string | number) => {
  if (seed !== undefined) {
    const hashed = hashSeed(seed);
    rng = mulberry32(hashed);

    Object.assign(sproutFn, makeDomains(rng));
  }
}) as Sprout;

sproutFn.from = function from<T>(count: number, fn: () => T): T[] {
  return Array.from({ length: count }, fn);
};

sproutFn.pick = function pick<T>(array: T[]): T {
  const item = array[Math.floor(rng() * array.length)];

  if (!item) {
    throw new Error("pick() called with an empty array");
  }

  return item;
};

const uniqueStateByKey = new Map<string, State<unknown>>();
// Prevent memory leaks
const UNIQUE_CACHE_MAX_SIZE = 1000;

function keyFor(array: readonly unknown[]): string {
  return array.map((v) => `${typeof v}:${JSON.stringify(v)}`).join("|");
}

function manageCacheSize() {
  if (uniqueStateByKey.size > UNIQUE_CACHE_MAX_SIZE) {
    // Remove oldest entries (simple FIFO cleanup)
    const keysToDelete = [...uniqueStateByKey.keys()].slice(0, UNIQUE_CACHE_MAX_SIZE / 2);
    for (const key of keysToDelete) {
      uniqueStateByKey.delete(key);
    }
  }
}

sproutFn.unique = function unique<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error("unique() called with an empty array");
  }

  const key = keyFor(array);
  let state = uniqueStateByKey.get(key) as State<T> | undefined;

  if (!state) {
    const pool = [...array];

    for (let index = pool.length - 1; index > 0; index--) {
      const index_ = Math.floor(rng() * (index + 1));
      const a = pool[index];
      const b = pool[index_];

      if (a === undefined || b === undefined) {
        throw new Error("internal swap OOB");
      }

      pool[index] = b;
      pool[index_] = a;
    }

    state = { pool, index: 0 };

    // Manage cache size to prevent memory leaks
    manageCacheSize();
    uniqueStateByKey.set(key, state as State<unknown>);
  }

  if (state.index >= state.pool.length) {
    throw new Error("unique() exhausted all available items");
  }

  const value = state.pool[state.index];

  if (value === undefined) {
    throw new Error("internal OOB");
  }

  state.index += 1;
  return value;
};

Object.assign(sproutFn, domains);

export const sprout = sproutFn;
