/**
 * CLI analysis runner — npm run analyze
 *
 * Set MODE below and run: npm run analyze
 * Redirect output to save: npm run analyze > notes/run-001.txt
 */

import { runRoundRobin } from "../engine/tournament.js";
import { runMany } from "../engine/stats.js";
import { runEvolution } from "../engine/evolution.js";
import { allStrategies } from "../strategies/index.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const MODE: "single" | "variance" | "evolution" | "noise-sweep" = "noise-sweep";

const ROUNDS      = 200;
const SEED        = 42;
const RUNS        = 100;
const BASE_SEED   = 0;
const GENERATIONS = 200;

// ─── Formatting helpers ───────────────────────────────────────────────────────

const L = (s: string, w: number) => s.slice(0, w).padEnd(w);
const R = (s: string, w: number) => s.slice(0, w).padStart(w);
const pct = (n: number) => (n * 100).toFixed(2) + "%";

// ─── Single run ───────────────────────────────────────────────────────────────

if (MODE === "single") {
  console.log(`\n═══ Single Tournament (seed=${SEED}, rounds=${ROUNDS}) ═══\n`);
  const result = runRoundRobin(allStrategies, ROUNDS, SEED);

  console.log(L("#", 3) + L("Strategy", 28) + R("Score", 8) + R("Avg/Rd", 8) + R("Coop%", 7) + R("W", 5) + R("D", 4) + R("L", 4));
  console.log("─".repeat(67));

  for (let i = 0; i < result.entries.length; i++) {
    const e = result.entries[i];
    console.log(
      L(String(i + 1), 3) +
      L(e.name, 28) +
      R(String(e.totalScore), 8) +
      R(e.avgPerRound.toFixed(3), 8) +
      R((e.coopRate * 100).toFixed(1) + "%", 7) +
      R(String(e.wins), 5) +
      R(String(e.draws), 4) +
      R(String(e.losses), 4),
    );
  }

  console.log("\n─── Head-to-head spotlight ───");
  for (const entry of result.entries) {
    const sorted = [...entry.matches].sort((a, b) => b.score - a.score);
    const best  = sorted[0];
    const worst = sorted[sorted.length - 1];
    if (!best || !worst) continue;
    console.log(
      `${entry.name.padEnd(24)} best: ${best.opponent.padEnd(24)} (${best.score})  ` +
      `worst: ${worst.opponent.padEnd(24)} (${worst.score})`,
    );
  }
}

// ─── Variance analysis ────────────────────────────────────────────────────────

if (MODE === "variance") {
  console.log(`\n═══ Variance Analysis (${RUNS} runs, seeds ${BASE_SEED}–${BASE_SEED + RUNS - 1}, ${ROUNDS} rounds/match) ═══\n`);
  const result = runMany(allStrategies, ROUNDS, RUNS, BASE_SEED);

  console.log(
    L("#", 3) + L("Strategy", 28) +
    R("Mean", 8) + R("±Std", 7) + R("Min", 7) + R("Max", 7) + R("Range", 7) +
    R("MeanRk", 8) + R("±Rk", 6),
  );
  console.log("─".repeat(81));

  for (let i = 0; i < result.stats.length; i++) {
    const s = result.stats[i];
    console.log(
      L(String(i + 1), 3) +
      L(s.name, 28) +
      R(s.meanScore.toFixed(1), 8) +
      R(s.stdScore.toFixed(1), 7) +
      R(String(s.minScore), 7) +
      R(String(s.maxScore), 7) +
      R(String(s.maxScore - s.minScore), 7) +
      R(s.meanRank.toFixed(2), 8) +
      R(s.stdRank.toFixed(2), 6),
    );
  }

  console.log(`\nCoefficient of Variation (std/mean × 100) — higher = more variance:\n`);
  const sorted = [...result.stats].sort((a, b) => (b.stdScore / b.meanScore) - (a.stdScore / a.meanScore));
  for (const s of sorted) {
    const cv = (s.stdScore / s.meanScore * 100).toFixed(2);
    const bar = "█".repeat(Math.round(s.stdScore / s.meanScore * 400));
    console.log(`  ${s.name.padEnd(26)} CV=${cv}%  ${bar}`);
  }
}

