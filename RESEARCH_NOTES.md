# IPD Research Notes

Running log of experiments, findings, and open questions.
Updated by Claude at the start/end of each research session.

---

## Baseline Configuration

- **Engine**: Round-robin, every pair plays once (including self-play)
- **Default rounds/match**: 200
- **Payoff matrix**: R=3, T=5, S=0, P=1 (standard Axelrod)
- **Reproducibility**: All devlog posts use a pinned seed; `analyze.ts` defaults to seed=42
- **Strategies (v1, 10 total)**:
  - Always Cooperate, Always Defect, Random
  - Tit for Tat, Tit for Two Tats, Suspicious TFT, Generous TFT
  - Grudger, Pavlov
  - ZD Extorter (χ=3)

---

## Established Results

### Post 01 — Baseline tournament (seed=42, 200 rounds)

| Rank | Strategy        | Score | Avg/Rd | Coop% |
|------|-----------------|-------|--------|-------|
| 1    | Tit for Two Tats | 5302 | 2.651  | 87.5% |
| 2    | Tit for Tat      | 5248 | 2.624  | 76.1% |
| 3    | Generous TFT     | 5244 | 2.622  | 88.9% |
| 4    | Always Cooperate | 5031 | 2.515  | 100%  |
| 5    | Pavlov           | 5028 | 2.514  | 79.3% |
| 6    | Grudger          | 4888 | 2.444  | 60.3% |
| 7    | ZD Extorter      | 4742 | 2.371  | 55.4% |
| 8    | Random           | 4405 | 2.203  | 49.6% |
| 9    | Suspicious TFT   | 4250 | 2.125  | 48.1% |
| 10   | Always Defect    | 3964 | 1.982  | 0%    |

**Key takeaways:**
- Nice strategies (never defect first) occupy the top 5. Confirms Axelrod's original result.
- TFT variants cluster at the top. Mutual games produce 3/round; they limit damage from exploiters.
- Pavlov is competitive despite not being "nice" — it self-corrects to mutual cooperation.
- Always Defect finishes last in a mixed field because it never builds cooperation.
- ZD Extorter: extracts from adaptive strategies but can't exploit unconditional ones effectively.

---

## Open Questions

- [ ] How does noise (ε=0.01, 0.05, 0.10) reorder the standings? Generous TFT was designed for noisy environments.
- [ ] Does Grudger collapse under noise? (One flipped move triggers permanent retaliation.)
- [ ] What is the noise threshold at which TFT falls behind Generous TFT?
- [x] Evolutionary dynamics → answered in E-003. Exploiters extinct by gen 50; cooperative equilibrium is TF2T/GenTFT/TFT/AllC/Pavlov/Grudger.
- [ ] **Invasion stability**: introduce 1% AllDefect into the cooperative equilibrium — does it invade or get driven out?
- [ ] At what χ value does ZD extortion become net-negative for the extorter?
- [ ] Does Pavlov beat TFT in any parameter regime? (5004 vs 5252 mean; Pavlov has much higher variance — is there a regime where this flips?)

---

## Ideas / Hypotheses to Test

- **Contrite TFT**: Like TFT but apologizes after accidental defections. Should outperform TFT under noise.
- **Adaptive Pavlov**: Shift threshold is a free parameter — what's optimal?
- **Memory-2 strategies**: Can looking back 2 rounds beat TFT family in a clean tournament?
- **ZD Cooperation (χ=1)**: A ZD strategy that enforces equality — how does it compare to TFT?
- **Population dynamics**: Simulate replicator dynamics over 100 generations. Start with equal populations.

---

## Established Results

### Post 02 — Variance analysis (100 runs, seeds 0–99, 200 rounds)

