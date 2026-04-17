---
title: Stop Hunt
tags: [stop-hunt, liquidity, manipulation, ict-core]
created: 2024-01-15
tokens: 640
---

# Stop Hunt

## Definition
A Stop Hunt is an **engineered price move into a cluster of stop-loss orders**, triggering those stops and filling institutional orders at better prices. It is the retail-trader-perspective name for what ICT calls a [[Liquidity Sweep]].

The key insight: stop hunts are not random wicks — they are deliberate, predictable, and repeatable. Institutions need retail stops to fill large orders. They push price to where retail stops are clustered, fill their orders against the triggered stops, then reverse.

*Example:* ES is at 5,100. Retail traders who are long from 5,050 have placed tight stops at 5,090 (below a prior swing low). A stop hunt dips to 5,088, triggers those stops (now market sell orders), and institutions buy against them. Price reverses immediately to 5,150. Retail got stopped out at the exact low.

## Rules
- Do not place stops at obvious round numbers, swing lows/highs, or prior support/resistance — these are stop hunt targets
- The stop hunt wick should be swift and followed by an immediate reversal — a sustained break is not a stop hunt
- After a stop hunt, the *direction of the reversal* is the trade direction
- Stop hunts are most predictable at [[Equal Highs]] and [[Equal Lows]]
- A stop hunt with a [[Displacement Candle]] following it = the highest quality entry signal
- Position your own stop losses *beyond* the stop hunt zone — one tick past the sweep wick

## Connexions
- [[Liquidity Sweep]] — the ICT term for the same event; stop hunt = retail view, liquidity sweep = ICT view
- [[Buy-Side Liquidity]] — stop hunts above BSL levels; retail shorts get squeezed
- [[Sell-Side Liquidity]] — stop hunts below SSL levels; retail longs get stopped out
- [[Equal Highs]] — the most common and predictable stop hunt target
- [[Equal Lows]] — mirror for the downside stop hunt
- [[Stop Loss Placement]] — understanding stop hunts teaches you where to place YOUR stops so you aren't hunted
- [[Psychology - Patience]] — waiting for the stop hunt to complete before entering is a patience test
- [[Common Mistakes]] — placing stops at obvious levels where stop hunts occur = the #1 mistake
- [[London Open]] — London open is the primary stop hunt window; the most reliable timing for sweeps
- [[Market Structure]] — stop hunts target the structural swing points that retail places their stops at
- [[Fair Value Gap]] — after a stop hunt, the FVG created by the reversal displacement is the entry zone
- [[Power of Three]] — the PO3 manipulation phase is literally a stop hunt on the opposing side of the range
- [[Change of Character]] — a stop hunt followed by a reversal confirms a CHOCH on the lower timeframe
- [[IFVG]] — a stop hunt that also closes through an FVG creates an IFVG — one of the strongest setups
