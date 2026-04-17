---
title: Sell-Side Liquidity
tags: [liquidity, ssl, sell-side, ict-core]
created: 2024-01-15
tokens: 640
---

# Sell-Side Liquidity

## Definition
Sell-Side Liquidity (SSL) refers to **resting stop-loss orders sitting below price** — specifically below swing lows, previous day lows, equal lows, and session lows. These stops belong to retail long-traders who place stops below support.

Institutions that need to buy large positions use SSL as their fill zone. They push price down into the pool, trigger the sell stops (which become market orders to sell), and absorb those orders as their own buys. Price then reverses upward sharply.

*Example:* NQ holds support at 17,200 for three days. Retail buyers are long with stops at 17,185. SSL sits at 17,185. An institution needs to buy 1,000 contracts — they push price down to 17,183, fill against the stop-triggered sells, then drive NQ up 200 points.

## Rules
- Mark SSL below: swing lows, previous day lows, equal lows, session lows, and double-bottom patterns
- A [[Liquidity Sweep]] of SSL should be followed by a bullish [[Displacement Candle]] — the sweep runs stops then reverses
- SSL is the **draw on liquidity** target for bearish moves — price reaches down to collect it before reversing
- After SSL is swept, look for a [[Fair Value Gap]] or [[IFVG]] forming on lower TF for the long entry
- In a bullish scenario, SSL directly below the current price is the stop-loss placement zone
- Never fade a sweep of SSL if the [[Higher Timeframe Bias]] is bearish — the move may continue to external liquidity

## Connexions
- [[Buy-Side Liquidity]] — mirror concept; SSL sits below price, BSL sits above
- [[Liquidity Sweep]] — SSL is the target of downward sweeps; sweep of SSL = potential bullish reversal
- [[Equal Lows]] — equal lows are the most visible and reliable SSL pool on the chart
- [[Draw on Liquidity]] — in bearish trends, the DOL is the next SSL level below price
- [[Stop Hunt]] — the mechanism used to reach SSL; same event from the retail perspective
- [[Internal Liquidity]] — SSL within the current range is internal liquidity; tag it as TP1 for shorts
- [[Asian Session Range]] — the Asian session low is a key SSL level targeted in London open
- [[Power of Three]] — the PO3 manipulation phase often sweeps SSL before the true bullish move
- [[Swing Low]] — every swing low is an SSL pool; mark them all on your working TF
- [[Break of Structure]] — a sweep of SSL followed by a close above it is a bullish BOS
- [[External Liquidity]] — major swing lows beyond the range hold external SSL; final targets for bears
- [[Order Block (Bullish)]] — bullish OBs form just above SSL pools that have been swept
- [[Discount Zone]] — SSL is concentrated at the bottom of the discount zone; combine for long context