| Strategy         | Mean Score | ±Std | CV(%) | Rank Std |
|------------------|-----------|------|-------|----------|
| Tit for Two Tats | 5310.0    | 17.5 | 0.33  | 0.20     |
| Generous TFT     | 5257.1    | 22.2 | 0.42  | 0.57     |
| Tit for Tat      | 5252.3    | 15.1 | 0.29  | 0.50     |
| Always Cooperate | 5042.9    | 23.5 | 0.47  | 0.39     |
| Pavlov           | 5004.3    | 36.7 | 0.73  | 0.41     |
| Grudger          | 4894.6    | 33.5 | 0.68  | 0.10     |
| ZD Extorter      | 4672.3    | 38.4 | 0.82  | 0.00     |
| Random           | 4452.6    | 48.6 | 1.09  | 0.00     |
| Suspicious TFT   | 4259.6    | 14.2 | 0.33  | 0.00     |
| Always Defect    | 3967.1    | 40.9 | 1.03  | 0.00     |

**Key findings:**
- Rankings are overwhelmingly stable. Bottom 4 (ZD, Random, SusTFT, AllD) have rank std=0 — they never change position.
- Score variance is small (max CV=1.09%). Single-seed ordinal conclusions are reliable.
- Pavlov has the highest variance of any deterministic strategy (CV=0.73%) — Win-Stay/Lose-Shift is highly sensitive to stochastic opponent behaviour.
- **Correction to Post 01:** ZD Extorter's rank never varies (std=0.00). Previous claim that "results vary between runs" was misleading — only absolute score varies, not rank.

**Methodological rule established:** For experiments with stochastic strategies, report mean ± std from multi-seed runs when score margins are close. Single-seed results are sufficient for ordinal comparisons.

## Experiments Run

| ID    | Description                          | Seed/Seeds | Rounds | Result summary                    |
|-------|--------------------------------------|------------|--------|-----------------------------------|
| E-001 | Baseline 10-strategy round-robin     | 42         | 200    | TF2T > TFT > GenTFT; AD last     |
| E-002 | Variance analysis, 100 seeds (0–99)  | 0–99       | 200    | Rankings stable; CV<2%; Pavlov most sensitive |
| E-003 | Replicator dynamics, 200 generations | 42         | 200    | Bottom 4 extinct by gen 50; cooperative equilibrium TF2T≈GenTFT≈TFT>AllC>Pavlov>Grudger |

---

## Ideas / Hypotheses to Test

- **Contrite TFT**: Like TFT but apologizes after accidental defections. Should outperform TFT under noise.
- **Adaptive Pavlov**: Shift threshold is a free parameter — what's optimal?
- **Memory-2 strategies**: Can looking back 2 rounds beat TFT family in a clean tournament?
- **ZD Cooperation (χ=1)**: A ZD strategy that enforces equality — how does it compare to TFT?
- **Population dynamics**: Simulate replicator dynamics over 100 generations. Start with equal populations.

---

## Technical Notes

- **Seeded RNG**: mulberry32. Pass seed to `runRoundRobin(strategies, rounds, seed)`.
- **CLI runner**: `npm run analyze` — edit `src/lib/scripts/analyze.ts` to configure.
- **Tests**: `npm test` — 44 tests covering engine + all strategies + runMany + runEvolution. Run before publishing findings.
- **Devlog posts** live in `src/content/devlog/` as MDX. They execute engine code at build time.
- **Arena page**: interactive, uses `Math.random()` (not seeded) — fine for exploration, not for citation.

---

## Session Log

### 2026-02-27
- Built full engine: types, game.ts, tournament.ts, 10 strategies
- Built arena page and devlog infrastructure
- Added seeded PRNG (mulberry32), test suite (37 tests), CLI runner (`npm run analyze`)
- Published baseline tournament as devlog post 01 (seed=42)
- Built `runMany()` variance function in stats.ts; added 6 tests
- Ran E-002: 100-run variance analysis; found rankings stable, CV<2%, Pavlov most sensitive
- Published devlog post 02 — formal variance analysis with multi-seed methodology
- Built `runEvolution()` replicator dynamics in evolution.ts; added 7 tests (44 total)
- Ran E-003: 200 generations, seed=42; all exploiters extinct by gen 50; cooperative equilibrium stable
- Published devlog post 03 — evolutionary dynamics with full population trajectory table
- Next: noise experiment (post 04) — how does ε noise reorder rankings? Does Generous TFT overtake TFT?
