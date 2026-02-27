# Project: Prisoner's Dilemma Lab

**Researcher:** Robert Axelrod — ran iterated Prisoner's Dilemma computer
tournaments (1980–1981). Tit-for-Tat (Anatol Rapoport) won both. Led to his
book *The Evolution of Cooperation* (1984).

## What This Site Is

A living research lab for iterated Prisoner's Dilemma (IPD) strategy
experimentation. Two layers:

1. **Public Dev Log** — experiment write-ups, graphs, results. Linked from the
   landing page. Written by Claude after running experiments.
2. **Strategy Arena** (hidden, not linked from main nav) — the engine for
   defining, validating, and benchmarking strategies.

## Long-Term Goal (brief note)

Claude uses the arena to run tournaments, analyze results, and iteratively
develop novel strategies. The dev log is the record of that process. Eventually:
build models that learn and evolve strategies.

## Core Components to Build

### 1. IPD Engine (`src/lib/engine/`)
- Game logic (Cooperate / Defect, payoff matrix)
- Round-robin tournament runner
- Evolutionary tournament runner (population-based, generational)
- Metrics: average score, cooperation rate, win/loss, robustness

### 2. Built-in Strategies (`src/lib/strategies/`)
- TitForTat, AllCooperate, AllDefect, Random
- Grudger, TitForTwoTats, Pavlov (Win-Stay-Lose-Shift)
- Zero-determinant strategies (Press-Dyson extortioners)
- Strategy interface so new ones can be dropped in

### 3. Strategy Arena (`src/pages/arena/`)
- Not linked from main nav
- Run tournaments between selected strategies
- Score output, cooperation matrix, per-round breakdown
- Validate a new strategy against the field

### 4. Dev Log (`src/pages/devlog/`, `src/content/devlog/`)
- Astro content collections (markdown posts)
- Post structure: title, date, hypothesis, method, results, graphs, conclusion
- Chart rendering (Chart.js or lightweight SVG)
- Landing page shows latest post + link to full log

### 5. Papers (`papers/`)
- PDFs or references to key literature
- `papers/README.md` with full citations and significance notes

## Key Papers

| Paper | Year | Significance |
|-------|------|--------------|
| Axelrod — "Effective Choice in the Prisoner's Dilemma" | 1980 | First tournament; TFT wins |
| Axelrod — "More Effective Choice..." | 1980 | Second tournament confirms TFT |
| Axelrod & Hamilton — "The Evolution of Cooperation" | 1981 | Science paper; biological framing |
| Nowak & May — "Evolutionary games and spatial chaos" | 1992 | Spatial IPD; cooperators can survive |
| Press & Dyson — "Iterated Prisoner's Dilemma contains strategies..." | 2012 | Zero-determinant strategies; extortion possible |
| Hilbe, Nowak et al. — various reactive strategy papers | 2013–2020 | Responses to ZD strategies; evolutionary stability |

## Dev Stack Notes

- Astro static output (switch to hybrid if arena needs server compute)
- TypeScript strict for all engine/strategy code
- Charts: prefer static SVG or Chart.js (client-side island)
- No CMS — all devlog posts are markdown files committed to the repo
