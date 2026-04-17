---
title: Inverse Fair Value Gap
tags: [ifvg, fvg, inversion, ict-core]
created: 2024-01-15
tokens: 800
---

# Inverse Fair Value Gap (IFVG)

## Definition
An Inverse Fair Value Gap forms when a [[Fair Value Gap]] is **fully invalidated** — price closes completely through the original FVG boundary in the opposite direction. The gap flips polarity: a bullish FVG that gets broken becomes bearish resistance on retest, and vice versa.

This is one of ICT's most precise entry models because it combines three confluences in one zone: failed structure, a liquidity sweep, and a displacement.

**The 4-step formation:**
1. A [[Fair Value Gap]] forms during a trending move
2. A [[Liquidity Sweep]] occurs near a nearby swing point (stops get triggered)
3. A [[Displacement Candle]] closes **fully beyond** the FVG boundary — the gap is broken
4. The IFVG is confirmed — wait for price to **retest** the zone before entering

*Example:* Bullish FVG sits between 4500–4520. Price sweeps above a swing high, then a strong bearish candle closes below 4500. The IFVG zone is now 4500–4520 acting as resistance. Wait for price to tap back into that zone, then enter short.

## Rules
- **Confirmation:** The closing candle must close *fully* beyond the FVG boundary — a wick alone is not enough
- **Same timeframe:** Use the same TF for the inversion candle as the original FVG (3M FVG = watch for 3M close confirmation)
- **Entry:** Enter on the *retest* of the inverted zone, not immediately on the close
- **Stop loss:** Just beyond the far boundary of the IFVG zone — see [[Stop Loss Placement]]
- **Target 1:** Nearest [[Internal Liquidity]] (recent swing high/low)
- **Target 2:** Major swing high/low — [[External Liquidity]] or [[Draw on Liquidity]]
- **Invalidation:** Price closes through the IFVG boundary in the wrong direction — immediately exit — see [[Trade Invalidation]]
- Combine with [[SMT Divergence]] on correlated pairs (NQ vs ES, or GU vs EU) for confirmation
- Higher probability when the sweep occurs during a [[Kill Zones|kill zone]]

## Connexions
- [[Fair Value Gap]] — the parent concept; IFVG cannot exist without a prior FVG
- [[Liquidity Sweep]] — a sweep is the trigger that creates the displacement into the FVG
- [[Displacement Candle]] — the actual candle that closes through the FVG and confirms the IFVG
- [[IFVG Setup]] — the full trade setup procedure built around this concept
- [[IFVG vs FVG]] — when to prefer IFVG over a standard FVG retest
- [[SMT Divergence]] — pair divergence is the strongest filter for IFVG trades
- [[Stop Loss Placement]] — SL always goes just beyond the IFVG zone boundary
- [[Trade Invalidation]] — know exactly when the IFVG setup is dead
- [[Higher Timeframe Bias]] — the HTF bias must align with the IFVG direction; no exceptions
- [[Premium Zone]] — bearish IFVGs sitting in premium = the strongest short entry in the system
- [[Discount Zone]] — bullish IFVGs in discount = optimal long zone; both criteria together are A+
- [[Market Structure]] — IFVG formation often coincides with a structural Change of Character
- [[Break of Structure]] — the displacement that creates the IFVG frequently also generates a BOS
- [[Order Block (Bearish)]] — a bearish OB sitting inside the IFVG zone multiplies confluence for shorts
