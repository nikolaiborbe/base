import type { Strategy } from "./types";
import { runRoundRobin } from "./tournament";

export interface StrategyVariance {
  name: string;
  /** Mean total score across all runs */
  meanScore: number;
  /** Population standard deviation of total score */
  stdScore: number;
  minScore: number;
  maxScore: number;
  /** Mean finish rank (1 = first place) */
  meanRank: number;
  /** Std dev of rank */
  stdRank: number;
  /** Mean cooperation rate */
  meanCoopRate: number;
}

export interface MultiRunResult {
  stats: StrategyVariance[];
  /** n independent tournament runs */
  n: number;
  rounds: number;
  /** Seeds used: baseSeed, baseSeed+1, …, baseSeed+n-1 */
  baseSeed: number;
  noise: number;
}

/**
 * Run the same tournament n times with consecutive seeds and aggregate variance.
 *
 * Each run uses seed = baseSeed + i, so the full experiment is reproducible
 * from just (n, baseSeed).
 *
 * @param strategies  Strategies to include.
 * @param rounds      Rounds per match.
 * @param n           Number of independent runs.
 * @param baseSeed    First seed (default 0). Runs use baseSeed … baseSeed+n-1.
 */
export function runMany(
  strategies: Strategy[],
  rounds: number,
  n: number,
  baseSeed = 0,
  noise = 0,
): MultiRunResult {
  // Per-strategy accumulators
  const scores:    Map<string, number[]> = new Map();
  const ranks:     Map<string, number[]> = new Map();
  const coopRates: Map<string, number[]> = new Map();

  for (const s of strategies) {
    scores.set(s.name, []);
    ranks.set(s.name, []);
    coopRates.set(s.name, []);
  }

  for (let i = 0; i < n; i++) {
    const result = runRoundRobin(strategies, rounds, baseSeed + i, noise);
    for (let r = 0; r < result.entries.length; r++) {
      const e = result.entries[r];
      scores.get(e.name)!.push(e.totalScore);
      ranks.get(e.name)!.push(r + 1);               // rank is 1-indexed
      coopRates.get(e.name)!.push(e.coopRate);
    }
  }

  const stats: StrategyVariance[] = strategies.map((s) => {
    const sc = scores.get(s.name)!;
    const rk = ranks.get(s.name)!;
    const cr = coopRates.get(s.name)!;
    return {
      name:         s.name,
      meanScore:    mean(sc),
      stdScore:     std(sc),
      minScore:     Math.min(...sc),
      maxScore:     Math.max(...sc),
      meanRank:     mean(rk),
      stdRank:      std(rk),
      meanCoopRate: mean(cr),
    };
  });

  // Sort by mean score descending (same convention as runRoundRobin)
  stats.sort((a, b) => b.meanScore - a.meanScore);

  return { stats, n, rounds, baseSeed, noise };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function std(xs: number[]): number {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / xs.length);
}
