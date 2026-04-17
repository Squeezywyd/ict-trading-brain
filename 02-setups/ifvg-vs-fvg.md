---
title: IFVG vs FVG
tags: [ifvg, fvg, comparison, trade-model]
created: 2024-01-15
tokens: 720
---

# IFVG vs FVG

## Definition
Both [[IFVG]] and [[Fair Value Gap]] are imbalance-based entry models, but they represent fundamentally different market conditions. Knowing when to prefer one over the other is a core skill.

**FVG (original):** Price created an imbalance during a trend move. The trend is intact. You're entering a retracement back into the gap, expecting continuation.

**IFVG (inverted):** The original FVG was invalidated by a full close through it. The move is no longer a simple retracement — it's a reversal or a shift in character. You're trading the RETEST of the now-inverted zone.

| Feature | FVG | IFVG |
|---|---|---|
| Trend context | Continuation | Reversal / shift |
| Signal type | Retracement into imbalance | Retest of inverted zone |
| Prerequisite | Displacement only | Sweep + displacement + full close |
| Reliability | Good | Higher (more confluences required) |
| Entry timing | On touch + rejection of the gap | On retest after inversion |
| Stop placement | Beyond original FVG boundary | Beyond IFVG zone boundary |

## Rules
- **Prefer IFVG when:** A liquidity sweep has just occurred AND price has closed fully through an existing FVG
- **Prefer FVG when:** The trend is intact and you are entering a standard retracement
- Both require a rejection candle inside the zone — never enter blindly into either
- An IFVG in the direction of [[Higher Timeframe Bias]] is more reliable than a counter-trend FVG
- A fresh FVG (never touched) with no nearby overlapping FVGs is the cleanest FVG setup
- The IFVG has a harder entry criterion (more steps) but produces fewer false signals than a standard FVG

## Connexions
- [[IFVG]] — full breakdown of the inversion concept and setup
- [[Fair Value Gap]] — full breakdown of the original FVG concept and setup
- [[Liquidity Sweep]] — IFVGs require a preceding sweep; FVGs do not
- [[Displacement Candle]] — both require displacement; IFVG requires an additional full close
- [[Higher Timeframe Bias]] — HTF bias is more forgiving on IFVG setups (they have built-in sweep confirmation)
- [[IFVG Setup]] — the full trade execution model for the IFVG
- [[OB vs IFVG]] — further comparison: when to choose an OB retest vs an IFVG
- [[Confluences Checklist]] — use this to verify which model you're using and whether it's the right context
- [[Market Structure]] — structural context determines whether continuation (FVG) or reversal (IFVG) is appropriate
- [[Kill Zones]] — both models require kill zone timing; a well-timed FVG outside kill zones is still a bad setup
- [[Premium Zone]] — in premium, prefer IFVG for shorts; FVGs in premium are counter-trend and lower probability
- [[SMT Divergence]] — SMT tips the balance decisively toward the IFVG when it's present at the inversion level
- [[Order Block (Bullish)]] — an OB near an FVG is the stack play; an OB near an IFVG is the ultra-stack play
- [[Power of Three]] — in PO3, the manipulation phase creates the IFVG; the distribution phase enters off the FVG
