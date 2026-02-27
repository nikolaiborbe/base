import type { Strategy, Move, GameHistory } from "../engine/types";

type RNG = () => number;

// ─── Classic strategies ─────────────────────────────────────────────────────

export const allCooperate: Strategy = {
  name: "Always Cooperate",
  description: "Cooperates every round regardless of opponent behavior.",
  move: () => "C",
};

export const allDefect: Strategy = {
  name: "Always Defect",
  description: "Defects every round regardless of opponent behavior.",
  move: () => "D",
};

export const random: Strategy = {
  name: "Random",
  description: "Cooperates or defects with equal probability each round.",
  move: (_h: GameHistory, rng: RNG) => (rng() < 0.5 ? "C" : "D"),
};

export const titForTat: Strategy = {
  name: "Tit for Tat",
  description:
    "Cooperates on the first move, then copies the opponent's last move. Simple, nice, provocable, forgiving.",
  move: ({ opponent }) =>
    opponent.length === 0 ? "C" : opponent[opponent.length - 1],
};

export const titForTwoTats: Strategy = {
  name: "Tit for Two Tats",
  description:
    "Cooperates unless the opponent defected on both of the last two rounds. More forgiving than TFT.",
  move: ({ opponent }) => {
    if (opponent.length < 2) return "C";
    return opponent[opponent.length - 1] === "D" &&
      opponent[opponent.length - 2] === "D"
      ? "D"
      : "C";
  },
};

export const grudger: Strategy = {
  name: "Grudger",
  description:
    "Cooperates until the opponent defects once, then defects forever. Never forgives.",
  move: ({ opponent }) => (opponent.includes("D") ? "D" : "C"),
};

export const pavlov: Strategy = {
  name: "Pavlov",
  description:
    "Win-Stay, Lose-Shift. Repeats last move if it scored ≥3, switches otherwise.",
  move: ({ mine, opponent }) => {
    if (mine.length === 0) return "C";
    const lastMine = mine[mine.length - 1];
    const lastOpponent = opponent[opponent.length - 1];
    // Reward (CC=3) and Temptation (DC=5) are wins; Sucker (CD=0) and Punishment (DD=1) are losses
    const won =
      (lastMine === "C" && lastOpponent === "C") ||
      (lastMine === "D" && lastOpponent === "C");
    return won ? lastMine : lastMine === "C" ? "D" : "C";
  },
};

export const suspiciousTFT: Strategy = {
  name: "Suspicious TFT",
  description:
    "Like Tit for Tat but opens with Defect. Can trigger conflict spirals against TFT.",
  move: ({ opponent }) =>
    opponent.length === 0 ? "D" : opponent[opponent.length - 1],
};

export const generousTFT: Strategy = {
  name: "Generous TFT",
  description:
    "Like TFT but forgives a defection with ~33% probability. Resistant to noise.",
  move: ({ opponent }, rng: RNG) => {
    if (opponent.length === 0) return "C";
    if (opponent[opponent.length - 1] === "D") {
      return rng() < 0.33 ? "C" : "D";
    }
    return "C";
  },
};

// ─── Zero-Determinant strategies (Press & Dyson 2012) ───────────────────────

/**
 * A ZD extortioner with χ=3 (extortion factor) and φ=1/6.
 * Enforces: score(self) - P = χ * (score(opponent) - P)
 * where P=1 is the mutual defection payoff.
 * p = [p1, p2, p3, p4] are cooperation probabilities given (CC, CD, DC, DD).
 */
function makeZDExtorter(chi: number): Strategy {
  // For χ=3, numeric values: p(CC)=8/9, p(CD)=0, p(DC)=1, p(DD)=1/9
  const probs = { CC: 8 / 9, CD: 0, DC: 1, DD: 1 / 9 };

  return {
    name: `ZD Extorter (χ=${chi})`,
    description: `Zero-Determinant extortion strategy (Press & Dyson 2012). Unilaterally enforces that its score exceeds the opponent's by factor χ=${chi} above mutual defection.`,
    move: ({ mine, opponent }, rng: RNG): Move => {
      if (mine.length === 0) return "C";
      const lastMine = mine[mine.length - 1];
      const lastOpponent = opponent[opponent.length - 1];
      let p: number;
      if (lastMine === "C" && lastOpponent === "C") p = probs.CC;
      else if (lastMine === "C" && lastOpponent === "D") p = probs.CD;
      else if (lastMine === "D" && lastOpponent === "C") p = probs.DC;
      else p = probs.DD;
      return rng() < p ? "C" : "D";
    },
  };
}

export const zdExtorter = makeZDExtorter(3);

// ─── Registry ────────────────────────────────────────────────────────────────

export const allStrategies: Strategy[] = [
  titForTat,
  titForTwoTats,
  grudger,
  pavlov,
  generousTFT,
  allCooperate,
  allDefect,
  suspiciousTFT,
  zdExtorter,
  random,
];
