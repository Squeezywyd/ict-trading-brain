---
title: Backtesting Rules
tags: [backtesting, process, statistics, improvement]
created: 2024-01-15
tokens: 570
---

# Backtesting Rules

## Definition
Backtesting is the **structured process of replaying historical price action to verify whether a setup has a statistical edge**. ICT setups look compelling in hindsight — backtesting forces you to define the rules *first* and then test them objectively, separating genuine edge from pattern-matching bias.

The purpose of backtesting is not to find a perfect strategy — it is to **quantify your edge** so you can trade with conviction during drawdowns.

## Rules

### Before You Start
- Define **exact entry rules** before testing — no changing rules mid-session
- Use a chart replay tool (TradingView bar replay, ThinkOrSwim on-demand) — never "look ahead"
- Start from the most recent 3 months, work backward — recent data is most relevant
- Test only during [[Kill Zones]] — discard any setup that forms outside kill zone windows

### What to Log for Every Trade
- Date and time (confirm it was inside a kill zone)
- Setup type: [[Fair Value Gap|FVG]], [[IFVG]], [[Order Block (Bullish)|OB]], [[Breaker Block]], etc.
- [[Higher Timeframe Bias]] direction at the time
- Entry price, SL price, TP1 price, TP2 price
- Outcome: win (TP1 hit, TP2 hit), loss (SL hit), break-even
- R:R achieved vs. planned
- Confluence count at entry (1–5+)
- Whether [[SMT Divergence]] was present
- Notes on mistakes made or rules broken

### After 50+ Samples Per Setup
- Calculate win rate, average R:R, expectancy = (Win% × Avg Win) − (Loss% × Avg Loss)
- A positive expectancy = valid edge
- Identify which confluences most correlate with winning trades
- Identify which kill zone produces better results for each setup

### Rules for Honest Backtesting
- If you wouldn't have taken the trade live, don't count it as a backtest win — no hindsight entries
- Log losses as carefully as wins — losses are more instructive
- Do not cherry-pick time periods — include difficult ranging markets, not just trending ones

## Connexions
- [[Entry Rules]] — the rules being tested; must be fully defined before backtesting begins
- [[Kill Zones]] — all backtest trades must occur inside kill zones; tag which one
- [[Trade Journal Template]] — use the same fields as the live journal for consistency
- [[Risk Management]] — test position sizing rules in the backtest to see their long-run effect
- [[SMT Divergence]] — log whether SMT was present; compare win rates with and without it
- [[Higher Timeframe Bias]] — log the HTF bias for each backtest trade to isolate with-trend vs counter
- [[Common Mistakes]] — backtesting reveals which mistakes you make repeatedly
- [[Psychology - Patience]] — backtesting 100 trades teaches patience; most setups don't qualify
