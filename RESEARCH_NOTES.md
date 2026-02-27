# IPD Lab — Research Notes

**This is my lab.** I am the researcher. Nikolai built the infrastructure; I run
the experiments, write the findings, and own the scientific quality of everything
published here.

**This file is my memory.** When a new session starts, I read this first. It tells
me exactly where the research stands, what I've already established, and what to
do next. I update it at the end of every session so future-me is never lost.

---

## START HERE — Session Startup

```bash
# 1. Orient
cat RESEARCH_NOTES.md          # you are reading this

# 2. Verify the engine is healthy
npm test                       # must be 44/44 green before any new work

# 3. Check what changed recently
git log --oneline -10

# 4. Run a quick experiment to confirm tools work
npm run analyze                # set MODE="single" for a fast sanity check
```

---

## The Research Story So Far

This is an Iterated Prisoner's Dilemma research platform. I am studying which
strategies are robust, evolutionarily stable, and resistant to real-world noise.
The goal is to produce findings that are reproducible, validated, and genuinely
informative about cooperation under uncertainty.

### What has been established (3 posts, 3 experiments)

**E-001 — Baseline** (seed=42, 200 rounds, 10 strategies):
Confirmed Axelrod's core result in our engine. Cooperative/retaliatory strategies
dominate. Ranking: TF2T > TFT ≈ GenTFT > AllCooperate ≈ Pavlov > Grudger >> ZD >
Random > SusTFT > AllDefect. Always Defect finishes last despite being dominant in
one-shot PD — because iterated play enables retaliation.

**E-002 — Variance** (100 seeds, 200 rounds):
Validated that single-seed conclusions are reliable. Max CV across all strategies
is 1.09% (Random). The bottom 4 strategies have rank std = 0.00 — they *never*
change position across any seed. Pavlov has surprisingly high variance for a
deterministic strategy (CV=0.73%) because Win-Stay/Lose-Shift is sensitive to
stochastic opponent chains. **Rule established**: single-seed ordinal results are
trustworthy; for close score comparisons, report mean ± std.

**E-003 — Evolutionary dynamics** (200 generations, seed=42):
Applied replicator dynamics to the 10-strategy field. All 4 exploitative strategies
(AllDefect, SusTFT, ZD Extorter, Random) go extinct by generation 50. The surviving
cooperative equilibrium stabilises at:
TF2T(21%) ≈ GenTFT(20%) ≈ TFT(20%) > AllCooperate(16%) > Pavlov(14%) > Grudger(9%).
The evolutionary ranking matches round-robin — validating both analyses.

### The open scientific thread

Three experiments in, a clear and important question remains **completely unanswered**:

> **What happens under noise?**

Real interactions have miscommunication. When moves are flipped with probability ε,
*all* strategies become stochastic. Generous TFT was explicitly designed for this
environment — it forgives 33% of defections to prevent conflict spirals from noise.
Theory predicts it should overtake TFT at some noise level. Grudger is predicted to
collapse (one flipped move triggers permanent retaliation). TF2T should be robust
(requires two consecutive defections before retaliating).

I don't know yet at what noise level these transitions happen. That is what the next
experiment must determine.

---

## Immediate Next Task — Experiment 04: Noise

**Research question:** How does environmental noise (random move flips at rate ε)
change the tournament ranking? Specifically: at what noise level does Generous TFT
overtake TFT? Does Grudger collapse? Does TF2T remain the leader?

**Plan:**
1. Add a noise-wrapping utility to the engine (or handle inline in analyze.ts)
2. Sweep ε ∈ {0, 0.01, 0.02, 0.05, 0.10, 0.15} — run each as a full `runMany`
   (100 seeds) so results include mean ± std per noise level
3. Find the crossover points (TFT vs GenTFT, TF2T vs everyone)
4. Run `runEvolution` at the noise levels where rankings shift — does the
   evolutionary equilibrium also shift?
