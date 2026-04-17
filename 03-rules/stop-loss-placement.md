---
title: Stop Loss Placement
tags: [stop-loss, risk, execution, rules]
created: 2024-01-15
tokens: 560
---

# Stop Loss Placement

## Definition
Stop Loss Placement is the **precise rule for where to place your stop-loss order** based on the entry model used. Incorrect SL placement is one of the most common reasons traders are stopped out of valid setups — placing the SL too tight gets hunted; too wide destroys R:R.

The core ICT principle: **your stop goes beyond the liquidity sweep wick or the entry zone boundary** — not at a round number, not at a prior candle high/low, not at "a few pips above support."

## Rules

### For FVG Entries
- SL goes **just beyond the far boundary** of the FVG zone
- For a bullish FVG at 4,500–4,520: SL at 4,496 (4 points below the zone)
- If price closes below 4,500, the FVG is invalidated anyway — you want out

### For IFVG Entries
- SL goes **just beyond the far boundary** of the IFVG zone
- For a bearish IFVG (resistance zone) at 4,500–4,520: SL at 4,526
- Never put SL inside the zone — if price is in the zone, the trade is still valid

### For Order Block Entries
- Bullish OB entry: SL goes **below the low of the OB candle** (low of the last bearish candle)
- Bearish OB entry: SL goes **above the high of the OB candle**
- Add 2–5 points/pips buffer beyond the candle wick — not flush with it

### For Liquidity Sweep Entries
- SL goes **beyond the wick of the sweep candle** — beyond the highest/lowest point reached
- The sweep wick represents the extreme of the engineered move — if price goes back beyond it, the setup failed

### General Rules
- Calculate position size from the SL distance and your 1% risk — see [[Risk Management]]
- Never move SL against your position — only move it to break-even or trail with profits
- Minimum R:R of 1:2 required — if SL requires risking more than half the potential move to TP1, reconsider

## Connexions
- [[Risk Management]] — SL distance determines position size; they are directly linked
- [[IFVG]] — SL placement for IFVG setups is strictly beyond the zone boundary
- [[Order Block (Bullish)]] — SL below the OB candle low for bullish OB entries
- [[Liquidity Sweep]] — SL beyond the sweep wick is the standard rule after a sweep-based entry
- [[Trade Invalidation]] — SL being hit = the trade was invalidated structurally, not just financially
- [[Common Mistakes]] — SL at obvious levels (round numbers, prior candle highs) = stop hunt bait
- [[Entry Rules]] — SL is defined in Step 5 of the entry process; must be set before entering
- [[Psychology - Discipline]] — never moving SL against you is a discipline test; this is where accounts blow up
