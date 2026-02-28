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
npm test                       # must be 54/54 green before any new work

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

### What has been established (6 posts, 6 experiments)

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

**E-004 — Noise sweep** (ε ∈ {0, 0.01, 0.02, 0.05, 0.10, 0.15}, 100 seeds each, 200 rounds):
GenTFT crossover confirmed at ε=0.01 — but the larger finding is a **phase transition
near ε≈0.10**: the entire cooperative equilibrium inverts. At ε=0.15, Always Defect
(rank 1.98) and Grudger (rank 2.35) finish first and second. ZD Extorter is the
most noise-stable strategy tested (rank 3.01–4.44 across all noise levels).
The GenTFT advantage window is ε=0.01–0.05 only.

**E-005 — Contrite TFT** (ε ∈ {0, 0.01, 0.05, 0.10}, 100 seeds each, 200 rounds + evolution at ε=0.05):
Theory was wrong. CTFT ranks **4th** at ε=0 because contrition is exploitable:
against AllDefect, CTFT alternates C/D forever (scoring 100/200 rounds) vs TFT's
DD lock-in (scoring 199/200). CTFT beats TFT at ε=0.01–0.05 but never beats GenTFT
at any tested noise level. Evolutionary dynamics at ε=0.05 produce a **three-phase
collapse**: cooperation rises (gen 0–50) → Random parasitism dominates (gen 50–100,
96% at gen 100) → Always Defect invades the Random pool and wins (76% at gen 200,
Grudger 24%). The cooperative equilibrium is evolutionarily unstable under noise.

**E-006 — CTFT in cooperative field + ε=0.02 evolution** (cooperative field: 6 strategies; full-field evolution at ε=0.02):
CTFT is still 4th even without Random/ZD — AllDefect alone is enough to penalize
contrition. CTFT is evolutionarily stable at ε=0 (~19% in cooperative field) but
GenTFT sweeps it at ε=0.01 (GenTFT→48%) and ε=0.05 (GenTFT→91%). **GenTFT is the
dominant cooperative strategy under noise** — preventing spirals (probabilistic
forgiveness) beats resolving them (contrition). Full-field ε=0.02 evolution: GenTFT
wins with 94.4%, no Random invasion, no AllDefect comeback. The **evolutionary phase
transition** (cooperative→defector) is between ε=0.02 and ε=0.05.

### The open scientific thread

Six experiments in. The core questions now are:

> **Where exactly is the evolutionary phase transition?** E-006 showed it's
> between ε=0.02 (GenTFT wins 94%) and ε=0.05 (AllDefect wins 76%). The critical
> noise threshold is somewhere in ε=0.02–0.05. Locating it precisely would reveal
> the exact noise level at which cooperation becomes evolutionarily unsustainable.

> **Can GenTFT's forgiveness rate be tuned to extend stability?** The standard 33%
> forgiveness is calibrated for specific payoff ratios. At ε=0.05, GenTFT collapses
> evolutionarily. Could a tuned forgiveness rate (e.g., 40–50%) maintain cooperative
> stability at higher noise?

---

## Immediate Next Task — Experiment 07: Phase Transition Location

**Research question:** The evolutionary phase transition (cooperative→defector)
is between ε=0.02 and ε=0.05. Where exactly?

**Plan:**
1. Run `runEvolution(allStrategies, 200, 200, 42, ε)` at ε ∈ {0.02, 0.03, 0.04, 0.05}
2. Track GenTFT's final share and when Random/AllDefect start rising
3. Find the critical ε where the cooperative equilibrium first fails
4. Write devlog post 07

---

## Experiment 04 Results (for reference)

| ε    | GenTFT rank | TFT rank | Grudger rank | AllDefect rank | Winner |
|------|-------------|----------|--------------|----------------|--------|
| 0    | 2.43        | 2.53     | 5.99         | 10.00          | TF2T   |
| 0.01 | **1.97**    | 4.13     | 8.38         | 9.80           | GenTFT |
| 0.02 | **1.79**    | 4.74     | 8.77         | 9.72           | GenTFT |
| 0.05 | 3.14        | 4.67     | 8.49         | 8.91           | TF2T   |
| 0.10 | 5.60        | **3.92** | 6.02         | 6.70           | ZD     |
| 0.15 | 7.37        | 5.30     | **2.35**     | **1.98**       | AllD   |

