export type Move = "C" | "D";

export interface GameHistory {
  mine: Move[];
  opponent: Move[];
}

export interface Strategy {
  name: string;
  description: string;
  move(history: GameHistory): Move;
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
}
