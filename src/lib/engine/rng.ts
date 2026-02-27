/** A function that returns the next pseudo-random number in [0, 1). */
export type RNG = () => number;

/**
 * mulberry32 — fast, good-quality 32-bit seeded PRNG.
 * Same seed → identical sequence every time.
 */
export function mulberry32(seed: number): RNG {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/** Drop-in for non-seeded / interactive contexts. */
export const defaultRng: RNG = () => Math.random();
