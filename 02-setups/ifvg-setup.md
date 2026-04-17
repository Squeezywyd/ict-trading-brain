---
title: IFVG Setup
tags: [ifvg, setup, trade-model, ict-core]
created: 2024-01-15
tokens: 800
---

# IFVG Setup

## Definition
The IFVG Setup is the **complete trade execution model** built around an [[IFVG|Inverse Fair Value Gap]]. It is one of the highest-probability setups in ICT methodology because it requires three confluences to exist simultaneously: a failed FVG, a liquidity sweep, and a displacement.

This is a **5-step execution model:**

1. **Identify the original FVG** on the working TF (must be formed from displacement during a kill zone)
2. **Wait for a liquidity sweep** near a nearby swing point — price runs stops
3. **Displacement confirms** — a strong candle closes *fully beyond* the FVG boundary on the same TF
4. **IFVG is confirmed** — the zone is now inverted; label it and wait for the retest
5. **Enter on the retest** of the IFVG zone with a rejection candle (pin bar or engulfing)

*Example (bearish IFVG):* 15M bullish FVG at 4,500–4,520. Price sweeps the prior swing high at 4,540, then a massive bearish 15M candle closes at 4,495 — fully below 4,500. IFVG confirmed: 4,500–4,520 is now resistance. Price retraces to 4,510, prints a bearish engulfing. Short entry at 4,508. SL at 4,525. TP1: 4,470 (internal liquidity). TP2: 4,430 (external liquidity).

## Rules
- **Timeframe match:** The close that confirms the IFVG must be on the same TF as the original FVG
- **Entry:** Enter ONLY on the retest, never on the displacement candle itself
- **Stop loss:** Just beyond the far boundary of the IFVG zone (5 points outside)
- **TP1:** Nearest [[Internal Liquidity]] — take 50% off here, move SL to break-even
- **TP2:** Next major [[External Liquidity]] or [[Draw on Liquidity]] — trail or close remainder
- **Invalidation:** If price closes through the IFVG zone beyond the boundary, exit immediately
- **Supercharge:** Combine with [[SMT Divergence]] on correlated pairs for highest probability
- **Timing:** Setups inside [[Kill Zones]] only — London or NY open window

## Connexions
- [[IFVG]] — the core concept; understand the inversion mechanism before trading this setup
- [[Fair Value Gap]] — the parent structure that gets inverted; must exist first
- [[Liquidity Sweep]] — step 2 of the IFVG formation; sweep is the trigger
- [[Displacement Candle]] — step 3; the candle that confirms the inversion
- [[SMT Divergence]] — the highest-value filter to add to this setup
- [[Stop Loss Placement]] — SL rules for this setup are strict; follow them exactly
- [[Trade Invalidation]] — know the invalidation criteria before entering
- [[Risk Management]] — max 1% risk per IFVG trade, no exceptions
- [[Higher Timeframe Bias]] — the HTF bias must be confirmed before taking any IFVG setup
- [[Premium Zone]] — bearish IFVG setups in premium = the highest-probability short setups in the system
- [[Discount Zone]] — bullish IFVG setups in discount = the highest-probability long setups in the system
- [[Power of Three]] — the IFVG setup is the precision entry model for the PO3 manipulation-to-distribution phase
- [[Equal Highs]] — sweeps of equal highs precede the most reliable IFVG short setups
- [[Market Structure]] — the IFVG must align with market structure; counter-trend IFVGs have a much lower success rate
