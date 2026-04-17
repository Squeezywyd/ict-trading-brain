---
title: Liquidity Sweep
tags: [liquidity, sweep, stop-hunt, ict-core]
created: 2024-01-15
tokens: 720
---

# Liquidity Sweep

## Definition
A liquidity sweep (also called a stop hunt) is when price **temporarily moves beyond a key level** — a swing high, swing low, or equal highs/lows — to trigger resting stop-loss orders placed by retail traders, then sharply reverses. Smart money uses this move to fill large orders at better prices.

**Why it happens:** Retail traders cluster stops just above swing highs and just below swing lows. This creates a pool of resting liquidity. Institutions need to buy from those sellers (or sell to those buyers) to get filled at scale — so they engineer a move into that pool, then reverse.

*Example:* ES has a swing high at 4520 from two days ago. Retail traders go long and put their stops at 4525 (5 points above). Price spikes to 4527, triggers all those stops, then reverses hard — now bearish. That spike was the liquidity sweep.

## Rules
- A sweep requires a **close back below** the swept level (for bearish sweep) or **close back above** (for bullish sweep) — a wick only is more ambiguous
- Most reliable sweeps happen at [[London Open]] (08:00 GMT) and [[NY Open]] (13:30 GMT)
- The sweep itself is not the entry — wait for the reversal candle and a structural signal
- After a sweep, look for a [[Displacement Candle]] creating a [[Fair Value Gap]] or an [[IFVG]]
- Sweeps of [[Equal Highs]] or [[Equal Lows]] are the highest probability targets
- A sweep of [[Buy-Side Liquidity]] leads to a bearish move; a sweep of [[Sell-Side Liquidity]] leads to a bullish move
- Use [[Higher Timeframe Bias]] to determine which direction is valid after the sweep
- A sweep without displacement is a low-quality signal — skip it

## Connexions
- [[Buy-Side Liquidity]] — price sweeps above highs (BSL) to trap longs and reverse bearish
- [[Sell-Side Liquidity]] — price sweeps below lows (SSL) to trap shorts and reverse bullish
- [[Stop Hunt]] — same concept, different framing; stop hunt is the mechanism of the sweep
- [[Equal Highs]] — classic sweep target; retail stops cluster at obvious double-top patterns
- [[Equal Lows]] — same logic on the downside
- [[Displacement Candle]] — the reversal candle that follows a sweep is often displacement
- [[IFVG]] — sweeps are one of the three required ingredients for an IFVG to form
- [[Power of Three]] — the sweep is the "manipulation" phase of the PO3 model
- [[Market Structure]] — sweeps respect structural levels; they target swing highs and lows specifically
- [[Asian Session Range]] — the Asian session high and low are the most predictable sweep targets at London open
- [[Kill Zones]] — sweeps outside kill zones are unreliable; timing is as important as the pattern
- [[Change of Character]] — a clean sweep followed by a reversal candle = CHOCH confirmed on the lower TF
- [[Session Highs/Lows]] — prior session highs and lows are prime sweep targets each new session
- [[SMT Divergence]] — SMT between correlated pairs at the moment of a sweep = highest-probability reversal signal