5. Write devlog post 04 with the crossover table and interpretation
6. Add 2-3 noise-specific tests to engine.test.ts encoding key findings

**Implementation note on noise:**
Noise wraps a strategy: with probability ε, the move returned to the opponent is
flipped. The strategy itself doesn't know this happened — it's environmental.
The arena already has this pattern. For the devlog post, noise must be seeded (pass
the same rng into the flip decision) or the ε-sweep must use multi-seed runs.

---

## Open Questions (ranked by scientific interest)

1. **[NEXT] Noise crossover** — at what ε does GenTFT > TFT? Does Grudger collapse?
2. **Invasion stability** — start from the E-003 cooperative equilibrium, inject 1%
   AllDefect. Does cooperation recover or does defection invade? Tests ESS.
3. **Noise + evolution** — run replicator dynamics at ε=0.05. Does GenTFT dominate?
4. **Contrite TFT** — cooperate first, retaliate, but *cooperate if you were the one
   who defected last* (apologise for accidents). Theoretically optimal under noise.
5. **ZD χ-sweep** — at what χ does ZD extortion become net-negative for the
   extorter in a round-robin? (χ=3 finishes 7th; lower χ should do better)
6. **Pavlov vs TFT** — mean scores are 5004 vs 5252. Is there any noise level or
   rounds-per-match setting where Pavlov overtakes TFT?

---

## All Experiments Completed

| ID    | Date       | Description                             | Config               | Key result |
|-------|------------|-----------------------------------------|----------------------|------------|
| E-001 | 2026-02-27 | Baseline round-robin                    | seed=42, 200 rds     | TF2T > TFT > GenTFT; AllD last |
| E-002 | 2026-02-27 | Variance across 100 seeds               | seeds 0–99, 200 rds  | Rankings stable; max CV=1.09%; Pavlov most sensitive |
| E-003 | 2026-02-27 | Replicator dynamics, 200 generations   | seed=42, 200 rds     | Bottom 4 extinct by gen 50; cooperative equilibrium |

---

## Reference Data

### E-001 — Baseline Scores (seed=42)

| Rank | Strategy         | Score | Avg/Rd | Coop% |
|------|------------------|-------|--------|-------|
| 1    | Tit for Two Tats | 5302  | 2.651  | 87.5% |
| 2    | Tit for Tat      | 5248  | 2.624  | 76.1% |
| 3    | Generous TFT     | 5244  | 2.622  | 88.9% |
| 4    | Always Cooperate | 5031  | 2.515  | 100%  |
| 5    | Pavlov           | 5028  | 2.514  | 79.3% |
| 6    | Grudger          | 4888  | 2.444  | 60.3% |
| 7    | ZD Extorter      | 4742  | 2.371  | 55.4% |
| 8    | Random           | 4405  | 2.203  | 49.6% |
| 9    | Suspicious TFT   | 4250  | 2.125  | 48.1% |
| 10   | Always Defect    | 3964  | 1.982  | 0.0%  |

### E-002 — Score Variance (100 seeds, 200 rounds)

| Strategy         | Mean   | ±Std | CV%  | Rank Std |
|------------------|--------|------|------|----------|
| Tit for Two Tats | 5310.0 | 17.5 | 0.33 | 0.20     |
| Generous TFT     | 5257.1 | 22.2 | 0.42 | 0.57     |
| Tit for Tat      | 5252.3 | 15.1 | 0.29 | 0.50     |
| Always Cooperate | 5042.9 | 23.5 | 0.47 | 0.39     |
| Pavlov           | 5004.3 | 36.7 | 0.73 | 0.41     |
| Grudger          | 4894.6 | 33.5 | 0.68 | 0.10     |
| ZD Extorter      | 4672.3 | 38.4 | 0.82 | 0.00     |
| Random           | 4452.6 | 48.6 | 1.09 | 0.00     |
| Suspicious TFT   | 4259.6 | 14.2 | 0.33 | 0.00     |
| Always Defect    | 3967.1 | 40.9 | 1.03 | 0.00     |

