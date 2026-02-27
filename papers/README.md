# Literature: Iterated Prisoner's Dilemma

Reference collection for the IPD strategy lab. Papers are organized
chronologically. PDFs marked ✅ are in this directory; ⬜ means the paper is
server-gated but the free URL is listed.

---

## Foundational Papers

### 1. Axelrod (1980a) — First Tournament ✅
**File:** `axelrod_1980a_effective_choice.pdf`

Axelrod, R. (1980). Effective choice in the prisoner's dilemma. *Journal of
Conflict Resolution*, 24(1), 3–25.
DOI: `10.1177/002200278002400101`

Reports Axelrod's first computerized IPD tournament (14 entrants from game
theorists across disciplines). TIT FOR TAT — submitted by Anatol Rapoport,
simply cooperating first then mirroring the opponent — won. Axelrod identifies
the core properties of successful strategies: **niceness** (never defect first),
**provocability**, and **forgiveness**. The paper that started it all.

---

### 2. Axelrod (1980b) — Second Tournament ⬜
**File:** not auto-downloadable (Academia.edu requires login)
**Free URL:** https://www.academia.edu/90474461/More_Effective_Choice_in_the_Prisoners_Dilemma
**DOI:** `10.1177/002200278002400301`

Axelrod, R. (1980). More effective choice in the prisoner's dilemma. *Journal
of Conflict Resolution*, 24(3), 379–403.

A second, larger tournament with 62 entrants who could learn from the first
round's results. TIT FOR TAT won again. Axelrod deepens the robustness analysis:
TFT's success is not fragile — it holds across many hypothetical alternative
environments. Together with the first paper, this forms the empirical basis of
*The Evolution of Cooperation*.

---

### 3. Axelrod & Hamilton (1981) — The Famous One ✅
**File:** `axelrod_hamilton_1981_evolution_of_cooperation.pdf`

Axelrod, R., & Hamilton, W. D. (1981). The evolution of cooperation. *Science*,
211(4489), 1390–1396.
DOI: `10.1126/science.7466396`
Source: Author-hosted at University of Michigan.

~30,000 citations. Embeds the tournament results in evolutionary biology using
Hamilton's inclusive fitness framework. Shows that cooperation via reciprocity
can **emerge in an asocial world**, survive exploiters, and become evolutionarily
stable. Bridges game theory and evolutionary biology. The single most important
paper in this body of work.

---

### 4. Nowak & May (1992) — Spatial IPD ⬜
**File:** not auto-downloadable (Harvard link dead, Nature paywalled)
**Free URL:** https://projects.iq.harvard.edu/files/ped/files/nature92_0.pdf
*(link may be intermittent — try ResearchGate as fallback)*
**DOI:** `10.1038/359826a0`

Nowak, M. A., & May, R. M. (1992). Evolutionary games and spatial chaos.
*Nature*, 359, 826–829.

Places cooperators and defectors on a 2D spatial grid where players interact
only with neighbors. Without memory, learning, or complex strategy, **cooperation
persists through cluster formation** — cooperators protect each other spatially.
Also reveals fractal-like spatial patterns. Opens the field of spatial
evolutionary game theory.

---

### 5. Press & Dyson (2012) — Zero-Determinant Strategies ⬜
**File:** not auto-downloadable (PMC requires JS rendering)
**Free URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC3387070/
**DOI:** `10.1073/pnas.1206569109`

Press, W. H., & Dyson, F. J. (2012). Iterated Prisoner's Dilemma contains
strategies that dominate any evolutionary opponent. *PNAS*, 109(26),
10409–10413.

The landmark theoretical breakthrough, 30 years after Axelrod. Discovered
**Zero-Determinant (ZD) strategies** — a player can unilaterally enforce a
linear relationship between both players' scores regardless of opponent
strategy. A subset, **extortion strategies**, guarantee the player's score
exceeds the opponent's by a fixed ratio. Upended the assumption that no
dominating strategy class could exist.

---

## Follow-on Papers

### 6. Hilbe, Nowak & Sigmund (2013) — Extortion in Populations ✅
**File:** `hilbe_nowak_sigmund_2013_evolution_extortion.pdf`

