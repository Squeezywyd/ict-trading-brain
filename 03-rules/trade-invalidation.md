---
title: Trade Invalidation
tags: [invalidation, rules, exit, discipline]
created: 2024-01-15
tokens: 560
---

# Trade Invalidation

## Definition
Trade Invalidation defines the **specific conditions under which a setup or live trade is no longer valid and must be exited or abandoned**. Every trade must have a defined invalidation *before* entry — not discovered after the fact when you're hoping it recovers.

Knowing your invalidation is as important as knowing your entry. A trader without a defined invalidation is holding a position hoping for a miracle — that is gambling, not trading.

## Rules

### Before Entry — Setup Invalidation
- **FVG:** If price closes through the far boundary of the FVG before reaching it = the FVG may be an IFVG now — re-evaluate
- **IFVG:** If price closes through the IFVG zone boundary in the wrong direction before the retest = invalid, do not enter
- **OB:** If price closes fully through the OB before the first retest = OB mitigated to a [[Breaker Block]]; reassess
- **Liquidity Sweep:** If price makes a second sweep in the same direction without reversal = the setup structure has broken down

### During a Live Trade — Exit Conditions
- Price closes **through your stop-loss level** → exit at market immediately, no waiting
- For an [[IFVG]] trade: price closes through the IFVG zone boundary (beyond the SL side) → exit immediately
- [[Higher Timeframe Bias]] flips (clear 4H CHOCH against your trade) → exit at market
- [[Internal Liquidity]] is hit with a strong displacement candle in the wrong direction → exit or reduce

### Special Rules
- A stop-hunt wick touching your SL level is **not** invalidation — a full candle *close* through it is
- If a news event causes a spike through your zone, wait for the candle close before deciding
- Do not close a trade just because it is temporarily going against you if the invalidation level has not been breached
- Once invalidated, exit cleanly — do not re-enter the same setup without a full new setup forming

## Connexions
- [[IFVG]] — IFVG has the strictest invalidation rule: a close through the zone = immediate exit
- [[Fair Value Gap]] — FVG is invalidated if price closes through the far boundary before retest
- [[Order Block (Bullish)]] — OB is invalidated by a full close through it (becomes a breaker)
- [[Stop Loss Placement]] — invalidation and SL placement are the same concept in execution
- [[Breaker Block]] — what an invalidated OB becomes; the zone flips polarity
- [[Higher Timeframe Bias]] — HTF structural flip is an invalidation for any aligned LTF trade
- [[Psychology - Discipline]] — accepting and acting on invalidation without hesitation is pure discipline
- [[Trade Journal Template]] — log the invalidation reason for every stopped trade to identify patterns
