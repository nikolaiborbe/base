import type { Strategy, TournamentResult, TournamentEntry } from "./types";
import { playGame } from "./game";
import { mulberry32, defaultRng } from "./rng";

/**
 * Round-robin tournament: every pair plays once (including self-play).
 * @param seed  Optional integer seed. Pin a value in devlog posts so results
 *              are identical across site rebuilds.
 */
export function runRoundRobin(
  strategies: Strategy[],
  rounds: number,
  seed?: number,
): TournamentResult {
  const rng = seed !== undefined ? mulberry32(seed) : defaultRng;
  const entryMap = new Map<string, TournamentEntry>();

  for (const s of strategies) {
    entryMap.set(s.name, {
      name: s.name,
      totalScore: 0,
      avgPerRound: 0,
      coopRate: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      matches: [],
    });
  }

  for (let i = 0; i < strategies.length; i++) {
    for (let j = i; j < strategies.length; j++) {
      const a = strategies[i];
      const b = strategies[j];
      const result = playGame(a, b, rounds, rng);

      const ea = entryMap.get(a.name)!;
      const eb = entryMap.get(b.name)!;

      ea.totalScore += result.totalA;
      ea.coopRate += result.coopRateA;
      ea.matches.push({
        opponent: b.name,
        score: result.totalA,
        coopRate: result.coopRateA,
      });

      if (i !== j) {
        eb.totalScore += result.totalB;
        eb.coopRate += result.coopRateB;
        eb.matches.push({
          opponent: a.name,
          score: result.totalB,
          coopRate: result.coopRateB,
        });

        if (result.totalA > result.totalB) {
          ea.wins++;
          eb.losses++;
        } else if (result.totalB > result.totalA) {
          eb.wins++;
          ea.losses++;
        } else {
          ea.draws++;
          eb.draws++;
        }
      }
    }
  }

  const entries = [...entryMap.values()];
  for (const e of entries) {
    const n = e.matches.length;
    e.avgPerRound = n > 0 ? e.totalScore / (n * rounds) : 0;
    e.coopRate = n > 0 ? e.coopRate / n : 0;
  }

  entries.sort((a, b) => b.totalScore - a.totalScore);

  return {
    entries,
    roundsPerMatch: rounds,
    strategyCount: strategies.length,
  };
}
