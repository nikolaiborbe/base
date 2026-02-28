export type Move = "C" | "D";

export interface GameHistory {
  mine: Move[];
  opponent: Move[];
}

export interface Strategy {
  name: string;
  description: string;
  /**
   * Decide the next move.
   * @param history  This strategy's move history vs the opponent's.
   * @param rng      Seeded PRNG supplied by the game runner — use this instead
   *                 of Math.random() so results are reproducible.
   */
  move(history: GameHistory, rng: () => number): Move;
}

export interface RoundResult {
  moveA: Move;
  moveB: Move;
  scoreA: number;
  scoreB: number;
}

export interface GameResult {
  strategyA: string;
  strategyB: string;
  rounds: RoundResult[];
  totalA: number;
  totalB: number;
  coopRateA: number;
  coopRateB: number;
}

export interface MatchRecord {
  opponent: string;
  score: number;
  coopRate: number;
}

export interface TournamentEntry {
  name: string;
  totalScore: number;
  avgPerRound: number;
  coopRate: number;
  wins: number;
  losses: number;
  draws: number;
  matches: MatchRecord[];
}

export interface TournamentResult {
  entries: TournamentEntry[];
  roundsPerMatch: number;
  strategyCount: number;
  /** Probability that any move is randomly flipped before the opponent observes it. */
  noise: number;
}
