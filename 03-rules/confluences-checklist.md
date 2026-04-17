---
title: Confluences Checklist
tags: [confluences, checklist, setup-quality, rules]
created: 2024-01-15
tokens: 600
---

# Confluences Checklist

## Definition
The Confluences Checklist is the **real-time scoring system used before entering any trade**. Each item is a confluence — a factor that independently supports the trade direction. More confluences = higher probability. A minimum threshold must be met; below it, skip the trade.

**Scoring:** Give 1 point per confirmed confluence. 3 or fewer = skip. 4–5 = proceed with caution. 6+ = A+ setup.

## Rules

### Tier 1 — Structural Requirements (must have ALL)
- [ ] **[[Higher Timeframe Bias]] is clear** — 4H or 1D structure confirmed bullish or bearish
- [ ] **[[Kill Zones|Kill zone]] is active** — London open (08:00–11:00 GMT) or NY open (13:30–16:00 GMT)
- [ ] **Minimum 1:2 R:R possible** — TP1 must be at least 2× the SL distance

### Tier 2 — Setup Quality (score these)
- [ ] [[Liquidity Sweep]] occurred at a relevant level (+1)
- [ ] [[Displacement Candle]] followed the sweep (+1)
- [ ] [[Fair Value Gap]] or [[IFVG]] is the entry zone (+1)
- [ ] Entry zone is in [[Discount Zone]] (longs) or [[Premium Zone]] (shorts) (+1)
- [ ] [[Order Block (Bullish)|OB]] aligns with or surrounds the entry zone (+1)
- [ ] [[SMT Divergence]] present on correlated pair (+1)
- [ ] [[Equal Highs]] or [[Equal Lows]] swept (not just a random swing point) (+1)
- [ ] [[Change of Character]] confirmed the direction on the lower TF (+1)

### Tier 3 — Bonus Confirmations
- [ ] Economic news release within the kill zone window (+0.5)
- [ ] [[Asian Session Range]] level swept at London open (+0.5)
- [ ] [[Session Highs/Lows|Previous day high or low]] level swept (+0.5)

### Scoring Key
- **3 Tier 1 items missing:** Do not enter — structural requirements not met
- **Score 0–3:** Skip
- **Score 4–5:** Acceptable setup — standard 1% risk
- **Score 6–8:** A+ setup — standard 1% risk (do not increase size)
- **Score 9+:** Exceptional — still only 1% risk; note it for journaling

## Connexions
- [[Entry Rules]] — the parent execution process; this checklist lives inside Step 4
- [[Higher Timeframe Bias]] — Tier 1 item; the single most important factor
- [[Kill Zones]] — Tier 1 item; timing is structural, not optional
- [[IFVG Setup]] — use this checklist before every IFVG entry
- [[SMT Divergence]] — highest-value Tier 2 item; adds +1 to any setup
- [[Pre-Trade Checklist]] — the broader daily routine that precedes this checklist
- [[Best Setups]] — A+ setups score 6+ on this checklist every time
- [[Trade Journal Template]] — log the confluence score for every trade taken
