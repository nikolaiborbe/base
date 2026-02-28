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
npm test                       # must be 59/59 green before any new work

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

### What has been established (9 posts, 9 experiments)

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

**E-007 — Gradual under noise + GenTFT forgiveness rate sweep** (full-field 12-strategy, 100 seeds; self-play 50 seeds; forgiveness sweep 80 seeds):

Two findings not previously in the literature:

1. **Gradual fails badly under noise.** Gradual (Mathieu & Delahaye 2002) wins
   deterministic tournaments (rank 1st at ε=0, mean rank 1.51 across 100 seeds). But
   its proportional punishment mechanism creates a noise-amplification feedback: a
   single noise-triggered defection starts a burst, partner retaliates, Gradual counts
   those as new defections and schedules a longer next burst — escalating spiral.
   Cooperation rate between two Gradual players: 100% at ε=0 → 60% at ε=0.01 → 26%
   at ε=0.05. Tournament rank: 1st → 3rd → 5th → 8th as ε increases.
   **Gradual has never been tested under noise — and fails.**

2. **Optimal forgiveness rate p\* ≈ 0.10–0.20, not canonical 0.33.** Swept p ∈ {0,
   0.10, 0.20, 0.33, 0.50, 0.67, 0.80, 1.0} in 12-strategy field (80 seeds each).
   p=0.33 is suboptimal at every tested noise level. p=0.20 is best at ε=0.01–0.05.
   Forgiveness cliff: above p=0.50, performance collapses at high noise.

3. **TF2T is the most noise-robust cooperative strategy** in round-robin (ε=0–0.05).
   Rank: 1.65→2.10→1.46→1.30 as ε goes 0→0.01→0.02→0.05. Its two-consecutive-D
   filter absorbs single noise events without triggering punishment.

Added: `gradual` strategy, `makeGenTFT(p)` factory. 59 tests (was 54).

**E-008 — Evolutionary multistability under noise** (40 seeds, 200 generations, 12 strategies, ε ∈ {0, 0.01, 0.02, 0.05}):

TF2T's round-robin advantage does NOT translate to evolutionary dominance under noise.
Noise fractures the cooperative equilibrium into multiple stable attractors:

1. **Multistability**: At ε=0, TF2T wins 68% of seeds (27/40). At ε=0.01, six
   different strategies each win 8–25% of seeds. At ε=0.05, 9 different strategies
   win across 40 seeds. The unique cooperative attractor shatters under noise.

2. **Pavlov as evolutionary attractor**: Pavlov ranks 4th–7th in round-robin at all
   noise levels, but wins 25% (ε=0.01), 35% (ε=0.02), 25% (ε=0.05) of evolutionary
   trajectories. Its fixation stability — hard to invade when common — outweighs its
   mediocre mixed-field score. Pavlov's Win-Stay/Lose-Shift rule recovers mutual
   cooperation in one round after symmetric noise events (both shift from DD to CC).

3. **Cooperation survives**: Defection strategies win at most 12% of trajectories
   across all noise levels tested. Cooperation is robust in aggregate; which cooperative
   strategy wins is unpredictable.

4. **Round-robin ≠ evolutionary fitness**: Payoff matrix noise creates multiple
   basins of attraction. Small perturbations (different seeds) tip the dynamics toward
   different equilibria. Fixation stability matters as much as mixed-field score.

62 tests (was 59). 3 new E-008 regression tests.

**E-009 — Pavlov fixation stability** (invasion from 90% Pavlov, 200 gens, all invaders, ε ∈ {0, 0.01, 0.02, 0.05}):

Added `initialShares` parameter to `runEvolution`. Tested each strategy as an invader
starting from 90% Pavlov, 0.91% all others.

1. **ε=0: Pavlov is a true ESS.** No strategy grows meaningfully. Pavlov holds at 93%.
   Exploitative strategies (ZD, SusTFT, Random) collapse. Cooperative strategies stay
   near 1%. Pavlov is completely uninvadable at zero noise.

