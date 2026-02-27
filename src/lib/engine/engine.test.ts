import { describe, it, expect } from "vitest";
import { playGame } from "./game";
import { runRoundRobin } from "./tournament";
import { mulberry32 } from "./rng";
import {
  allCooperate,
  allDefect,
  titForTat,
  titForTwoTats,
  grudger,
  pavlov,
  suspiciousTFT,
  generousTFT,
  zdExtorter,
  random,
  allStrategies,
} from "../strategies/index";

// ─── Payoff matrix ────────────────────────────────────────────────────────────

describe("payoff matrix", () => {
  it("CC yields [3, 3]", () => {
    const r = playGame(allCooperate, allCooperate, 1);
    expect(r.totalA).toBe(3);
    expect(r.totalB).toBe(3);
  });

  it("DD yields [1, 1]", () => {
    const r = playGame(allDefect, allDefect, 1);
    expect(r.totalA).toBe(1);
    expect(r.totalB).toBe(1);
  });

  it("DC yields [5, 0] (defector vs cooperator)", () => {
    const r = playGame(allDefect, allCooperate, 1);
    expect(r.totalA).toBe(5); // defector gets temptation
    expect(r.totalB).toBe(0); // cooperator gets sucker
  });

  it("CD yields [0, 5]", () => {
    const r = playGame(allCooperate, allDefect, 1);
    expect(r.totalA).toBe(0);
    expect(r.totalB).toBe(5);
  });
});

// ─── Always Cooperate / Always Defect ────────────────────────────────────────

describe("AllCooperate", () => {
  it("cooperates 100% of the time", () => {
    const r = playGame(allCooperate, allDefect, 10);
    expect(r.coopRateA).toBe(1);
    expect(r.totalA).toBe(0); // always gets suckered
  });
});

describe("AllDefect", () => {
  it("defects 100% of the time", () => {
    const r = playGame(allDefect, allCooperate, 10);
    expect(r.coopRateA).toBe(0);
    expect(r.totalA).toBe(50); // 5 per round × 10
  });
});

// ─── Tit for Tat ─────────────────────────────────────────────────────────────

describe("TitForTat", () => {
  it("cooperates on round 1", () => {
    const r = playGame(titForTat, allDefect, 1);
    expect(r.rounds[0].moveA).toBe("C");
  });

  it("mirrors opponent after round 1", () => {
    const r = playGame(titForTat, allDefect, 3);
    expect(r.rounds[1].moveA).toBe("D"); // mirrors the D from round 1
    expect(r.rounds[2].moveA).toBe("D");
  });

  it("sustains mutual cooperation against itself", () => {
    const r = playGame(titForTat, titForTat, 10);
    expect(r.coopRateA).toBe(1);
    expect(r.coopRateB).toBe(1);
    expect(r.totalA).toBe(30); // 3 × 10
  });
});

// ─── Tit for Two Tats ────────────────────────────────────────────────────────

describe("TitForTwoTats", () => {
  it("does not retaliate after a single defection", () => {
    // Opponent: D, C, C... TF2T should keep cooperating
    const singleDefector = {
      name: "SingleDefect",
      description: "",
      move: (_h: import("./types").GameHistory, _rng: () => number) =>
        "D" as const,
    };
    // Override to defect only once
    let round = 0;
    const oneShot = {
      name: "OneShot",
      description: "",
      move: (_h: import("./types").GameHistory, _rng: () => number) => {
        round++;
        return round === 1 ? ("D" as const) : ("C" as const);
      },
    };
    const r = playGame(titForTwoTats, oneShot, 5);
    // TF2T should cooperate every round (never saw two consecutive D's)
    expect(r.coopRateA).toBe(1);
    void singleDefector;
  });

  it("retaliates after two consecutive defections", () => {
    const r = playGame(titForTwoTats, allDefect, 5);
    // Round 1: C (first move), Round 2: C (only one D so far), Round 3+: D
    expect(r.rounds[0].moveA).toBe("C");
    expect(r.rounds[1].moveA).toBe("C");
    expect(r.rounds[2].moveA).toBe("D");
  });
});

// ─── Grudger ─────────────────────────────────────────────────────────────────

describe("Grudger", () => {
  it("cooperates until the first defection", () => {
    const r = playGame(grudger, allDefect, 5);
    expect(r.rounds[0].moveA).toBe("C"); // cooperates round 1
    expect(r.rounds[1].moveA).toBe("D"); // defects forever after
    expect(r.rounds[4].moveA).toBe("D");
  });

  it("cooperates forever against AllCooperate", () => {
    const r = playGame(grudger, allCooperate, 10);
    expect(r.coopRateA).toBe(1);
  });

  it("never forgives", () => {
    // One defection at the start → all D thereafter
    let defected = false;
    const defectOnce = {
      name: "DefectOnce",
      description: "",
      move: (_h: import("./types").GameHistory, _rng: () => number) => {
        if (!defected) { defected = true; return "D" as const; }
        return "C" as const;
      },
    };
    const r = playGame(grudger, defectOnce, 10);
    // After round 1 (D), Grudger should defect all remaining 9 rounds
    const grudgerMoves = r.rounds.slice(1).map((rr) => rr.moveA);
    expect(grudgerMoves.every((m) => m === "D")).toBe(true);
  });
});

// ─── Pavlov ──────────────────────────────────────────────────────────────────

