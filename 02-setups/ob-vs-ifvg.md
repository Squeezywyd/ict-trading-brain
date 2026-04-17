---
title: OB vs IFVG
tags: [order-block, ifvg, comparison, trade-model]
created: 2024-01-15
tokens: 730
---

# OB vs IFVG

## Definition
Both [[Order Block (Bullish)|Order Blocks]] and [[IFVG|IFVGs]] are high-probability entry zones in ICT methodology, but they arise from different market conditions. Understanding which to prioritize when both exist at the same level is a key decision point.

**OB (Order Block):** A zone where institutions placed their initial orders — the last opposite-direction candle before a strong move. You're trading the *retest of institutional entry*.

**IFVG:** A zone that formed when a prior FVG was invalidated by a sweep + displacement. You're trading the *retest of an inverted imbalance zone*.

| Feature | Order Block | IFVG |
|---|---|---|
| Origin | Last opposite candle before big move | Failed FVG after sweep + displacement |
| Zone type | Institutional order zone | Inverted imbalance zone |
| Entry count | First retest only | First retest only |
| Expiry | After first touch (mitigated) | After price closes through opposite side |
| Reliability | High (if meets all 4 OB criteria) | Higher (3 confluences required) |
| Use case | Fresh, untouched OBs in trend direction | Post-sweep scenario with clear inversion |

**When IFVG wins over OB:**
- A liquidity sweep just occurred nearby
- The FVG has been clearly closed through by a displacement
- [[SMT Divergence]] confirms the inversion direction

**When OB wins over IFVG:**
- No FVG existed at the level before the move
- The OB meets all 4 criteria and has never been touched
- Price is in a clean trend continuation without a recent sweep

## Rules
- If an IFVG and an OB overlap at the same level, the combination zone is exceptionally strong
- Never enter on an OB that has already been mitigated — even if an IFVG forms there later
- An IFVG always requires a sweep; an OB requires a BOS — verify which event occurred

## Connexions
- [[Order Block (Bullish)]] — detailed OB rules and criteria
- [[Order Block (Bearish)]] — bearish version of the OB model
- [[IFVG]] — the inversion mechanism and entry model
- [[IFVG Setup]] — full IFVG trade execution procedure
- [[Liquidity Sweep]] — the trigger that differentiates an IFVG from a plain OB
- [[Mitigation]] — OBs expire after mitigation; IFVGs expire when closed through
- [[Confluences Checklist]] — check this when two models conflict at the same level
- [[Best Setups]] — IFVG and OB are both in the top 3 setups; overlap = highest probability
- [[Fair Value Gap]] — both OB and IFVG setups are strengthened when an FVG aligns within the zone
- [[Higher Timeframe Bias]] — HTF bias affects which model you prefer; aligned HTF OBs are more durable
- [[Kill Zones]] — both models require kill zone confirmation; without timing, neither has statistical edge
- [[Market Structure]] — structural context (trend vs reversal) is the primary selection criterion between the two
- [[Breaker Block]] — OBs transition to breakers when broken; IFVGs do not have this equivalent
- [[Displacement Candle]] — both models require displacement to validate the zone; a zone without it is disqualified