Phase transition: cooperative strategies dominate ε≤0.05; defection strategies
dominate ε≥0.10.

## Immediate Next Task — (Previous) Experiment 04: Noise — DONE

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

1. **[NEXT] Phase transition location** — ε=0.02 gives GenTFT 94%; ε=0.05 gives
   AllDefect 76%. Run evolution at ε ∈ {0.02, 0.03, 0.04, 0.05} to find the critical
   threshold where cooperation becomes evolutionarily unstable.
2. **GenTFT forgiveness rate sweep** — Can a tuned forgiveness rate (30–50%) extend
   cooperative stability into the ε=0.05–0.10 range? This is the core design question.
3. **ZD χ-sweep** — at what χ does ZD become net-positive in round-robin?
   (χ=3 finishes 7th clean; its noise resilience is notable — worth exploring lower χ)
4. **Pavlov under noise** — Pavlov ranks 3.69 at ε=0.05, 4.08 at ε=0.10 (stable).
   Is there a noise level where it's definitively best among deterministic strategies?
5. **Invasion stability** — start from E-003 cooperative equilibrium, inject 1%
   AllDefect. Does cooperation restore, or does defection invade?

---

## All Experiments Completed

| ID    | Date       | Description                             | Config               | Key result |
|-------|------------|-----------------------------------------|----------------------|------------|
| E-001 | 2026-02-27 | Baseline round-robin                    | seed=42, 200 rds     | TF2T > TFT > GenTFT; AllD last |
| E-002 | 2026-02-27 | Variance across 100 seeds               | seeds 0–99, 200 rds  | Rankings stable; max CV=1.09%; Pavlov most sensitive |
| E-003 | 2026-02-27 | Replicator dynamics, 200 generations   | seed=42, 200 rds     | Bottom 4 extinct by gen 50; cooperative equilibrium |
| E-004 | 2026-02-28 | Noise sweep ε ∈ {0–0.15}, 100 seeds   | seeds 0–99, 200 rds  | GenTFT leads ε=0.01–0.05; phase transition at ε≈0.10; AllDefect leads at ε=0.15 |
| E-005 | 2026-02-28 | Contrite TFT vs TFT vs GenTFT + evo   | ε ∈ {0,0.01,0.05,0.10}, 100 seeds; evo ε=0.05 seed=42 | CTFT ranks 4th at ε=0 (exploitable by AllD); beats TFT at ε=0.01–0.05 only; evo: Random→AllDefect takeover |
| E-006 | 2026-02-28 | CTFT in cooperative field; ε=0.02 evo  | coop field 100 seeds; evo ε ∈ {0,0.01,0.05,0.02} seed=42 | CTFT 4th in coop field; GenTFT sweeps evo at ε=0.01 (48%) and ε=0.05 (91%); ε=0.02 full-field: GenTFT 94%, no invasion; phase transition between ε=0.02–0.05 |

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

### 2026-02-28
- **E-004**: Noise sweep ε ∈ {0,0.01,0.02,0.05,0.10,0.15}, 100 seeds each. GenTFT
  crossover at ε=0.01. Phase transition at ε≈0.10 — AllDefect and Grudger lead at
  ε=0.15. Added noise param to game/tournament/stats/evolution engine (50 → 54 tests planned).
- **E-005**: Implemented Contrite TFT. Theory was wrong: CTFT ranks 4th at ε=0
  (exploited by AllDefect via C/D alternation, scoring 100 vs TFT's 199 against AllD).
  CTFT beats TFT at ε=0.01–0.05 only. Never beats GenTFT. Evolutionary dynamics at
  ε=0.05 show three-phase collapse: cooperation→Random (96% gen 100)→AllDefect (76%
  gen 200). Added `noise` param to `runEvolution`. 54 tests. 11 strategies.
- **E-006**: CTFT in cooperative field (6-strategy). CTFT still 4th — AllDefect alone
  penalizes it. GenTFT sweeps in cooperative-field evolution at ε=0.01 and ε=0.05
  (91%!). Full-field ε=0.02 evolution: GenTFT 94.4%, no Random invasion. Phase
  transition confirmed between ε=0.02 and ε=0.05.
- **Next session must start with**: Experiment 07 — phase transition location. Run
  evolution at ε ∈ {0.02, 0.03, 0.04, 0.05} to find the critical noise threshold.
