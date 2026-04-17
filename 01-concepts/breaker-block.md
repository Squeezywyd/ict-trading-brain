---
title: Breaker Block
tags: [breaker-block, order-block, structure, ict-core]
created: 2024-01-15
tokens: 680
---

# Breaker Block

## Definition
A Breaker Block is a **failed Order Block that flips polarity**. When price breaks through an OB (closes fully through it — not just a wick), the OB transitions into a Breaker Block with opposite polarity: a bullish OB that gets broken becomes resistance (bearish breaker); a bearish OB that gets broken becomes support (bullish breaker).

The mechanism: institutions who had orders in the OB are now trapped and must exit on the retest, creating the same area as a flip zone.

*Example:* There's a bullish OB at 4500–4520. Price breaks below 4500 with a full close at 4490. The 4500–4520 zone is now a **bearish breaker block** — price is expected to retrace up to 4510, reject, and drop. Enter short on the retest.

## Rules
- The break must be a **full candle close** through the OB boundary — wicks do not count
- Breakers are traded on the **first retest only**, same as OBs
- A bullish breaker (former bearish OB) = support zone; enter long on retest with rejection
- A bearish breaker (former bullish OB) = resistance zone; enter short on retest with rejection
- Stop loss: beyond the far boundary of the breaker zone — see [[Stop Loss Placement]]
- The retest must show a rejection candle — do not enter blindly into the zone
- Breaker + [[Fair Value Gap]] inside the zone = extremely high confluence setup
- A breaker that forms at a [[Premium Zone]] (bearish) or [[Discount Zone]] (bullish) carries extra weight

## Connexions
- [[Order Block (Bullish)]] — source material for a bearish breaker; a broken bullish OB becomes it
- [[Order Block (Bearish)]] — source material for a bullish breaker; a broken bearish OB becomes it
- [[Break of Structure]] — a BOS through an OB is what triggers the OB-to-breaker transition
- [[Mitigation]] — the OB gets "mitigated by breaking"; the breaker is the post-mitigation state
- [[Fair Value Gap]] — FVGs inside the breaker zone add precision to the entry point
- [[Stop Loss Placement]] — SL beyond the breaker zone is the standard rule
- [[Premium Zone]] — bearish breakers in premium = highest probability shorts
- [[Discount Zone]] — bullish breakers in discount = highest probability longs
- [[IFVG]] — an IFVG sitting inside a breaker zone = ultra-high confluence; both are inverted structures
- [[Higher Timeframe Bias]] — breaker blocks are only traded in the direction of the HTF bias
- [[Market Structure]] — a breaker block confirms that the structural level has shifted polarity
- [[Liquidity Sweep]] — the sweep that caused the BOS through the OB is often what created the breaker
- [[Change of Character]] — breaker blocks frequently mark the CHOCH zone; first retest = precision entry
- [[Displacement Candle]] — the break through the OB that creates the breaker must be a displacement
- [[Kill Zones]] — breaker retests during kill zones are the only ones with sufficient volume to hold