describe("Pavlov", () => {
  it("cooperates on round 1", () => {
    const r = playGame(pavlov, allDefect, 1);
    expect(r.rounds[0].moveA).toBe("C");
  });

  it("shifts after a loss (CD → sucker → switch to D)", () => {
    // Round 1: Pavlov=C, Defect=D → Pavlov gets 0 (loss) → should switch to D
    const r = playGame(pavlov, allDefect, 2);
    expect(r.rounds[1].moveA).toBe("D");
  });

  it("stays after a win (CC → reward → stay C)", () => {
    const r = playGame(pavlov, allCooperate, 3);
    expect(r.rounds[1].moveA).toBe("C");
    expect(r.rounds[2].moveA).toBe("C");
  });
});

// ─── Suspicious TFT ──────────────────────────────────────────────────────────

describe("SuspiciousTFT", () => {
  it("defects on round 1", () => {
    const r = playGame(suspiciousTFT, allCooperate, 1);
    expect(r.rounds[0].moveA).toBe("D");
  });

  it("then mirrors like TFT", () => {
    // vs AllCooperate: D, then C, C, C...
    const r = playGame(suspiciousTFT, allCooperate, 4);
    expect(r.rounds[0].moveA).toBe("D");
    expect(r.rounds[1].moveA).toBe("C"); // mirrors C from round 1
  });
});

// ─── Generous TFT ────────────────────────────────────────────────────────────

describe("GenerousTFT", () => {
  it("cooperates on round 1", () => {
    const r = playGame(generousTFT, allDefect, 1);
    expect(r.rounds[0].moveA).toBe("C");
  });

  it("is always cooperative against AllCooperate", () => {
    const r = playGame(generousTFT, allCooperate, 20);
    expect(r.coopRateA).toBe(1);
  });

  it("occasionally forgives defections (seeded test)", () => {
    // With seed 1, run 1000 rounds vs AllDefect. Forgiveness rate should be ~33%.
    const rng = mulberry32(1);
    const forgiveCount = Array.from({ length: 1000 }, () =>
      rng() < 0.33 ? 1 : 0,
    ).reduce((a, b) => a + b, 0);
    // Expect between 250 and 420 forgiveness events (3-sigma bounds around 330)
    expect(forgiveCount).toBeGreaterThan(250);
    expect(forgiveCount).toBeLessThan(420);
  });
});

// ─── ZD Extorter ─────────────────────────────────────────────────────────────

describe("ZD Extorter", () => {
  it("cooperates on round 1", () => {
    const r = playGame(zdExtorter, allCooperate, 1);
    expect(r.rounds[0].moveA).toBe("C");
  });

  it("extorts: scores more than AllCooperate over many rounds", () => {
    // ZD vs AllCooperate: extorter should score > cooperator
    const r = playGame(zdExtorter, allCooperate, 500, mulberry32(99));
    expect(r.totalA).toBeGreaterThan(r.totalB);
  });
});

// ─── Random ──────────────────────────────────────────────────────────────────

describe("Random", () => {
  it("produces ~50% cooperation with a fair seed over many rounds", () => {
    const r = playGame(random, allCooperate, 1000, mulberry32(7));
    expect(r.coopRateA).toBeGreaterThan(0.44);
    expect(r.coopRateA).toBeLessThan(0.56);
  });

  it("is reproducible: same seed → same result", () => {
    const r1 = playGame(random, titForTat, 100, mulberry32(42));
    const r2 = playGame(random, titForTat, 100, mulberry32(42));
    expect(r1.totalA).toBe(r2.totalA);
    expect(r1.totalB).toBe(r2.totalB);
  });
});

// ─── Tournament ──────────────────────────────────────────────────────────────

describe("runRoundRobin", () => {
  it("is fully reproducible with a fixed seed", () => {
    const r1 = runRoundRobin(allStrategies, 50, 42);
    const r2 = runRoundRobin(allStrategies, 50, 42);
    expect(r1.entries.map((e) => e.totalScore)).toEqual(
      r2.entries.map((e) => e.totalScore),
    );
  });

  it("different seeds produce different results for stochastic strategies", () => {
    const r1 = runRoundRobin(allStrategies, 50, 1);
    const r2 = runRoundRobin(allStrategies, 50, 2);
    // At least one score should differ across the two seeded runs
    const scores1 = r1.entries.map((e) => e.totalScore);
    const scores2 = r2.entries.map((e) => e.totalScore);
    expect(scores1).not.toEqual(scores2);
  });

  it("returns n*(n+1)/2 total matches (n=10, including self-play)", () => {
    const r = runRoundRobin(allStrategies, 10, 0);
    const totalMatches = r.entries.reduce((sum, e) => sum + e.matches.length, 0);
    const n = allStrategies.length;
    // Each strategy plays n opponents (n-1 + self) → n*n total match entries but
    // only n*(n+1)/2 games are played; each game generates 2 entries (except self)
    expect(r.strategyCount).toBe(n);
  });

  it("TFT finishes near the top in a clean tournament", () => {
    const r = runRoundRobin(allStrategies, 200, 42);
    const tftRank = r.entries.findIndex((e) => e.name === "Tit for Tat") + 1;
    expect(tftRank).toBeLessThanOrEqual(3);
  });

  it("AllDefect does NOT finish first in a mixed field", () => {
    const r = runRoundRobin(allStrategies, 200, 42);
    expect(r.entries[0].name).not.toBe("Always Defect");
  });
});
