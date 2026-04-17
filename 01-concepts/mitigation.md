---
title: Mitigation
tags: [mitigation, order-block, breaker, price-action]
created: 2024-01-15
tokens: 650
---

# Mitigation

## Definition
Mitigation occurs when price **returns to an Order Block zone and neutralizes it** — the institutional orders that were "waiting" in the OB are filled on the retest. Once mitigated, the OB no longer has fresh orders to defend the zone; it loses its magnetic pull.

Understanding mitigation is critical: an OB is only valid **once**. After price mitigates it (first clean touch), the zone is spent. Entering on a second or third touch is trading a mitigated — and therefore invalid — OB.

*Example:* A bullish OB sits at 4,500–4,520. Price drops to 4,510, wicks down to 4,502, then rockets up 80 points. The OB has been mitigated — the institutional orders were filled on that retest. If price returns to 4,510 again later, the OB is dead — do not re-enter there.

## Rules
- An OB is mitigated on its **first clean touch** — any further touch is entering a mitigated zone
- A mitigated OB becomes either: (a) a neutral zone with no edge, or (b) a [[Breaker Block]] if price breaks through it
- "Clean touch" = price enters the OB zone with a rejection reaction (wick + reversal)
- If price fails to react and closes through the OB = not mitigation, but rather a [[Break of Structure]] through the OB
- Mitigated OBs can sometimes act as weak support/resistance but should not be your primary entry basis
- [[Fair Value Gap]] zones inside OBs do not expire the same way — they stay relevant longer

## Connexions
- [[Order Block (Bullish)]] — mitigation is what neutralizes a bullish OB after the first retest
- [[Order Block (Bearish)]] — same process for bearish OBs; one clean retest and it's spent
- [[Breaker Block]] — a broken-through OB (not just mitigated) becomes a breaker with flipped polarity
- [[Fair Value Gap]] — FVGs take longer to "expire" than OBs; they remain valid until fully filled
- [[Entry Rules]] — the first retest rule: enter on the first touch, never the second
- [[Trade Invalidation]] — a price close through the OB without reacting = the OB is invalidated
- [[Common Mistakes]] — trading mitigated OBs is one of the most common errors for ICT students
- [[Backtesting Rules]] — when backtesting, mark whether each OB you enter is the first touch or not
- [[Liquidity Sweep]] — a sweep into the OB zone is what constitutes the mitigation touch
- [[Displacement Candle]] — the reversal off the OB during mitigation should be a displacement; weak reaction = OB may fail
- [[Market Structure]] — once an OB is mitigated, it no longer has structural significance; remove it from your chart
- [[Higher Timeframe Bias]] — HTF OBs take more mitigation touches to expire; they are more durable than LTF OBs
- [[Kill Zones]] — first touch of an OB during a kill zone is the highest quality mitigation entry
- [[IFVG]] — after an OB is mitigated, look nearby for an IFVG forming to take the continuation trade