// ─── Evolutionary dynamics ────────────────────────────────────────────────────

if (MODE === "evolution") {
  console.log(`\n═══ Replicator Dynamics (${GENERATIONS} generations, seed=${SEED}, ${ROUNDS} rds/match) ═══\n`);
  const result = runEvolution(allStrategies, ROUNDS, GENERATIONS, SEED);

  const checkpoints = [0, 1, 5, 10, 25, 50, 100, 200].filter(g => g <= GENERATIONS);
  console.log(L("Strategy", 28) + checkpoints.map(g => R(`G${g}`, 8)).join(""));
  console.log("─".repeat(28 + checkpoints.length * 8));

  for (let i = 0; i < result.strategies.length; i++) {
    const name = result.strategies[i];
    const row = L(name, 28) + checkpoints.map(g => {
      const snap = result.history[g];
      return R((snap.shares[i] * 100).toFixed(1) + "%", 8);
    }).join("");
    console.log(row);
  }

  console.log("\nFinal shares (sorted):");
  const final = result.strategies
    .map((name, i) => ({ name, share: result.finalShares[i] }))
    .sort((a, b) => b.share - a.share);
  for (const { name, share } of final) {
    const bar = "█".repeat(Math.round(share * 80));
    console.log(`  ${name.padEnd(26)} ${pct(share).padStart(7)}  ${bar}`);
  }
}

// ─── Noise sweep ──────────────────────────────────────────────────────────────

if (MODE === "noise-sweep") {
  const NOISE_LEVELS = [0, 0.01, 0.02, 0.05, 0.10, 0.15];
  const SWEEP_RUNS   = 100;
  const SWEEP_ROUNDS = 200;

  console.log(`\n═══ Noise Sweep (ε ∈ {${NOISE_LEVELS.join(", ")}}, ${SWEEP_RUNS} runs each, ${SWEEP_ROUNDS} rds/match) ═══\n`);

  // Collect mean scores per strategy per noise level
  const results = NOISE_LEVELS.map(ε => runMany(allStrategies, SWEEP_ROUNDS, SWEEP_RUNS, 0, ε));

  // Print mean-score table
  const header = L("Strategy", 26) + NOISE_LEVELS.map(ε => R(`ε=${ε}`, 9)).join("");
  console.log(header);
  console.log("─".repeat(26 + NOISE_LEVELS.length * 9));

  // Print in order of ε=0 ranking
  const baseOrder = results[0].stats.map(s => s.name);
  for (const name of baseOrder) {
    const row = L(name, 26) + results.map(r => {
      const s = r.stats.find(s => s.name === name)!;
      return R(s.meanScore.toFixed(0), 9);
    }).join("");
    console.log(row);
  }

  // Print rank table
  console.log(`\nRanks (mean rank across ${SWEEP_RUNS} seeds):\n`);
  console.log(L("Strategy", 26) + NOISE_LEVELS.map(ε => R(`ε=${ε}`, 9)).join(""));
  console.log("─".repeat(26 + NOISE_LEVELS.length * 9));
  for (const name of baseOrder) {
    const row = L(name, 26) + results.map(r => {
      const s = r.stats.find(s => s.name === name)!;
      return R(s.meanRank.toFixed(2), 9);
    }).join("");
    console.log(row);
  }

  // Find crossover points
  console.log("\nCrossover detection (TFT vs Generous TFT mean rank):");
  for (const r of results) {
    const tft  = r.stats.find(s => s.name === "Tit for Tat")!;
    const gtft = r.stats.find(s => s.name === "Generous TFT")!;
    const grudger = r.stats.find(s => s.name === "Grudger")!;
    console.log(`  ε=${String(r.noise).padEnd(4)}  TFT rank=${tft.meanRank.toFixed(2)}  GenTFT rank=${gtft.meanRank.toFixed(2)}  Grudger rank=${grudger.meanRank.toFixed(2)}  Grudger score=${grudger.meanScore.toFixed(0)}`);
  }
}

console.log();