Hilbe, C., Nowak, M. A., & Sigmund, K. (2013). Evolution of extortion in
iterated Prisoner's Dilemma games. *PNAS*, 110(17), 6913–6918.
DOI: `10.1073/pnas.1214834110`
Source: arXiv preprint 1212.1067.

Direct response to Press & Dyson. ZD extortion strategies **fail in evolutionary
population dynamics** — extortioners cannot invade a cooperator population and
are displaced. Importantly, extortioners can act as catalysts for cooperation
(similar to TFT) but are not themselves evolutionarily stable. Essential
counterpoint to the ZD result.

---

### 7. Stewart & Plotkin (2013) — Generous ZD Strategies ⬜
**File:** not auto-downloadable (PMC requires JS rendering)
**Free URL:** https://pmc.ncbi.nlm.nih.gov/articles/PMC3780848/
**DOI:** `10.1073/pnas.1306246110`

Stewart, A. J., & Plotkin, J. B. (2013). From extortion to generosity,
evolution in the iterated Prisoner's Dilemma. *PNAS*, 110(38), 15348–15353.

Identifies **generous ZD strategies** — the evolutionary counterpart to
extortion. Unlike extortioners, generous strategies forgive occasional defection
and are evolutionarily stable in large populations. Resolves the Press-Dyson
paradox: while extortion fails evolutionarily, a related ZD class actually
promotes cooperation.

---

### 8. Knight et al. (2016) — Axelrod-Python Framework ✅
**File:** `knight_et_al_2016_axelrod_python_framework.pdf`

Knight, V., Campbell, O., Harper, M., et al. (2016). An open framework for the
reproducible study of the iterated Prisoner's Dilemma. *Journal of Open Research
Software*, 4(1), e35.
DOI: `10.5334/jors.125`
GitHub: https://github.com/Axelrod-Python/Axelrod

Introduces the Axelrod-Python library — the standard reproducible research
platform for IPD. Addresses the fact that almost none of the original tournament
code was documented or reproducible. 139+ strategies, noisy tournaments,
ecological simulations, Moran processes, full test coverage. Most subsequent
computational IPD research cites this.

---

### 9. Mathieu & Delahaye (2017) — Scaled Tournaments ✅
**File:** `mathieu_delahaye_2017_new_winning_strategies.pdf`

Mathieu, P., & Delahaye, J.-P. (2017). New winning strategies for the iterated
Prisoner's Dilemma. *Journal of Artificial Societies and Social Simulation*,
20(4), 12.
DOI: `10.18564/jasss.3517`
Open access: https://www.jasss.org/20/4/12.html

Massively scaled tournaments (up to 6,000 strategies simultaneously). Identifies
four new winning strategies, particularly **gradual**, **spiteful**, and **mem2**.
Shows TIT FOR TAT is not universally optimal — certain memory-2 strategies
outperform it in diverse environments.

---

### 10. Glynatsi, Knight & Harper (2024) — Properties of Winners ✅
**File:** `glynatsi_knight_harper_2024_properties_winning_strategies.pdf`

Glynatsi, N. E., Knight, V., & Harper, M. (2024). Properties of winning
iterated Prisoner's Dilemma strategies. *PLOS Computational Biology*, 20(12),
e1012644.
DOI: `10.1371/journal.pcbi.1012644`
Open access (CC-BY): https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012644

The most comprehensive modern tournament study: 195 strategies across thousands
of simulated tournaments. Updates Axelrod's four properties to five: be nice, be
provocable and generous, be slightly envious, be clever, adapt to environment.
Key finding: **no single strategy dominates across all tournament types** —
success is highly context-dependent.

---

## Download Status

| # | Paper | PDF |
|---|-------|-----|
| 1 | Axelrod 1980a | ✅ in repo |
| 2 | Axelrod 1980b | ⬜ link above |
| 3 | Axelrod & Hamilton 1981 | ✅ in repo |
| 4 | Nowak & May 1992 | ⬜ link above |
| 5 | Press & Dyson 2012 | ⬜ link above |
| 6 | Hilbe et al. 2013 | ✅ in repo |
| 7 | Stewart & Plotkin 2013 | ⬜ link above |
| 8 | Knight et al. 2016 | ✅ in repo |
| 9 | Mathieu & Delahaye 2017 | ✅ in repo |
| 10 | Glynatsi et al. 2024 | ✅ in repo |
