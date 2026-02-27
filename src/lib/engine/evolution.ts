import type { Strategy } from "./types";
import { runRoundRobin } from "./tournament";

export interface GenerationSnapshot {
  /** Generation index (0 = initial equal distribution) */
  generation: number;
  /** Population share for each strategy, in the same order as the input strategies array */
  shares: number[];
}

export interface EvolutionResult {
  strategies: string[];
  /** Snapshot at every generation including gen 0 */
  history: GenerationSnapshot[];
  /** Final population shares after `generations` rounds of selection */
  finalShares: number[];
  rounds: number;
  generations: number;
  seed: number;
}

/**
 * Simulate replicator dynamics on a mixed population of IPD strategies.
 *
 * **Model:**
 * Each generation, strategies play a round-robin tournament weighted by their
 * current population shares: a strategy's *fitness* is the average score per round
 * it earns against opponents sampled proportionally from the current population.
 * Population shares are then updated proportionally to relative fitness (discrete
 * replicator equation). Strategies that score above the population mean grow;
 * those below shrink.
 *
 * **Implementation note:**
 * Rather than sampling opponents probabilistically (which would require many
 * simulation runs to average), we compute the expected payoff directly:
 *   fitness(i) = Σ_j  share(j) × avgPerRound(i vs j)
 * This is the deterministic mean-field approximation of the stochastic process,
 * standard in theoretical evolutionary game theory.
 *
 * @param strategies   Strategy pool.
 * @param rounds       Rounds per match (used once to build the payoff matrix).
 * @param generations  Number of selection steps.
 * @param seed         Seed for the payoff-matrix tournament.
 */
export function runEvolution(
  strategies: Strategy[],
  rounds: number,
  generations: number,
  seed: number,
): EvolutionResult {
  const n = strategies.length;

  // ── Step 1: Build pairwise payoff matrix once ──────────────────────────────
  // avgPayoff[i][j] = average score per round that strategy i earns against j.
  // We run a full round-robin; all pairwise game results are available.
  const tournament = runRoundRobin(strategies, rounds, seed);

  // Build a lookup: strategyName → row index
  const idx = new Map<string, number>(strategies.map((s, i) => [s.name, i]));

  // avgPayoff[i][j]: average score per round that strategy[i] earns against strategy[j]
  const avgPayoff: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (const entry of tournament.entries) {
    const i = idx.get(entry.name)!;
    for (const match of entry.matches) {
      const j = idx.get(match.opponent)!;
      avgPayoff[i][j] = match.score / rounds;
    }
  }

  // ── Step 2: Replicator dynamics ────────────────────────────────────────────
  // Start with equal shares
  let shares = new Array<number>(n).fill(1 / n);

  const history: GenerationSnapshot[] = [
    { generation: 0, shares: [...shares] },
  ];

  for (let g = 1; g <= generations; g++) {
    // Fitness of strategy i = expected score per round against current population
    const fitness = shares.map((_, i) =>
      shares.reduce((sum, shareJ, j) => sum + shareJ * avgPayoff[i][j], 0),
    );

    // Mean population fitness
    const meanFitness = shares.reduce((sum, s, i) => sum + s * fitness[i], 0);

    // Replicator equation: new share ∝ old share × fitness
    const newShares = shares.map((s, i) =>
      meanFitness > 0 ? (s * fitness[i]) / meanFitness : s,
    );

    // Normalise to correct floating-point drift
    const total = newShares.reduce((a, b) => a + b, 0);
    shares = newShares.map((s) => s / total);

    history.push({ generation: g, shares: [...shares] });
  }

  return {
    strategies: strategies.map((s) => s.name),
    history,
    finalShares: shares,
    rounds,
    generations,
    seed,
  };
}
