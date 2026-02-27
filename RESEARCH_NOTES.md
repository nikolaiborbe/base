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
- [ ] Evolutionary dynamics: if population shares are updated proportional to score, which strategies survive?
- [ ] At what χ value does ZD extortion become net-negative for the extorter?
- [ ] Does Pavlov beat TFT in any parameter regime? (They seem very close — 5028 vs 5248.)

---

## Ideas / Hypotheses to Test

- **Contrite TFT**: Like TFT but apologizes after accidental defections. Should outperform TFT under noise.
- **Adaptive Pavlov**: Shift threshold is a free parameter — what's optimal?
- **Memory-2 strategies**: Can looking back 2 rounds beat TFT family in a clean tournament?
- **ZD Cooperation (χ=1)**: A ZD strategy that enforces equality — how does it compare to TFT?
- **Population dynamics**: Simulate replicator dynamics over 100 generations. Start with equal populations.

---

## Experiments Run

| ID    | Description                          | Seed | Rounds | Result summary                    |
|-------|--------------------------------------|------|--------|-----------------------------------|
| E-001 | Baseline 10-strategy round-robin     | 42   | 200    | TF2T > TFT > GenTFT; AD last     |

---

## Technical Notes

- **Seeded RNG**: mulberry32. Pass seed to `runRoundRobin(strategies, rounds, seed)`.
- **CLI runner**: `npm run analyze` — edit `src/lib/scripts/analyze.ts` to configure.
- **Tests**: `npm test` — 31 tests covering engine + all strategies. Run before publishing findings.
- **Devlog posts** live in `src/content/devlog/` as MDX. They execute engine code at build time.
- **Arena page**: interactive, uses `Math.random()` (not seeded) — fine for exploration, not for citation.

---

## Session Log

### 2026-02-27
- Built full engine: types, game.ts, tournament.ts, 10 strategies
- Built arena page and devlog infrastructure
- Added seeded PRNG (mulberry32), test suite (31 tests), CLI runner (`npm run analyze`)
- Published baseline tournament as devlog post 01 with pinned seed=42
