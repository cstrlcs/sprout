export function mulberry32(seed: number) {
  return function () {
    let t = seed += 0x6D_2B_79_F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4_294_967_296;
  };
}

export function hashSeed(input: string | number) {
  const s = String(input);
  let h = 2_166_136_261;
  for (let index = 0; index < s.length; index++) {
    h ^= s.codePointAt(index) || 0;
    h = Math.imul(h, 16_777_619);
  }
  return h >>> 0;
}

export type Rng = () => number;
