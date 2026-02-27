import type { Strategy, GameResult, Move } from "./types";
import { defaultRng, type RNG } from "./rng";

// Standard IPD payoff matrix: [scoreA, scoreB]
// R=3 (mutual coop), T=5 (temptation), S=0 (sucker), P=1 (mutual defect)
const PAYOFF: Record<Move, Record<Move, [number, number]>> = {
  C: { C: [3, 3], D: [0, 5] },
  D: { C: [5, 0], D: [1, 1] },
};

export function playGame(
  stratA: Strategy,
  stratB: Strategy,
  rounds: number,
  rng: RNG = defaultRng,
): GameResult {
  const histA: Move[] = [];
  const histB: Move[] = [];
  let totalA = 0;
  let totalB = 0;
  const roundResults = [];

  for (let i = 0; i < rounds; i++) {
    const moveA = stratA.move({ mine: [...histA], opponent: [...histB] }, rng);
    const moveB = stratB.move({ mine: [...histB], opponent: [...histA] }, rng);
    const [scoreA, scoreB] = PAYOFF[moveA][moveB];

    histA.push(moveA);
    histB.push(moveB);
    totalA += scoreA;
    totalB += scoreB;
    roundResults.push({ moveA, moveB, scoreA, scoreB });
  }

  const coopRateA = histA.filter((m) => m === "C").length / rounds;
  const coopRateB = histB.filter((m) => m === "C").length / rounds;

  return {
    strategyA: stratA.name,
    strategyB: stratB.name,
    rounds: roundResults,
    totalA,
    totalB,
    coopRateA,
    coopRateB,
  };
}
