/**
 * CLI analysis runner — run with:  npm run analyze
 *
 * Edit this file to set up the experiment you want to run.
 * Results print to stdout; redirect to a file if you want to save them:
 *   npm run analyze > notes/run-001.txt
 *
 * Because this uses the same engine as the website, results here are identical
 * to what will appear in devlog posts (given the same seed).
 */

import { runRoundRobin } from "../engine/tournament.js";
import { allStrategies } from "../strategies/index.js";

// ─── Experiment config ────────────────────────────────────────────────────────

const ROUNDS = 200;
const SEED   = 42;   // Change this to explore variance, or set to undefined for random

// ─── Run ──────────────────────────────────────────────────────────────────────

console.log(`\n═══ Round-Robin Tournament ═══`);
console.log(`Strategies : ${allStrategies.length}`);
console.log(`Rounds/match: ${ROUNDS}`);
console.log(`Seed       : ${SEED ?? "none (Math.random)"}\n`);

const result = runRoundRobin(allStrategies, ROUNDS, SEED);

// ─── Leaderboard ──────────────────────────────────────────────────────────────

const col = (s: string, w: number) => s.slice(0, w).padEnd(w);
const rCol = (s: string, w: number) => s.slice(0, w).padStart(w);

console.log(
  col("#", 3) +
  col("Strategy", 28) +
  rCol("Score", 8) +
  rCol("Avg/Rd", 8) +
  rCol("Coop%", 7) +
  rCol("W", 5) +
  rCol("D", 4) +
  rCol("L", 4),
);
console.log("─".repeat(67));

for (let i = 0; i < result.entries.length; i++) {
  const e = result.entries[i];
  console.log(
    col(String(i + 1), 3) +
    col(e.name, 28) +
    rCol(String(e.totalScore), 8) +
    rCol(e.avgPerRound.toFixed(3), 8) +
    rCol((e.coopRate * 100).toFixed(1) + "%", 7) +
    rCol(String(e.wins), 5) +
    rCol(String(e.draws), 4) +
    rCol(String(e.losses), 4),
  );
}

// ─── Head-to-head spotlight ───────────────────────────────────────────────────

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

console.log();