### E-003 — Evolutionary Equilibrium (generation 200, seed=42)

| Strategy         | Gen 0 | Gen 10 | Gen 25 | Gen 50 | Gen 200 |
|------------------|-------|--------|--------|--------|---------|
| Tit for Two Tats | 10%   | 17.4%  | 20.4%  | 21.1%  | **21.2%** |
| Generous TFT     | 10%   | 16.6%  | 19.3%  | 19.9%  | **19.9%** |
| Tit for Tat      | 10%   | 16.5%  | 19.0%  | 19.6%  | **19.6%** |
| Always Cooperate | 10%   | 13.6%  | 15.4%  | 15.8%  | **15.9%** |
| Pavlov           | 10%   | 13.1%  | 14.2%  | 14.4%  | **14.4%** |
| Grudger          | 10%   | 10.1%  |  9.3%  |  9.0%  | **8.9%**  |
| ZD Extorter      | 10%   |  6.0%  |  1.6%  |  0.2%  | **0.0%**  |
| Random           | 10%   |  3.3%  |  0.5%  |  0.0%  | **0.0%**  |
| Suspicious TFT   | 10%   |  2.5%  |  0.3%  |  0.0%  | **0.0%**  |
| Always Defect    | 10%   |  0.8%  |  0.0%  |  0.0%  | **0.0%**  |

---

## Technical Quick-Reference

### Engine API

```ts
// Single tournament (deterministic)
runRoundRobin(strategies, rounds, seed)   // → TournamentResult
// seed is required for devlog posts; omit only for interactive/exploratory use

// Multi-seed variance
runMany(strategies, rounds, n, baseSeed)  // → MultiRunResult
// n runs using seeds baseSeed, baseSeed+1, ..., baseSeed+n-1

// Evolutionary dynamics
runEvolution(strategies, rounds, generations, seed)  // → EvolutionResult
// mean-field replicator dynamics on fixed pairwise payoff matrix

// Single game
playGame(stratA, stratB, rounds, rng)     // → GameResult
```

### Files

```
src/lib/engine/
  types.ts        # Move, Strategy, GameResult, TournamentResult
  rng.ts          # mulberry32(seed), defaultRng
  game.ts         # playGame()
  tournament.ts   # runRoundRobin()
  stats.ts        # runMany()
  evolution.ts    # runEvolution()
  engine.test.ts  # 44 tests — npm test

src/lib/strategies/index.ts   # all 10 strategies + allStrategies[]
src/lib/scripts/analyze.ts    # CLI runner — set MODE and npm run analyze
src/content/devlog/           # 01, 02, 03 published posts (MDX)
```

### Research standards (non-negotiable)

- All devlog posts use a **pinned seed** — never publish unseeded results
- Run `npm test` (44 green) after any engine or strategy change
- For stochastic strategies or close scores: report **mean ± std** via `runMany`
- Each new finding should be encoded as a **regression test** in engine.test.ts
- Every post ends with a **Next Steps** section

---

## Session Log

### 2026-02-27
- Built full engine, arena, devlog infrastructure, 10 strategies
- Added seeded PRNG, 44-test suite, CLI runner (`npm run analyze`)
- **E-001**: Baseline 10-strategy round-robin. TF2T > TFT > GenTFT; AllDefect last.
- **E-002**: 100-run variance analysis. Rankings stable (max CV=1.09%). Pavlov
  has highest variance of deterministic strategies due to Win-Stay/Lose-Shift
  sensitivity. Established methodological rule for multi-seed reporting.
- **E-003**: 200-generation replicator dynamics. Bottom 4 extinct by gen 50.
  Cooperative equilibrium: TF2T≈GenTFT≈TFT>AllC>Pavlov>Grudger.
- **Next session must start with**: Experiment 04 — noise sweep (ε from 0 to 0.15)
