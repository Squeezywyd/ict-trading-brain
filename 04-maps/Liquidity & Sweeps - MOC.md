---
title: Liquidity & Sweeps - MOC
tags: [map-of-content, liquidity, sweeps]
created: 2024-01-15
---

# Liquidity & Sweeps - MOC

> **Purpose:** Everything related to where stops live, how they get hunted, and what happens after the sweep. This is the mechanical heart of the ICT system — price moves to collect liquidity, not because of trend or momentum alone.

---

## Liquidity Pools

Where resting orders cluster. These are the *targets* price is drawn to before reversing or continuing.

- [[Buy-Side Liquidity]] — stops above swing highs; institutions sell into these
- [[Sell-Side Liquidity]] — stops below swing lows; institutions buy into these
- [[Equal Highs]] — double/triple tops; the densest, most obvious BSL pool
- [[Equal Lows]] — double/triple bottoms; the densest, most obvious SSL pool
- [[Internal Liquidity]] — stop clusters *within* the current range; TP1 targets
- [[External Liquidity]] — stop clusters *beyond* the current range; final TP targets
- [[Session Highs/Lows]] — previous session extremes; prime same-day liquidity levels

---

## The Sweep Mechanism

How price is engineered into those pools and what the reversal looks like.

- [[Liquidity Sweep]] — the engineered move that triggers resting stops then reverses
- [[Stop Hunt]] — the same event from the retail trader's perspective
- [[Displacement Candle]] — the reversal candle following a sweep; confirms intent
- [[Power of Three]] — the PO3 "manipulation" phase *is* the sweep; see how they map

---

## After the Sweep — What to Do

Once a sweep is confirmed, this cluster defines the next steps.

- [[IFVG]] — a sweep + displacement through a prior FVG creates the IFVG entry zone
- [[Fair Value Gap]] — the FVG left by post-sweep displacement is the precision entry
- [[Order Block (Bullish)]] — a bullish OB that caused the sweep is the retest entry zone
- [[Order Block (Bearish)]] — same logic on the short side

---

## Draw on Liquidity — Macro Targeting

Before entering, know where price is going *after* the sweep.

- [[Draw on Liquidity]] — the next liquidity pool price is magnetically drawn toward
- [[Higher Timeframe Bias]] — the HTF bias tells you which direction the sweep sets up
- [[Market Structure]] — structure defines which liquidity pool is the live draw

---

## Connexions to Process
- [[IFVG Setup]] — the full trade model built directly on sweep + displacement + IFVG
- [[Entry Rules]] — step 3 of entry rules: identify the sweep before anything else
- [[Confluences Checklist]] — sweep occurrence is a scored confluence item (+1)
- [[Common Mistakes]] — entering *before* the sweep completes is mistake #5
