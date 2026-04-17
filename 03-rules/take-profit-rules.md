---
title: Take Profit Rules
tags: [take-profit, targets, execution, rules]
created: 2024-01-15
tokens: 560
---

# Take Profit Rules

## Definition
Take Profit Rules define **exactly where to exit partial and full positions** based on the liquidity structure ahead. Exiting too early leaves money on the table; exiting too late turns winners into losers. ICT uses a two-target model: internal liquidity first, external liquidity final.

The core principle: **price is always moving toward the next liquidity pool** — your take profit levels should match those pools, not arbitrary round numbers or fixed pip targets.

## Rules

### TP1 — Internal Liquidity (First Target)
- Set TP1 at the nearest **unswept [[Internal Liquidity]]** level in the direction of your trade
- For longs: nearest minor swing high, [[Equal Highs]], or prior candle cluster above price
- For shorts: nearest minor swing low, [[Equal Lows]], or prior candle cluster below price
- **Action at TP1:** Close 50% of the position, move SL to break-even on the remainder
- If price hits TP1 with a strong [[Displacement Candle]] and reverses = close the full position

### TP2 — External Liquidity (Final Target)
- Set TP2 at the nearest **major [[External Liquidity]]** beyond the current range
- For longs: prior major swing high, previous day/week high, or [[Draw on Liquidity]] target
- For shorts: prior major swing low, previous day/week low, or DOL target
- **Action at TP2:** Close the remaining 50% of the position (or trail with a tight stop)

### Rules for Both Targets
- Never set TP at a round number without a liquidity reason — use structural levels only
- Minimum R:R of 1:2 required (TP1 must be at least 2× the distance of the SL)
- If TP1 is not at least 2× away from your entry, the setup has poor R:R — skip or reduce size
- **Do not move TP further away after entering** — that is greed disguised as confidence

### After TP1 is Hit
- SL moves to break-even — the remaining trade is now risk-free
- Let TP2 run unless price shows a strong reversal signal at a structural level

## Connexions
- [[Internal Liquidity]] — TP1 is always the nearest internal liquidity pool
- [[External Liquidity]] — TP2 is the final external liquidity target
- [[Draw on Liquidity]] — the DOL identifies where TP2 should be placed
- [[Risk Management]] — 1:2 minimum R:R links SL distance to required TP distance
- [[Equal Highs]] — equal highs above price = TP1 target for longs
- [[Equal Lows]] — equal lows below price = TP1 target for shorts
- [[Trade Invalidation]] — hitting TP1 with reversal displacement = full close rule
- [[Trade Journal Template]] — log the R:R achieved vs. planned for every trade