2. **ε=0.01: TFT partially invades (5.94%), TF2T collapses (0%).** TFT earns
   2.985/round vs Pavlov (above Pavlov's 2.925 vs itself) → fitness advantage → growth.
   TF2T earns only 1.870/round vs Pavlov → collapse. The paradox: TF2T wins round-robin
   at ε=0.01 but cannot invade Pavlov because its 2-defection threshold lets Pavlov
   Win-Stay for multiple exploitation rounds before TF2T retaliates.

3. **ε=0.02: Grudger completely displaces Pavlov (0.91% → 99.9%).** Mechanism: noise
   triggers Grudger's permanent-defection response. Once triggered, Grudger earns
   ~3.0/round vs Pavlov, Pavlov earns ~0.63/round vs Grudger. Pavlov extinct by gen
   100. The noise threshold for permanent grudge trigger ≈ 1/ε = 50 rounds, well within
   200-round horizon.

4. **ε=0.05: Grudger (64%) + AllDefect (35%) jointly displace Pavlov.**

The Pavlov→Grudger threshold lies between ε=0.01 and ε=0.02.

65 tests (was 62). 3 new E-009 regression tests.

### The open scientific thread

Nine experiments in. The core questions now are:

> **Where is the Pavlov→Grudger threshold precisely?** E-009 places it between
> ε=0.01 and ε=0.02. A fine-grained sweep can locate the critical noise level where
> Grudger's invasion probability crosses 50%.

> **Is multistability (E-008) explained by basin boundaries around the Pavlov ESS?**
> E-009 shows Pavlov is stable at ε=0. The Grudger threshold at ε≈0.01-0.02 maps to
> the breakdown of Pavlov's basin. Does locating the threshold explain which seeds in
> E-008 land in Pavlov's vs TF2T's basin?

---

## Immediate Next Task — Experiment 10: The Grudger Threshold

**Research question:** At what noise level ε\* does Grudger first successfully invade
a Pavlov-dominated population? (E-009 places ε\* between 0.01 and 0.02.)

**Plan:**
1. Sweep ε ∈ {0.010, 0.012, 0.014, 0.016, 0.018, 0.020} with the same 90% Pavlov
   invasion setup from E-009
2. For each ε, run 20 seeds and count how many times Grudger's final share > 10%
3. Find the critical ε where the invasion probability crosses 50%
4. Write devlog post 10

**Expected outcome:** The critical threshold ε\* is where 1/ε (expected rounds to
first noise event) approaches the game length (200 rounds). At ε=0.01, E[first event]
= 100 rounds — some games are short enough to avoid it. At ε=0.02, E = 50 rounds —
almost all 200-round games include at least one event.

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
| E-007 | 2026-02-28 | Gradual noise sweep + forgiveness rate sweep | 12-strategy, 100 seeds, ε ∈ {0,0.01,0.02,0.05,0.10}; forg sweep 80 seeds | Gradual rank 1st at ε=0, collapses to ~8th at ε=0.05; self-play coop 100%→26%; p*=0.20 (not canonical 0.33); TF2T most noise-robust cooperative strategy |
| E-008 | 2026-02-28 | Evolutionary multistability under noise | 40 seeds × 4 noise levels, 200 gens, 12 strategies | TF2T round-robin lead ≠ evolutionary dominance; 6 distinct attractors at ε=0.01; Pavlov wins 25–35% of seeds under noise despite low round-robin rank |
| E-009 | 2026-02-28 | Pavlov fixation stability + invasion test | 90% Pavlov start, all invaders, ε ∈ {0,0.01,0.02,0.05} | Pavlov ESS at ε=0; TFT invades at ε=0.01 (5.94%), TF2T collapses; Grudger completely displaces Pavlov at ε=0.02 via noise-triggered permanent defection |

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
  engine.test.ts  # 65 tests — npm test

src/lib/strategies/index.ts   # all 12 strategies + allStrategies[] + makeGenTFT(p)
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
- **E-007**: Implemented Gradual + makeGenTFT(p) factory. Gradual wins at ε=0 (rank
  1st, mean 1.51) but collapses under noise (rank 7.85 at ε=0.05). Mechanism: noise
  amplification feedback — each noise event triggers escalating punishment cycles.
  Self-play coop rate: 100%→26% as ε goes 0→0.05 (vs TF2T: 100%→94%). Forgiveness
  sweep: p*=0.20 beats canonical p=0.33 at every noise level. TF2T is most noise-robust
  cooperative strategy in round-robin. 12 strategies, 59 tests.
- **E-008**: TF2T does NOT dominate evolutionarily under noise. Noise fractures the
  unique ε=0 cooperative attractor into a multistable landscape. At ε=0.01: 6 distinct
  winners across 40 seeds; Pavlov wins 25% despite ranking 5th in round-robin. Pavlov's
  Win-Stay/Lose-Shift recovers cooperation in 1 round after symmetric noise events;
  its fixation stability makes it a major evolutionary attractor. 62 tests.
- **E-009**: Pavlov is ESS at ε=0 (uninvadable). At ε=0.01: TFT grows to 5.94%,
  TF2T collapses (earns only 1.87/round vs Pavlov — leniency paradox). At ε=0.02:
  Grudger completely displaces Pavlov (noise triggers permanent defection; Grudger
  earns 3.0/round vs Pavlov's 0.63). Added `initialShares` param to `runEvolution`.
  65 tests.
- **Next session must start with**: Experiment 10 — Grudger threshold sweep.
  Fine-grained ε sweep between 0.01–0.02 to locate the exact invasion threshold.
