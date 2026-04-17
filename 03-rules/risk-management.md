---
title: Risk Management
tags: [risk, position-sizing, money-management, rules]
created: 2024-01-15
tokens: 600
---

# Risk Management

## Definition
Risk Management is the **framework of rules that determines how much capital is risked on each trade and under what conditions**. In ICT methodology, risk management is non-negotiable — no setup, regardless of how many confluences it has, justifies breaking the risk rules.

The single most important fact in trading: **you can have a 40% win rate and be profitable if your average win is 3× your average loss.** Risk management is how you stay in the game long enough for your edge to play out.

## Rules

### The 1% Rule
- **Maximum risk per trade = 1% of total account balance**
- This is an absolute ceiling — there are no exceptions for "high confidence" setups
- Example: $10,000 account → max $100 risk per trade
- If your SL is 20 points away on NQ (each point = $20/contract) → max 0.25 contracts

### Position Sizing Formula
```
Risk $ = Account Balance × 0.01
SL Distance $ = SL points × Dollar per point
Position Size = Risk $ ÷ SL Distance $
```

### R:R Requirements
- Minimum **1:2 Risk:Reward** — TP1 must be at least 2× the SL distance
- Preferred: 1:3 or better for high-confluence setups
- A 1:2 R:R with 40% win rate = breakeven; anything above 40% = profitable

### Daily Loss Limit
- Stop trading for the day after losing **2% of account in one session**
- Two stopped trades at 1% each = daily maximum loss
- After hitting daily limit: close the platform, review, resume tomorrow

### After a Win
- Do not increase size — return to standard 1% on the next trade
- Compounding works over time, not within a single session
- "Revenge trading" after a loss and "euphoria trading" after a win are both ruled out

### Capital Protection Rules
- If first [[Internal Liquidity]] is hit and no further displacement occurs → protect capital, exit
- Never let a winner become a loser — move SL to break-even at TP1
- Never add to a losing position ("averaging down") — this breaks the 1% rule

## Connexions
- [[Stop Loss Placement]] — SL distance directly determines position size; the two are inseparable
- [[Take Profit Rules]] — minimum 1:2 R:R links SL to required TP levels
- [[Trade Invalidation]] — when a trade is invalidated, exit at or before SL, do not hold
- [[Internal Liquidity]] — TP1 at internal liquidity = the trigger for moving SL to BE
- [[Psychology - Discipline]] — following risk rules under pressure is the ultimate discipline test
- [[Common Mistakes]] — over-leveraging and skipping the 1% rule = the most destructive mistakes
- [[Trade Journal Template]] — log every trade's R:R planned vs. achieved for accountability
- [[Backtesting Rules]] — test position sizing rules during backtesting to see their effect on performance
