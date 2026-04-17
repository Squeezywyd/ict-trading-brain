# ICT Trading Brain

An all-in-one ICT (Inner Circle Trader) trading companion built as an interactive knowledge graph. Navigate 58+ trading concept notes using **hand gestures via webcam**, check confluences before a trade, track sessions in real time, and log every trade to a persistent journal — all in one dark-mode web app.

![Stack](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square)
![Stack](https://img.shields.io/badge/D3.js-v7-orange?style=flat-square)
![Stack](https://img.shields.io/badge/MediaPipe-Hands-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

---

## Features

### Knowledge Graph
- **Force-directed graph** of 58 interconnected ICT concept notes rendered on a Canvas with D3.js
- Node size scales by connectivity — hubs like *Fair Value Gap* and *Market Structure* stand out instantly
- Hover, click, or pinch to select a node and read the full note in a slide-in panel
- Real-time **search** filters the graph by title, stem, or tag
- **Wiki-links** (`[[note]]`) resolve bidirectionally with backlink tracking

### Hand Gesture Navigation (MediaPipe Hands)
| Gesture | Action |
|---|---|
| ☝ Index finger | Hover / snap to nearest node |
| 🤏 Short pinch | Select node — opens info card |
| 🤏 Long pinch + move | Drag node in graph |
| 🤏 Pinch on empty space | Pan the graph |
| ✌ Two fingers spread | Zoom in |
| ✌ Two fingers close | Zoom out |
| ✌ Two fingers move | Pan |

Webcam feed is rendered as a semi-transparent background layer (45% opacity) so you see yourself navigating the graph.

### Session Tracker
Live ET (Eastern Time) clock in the top-right corner showing:
- Current trading session / Kill Zone: **Asian KZ · London KZ · NY AM KZ · NY Lunch · NY PM KZ**
- **Power of Three phase**: Accumulation → Manipulation → Distribution
- Countdown to next session boundary
- Automatically adjusts for US Daylight Saving Time

### Confluence Checker
Pre-trade checklist with 18 ICT confluences across 6 categories:
- Higher Timeframe, Price Delivery, Liquidity, Market Structure, Timing, Risk
- Live score (e.g. `12/18 — 67%`)
- State persists in `localStorage` across page refreshes
- **→ Journal** button pre-fills checked confluences directly into the trade form

### Trading Journal
- Log trades with: instrument, session, direction (Long/Short), entry/SL/TP/exit prices, R:R, result, confluences used, and free-text notes
- Session auto-detected from current ET time when you open the form
- Persistent storage in `journal.json` (local file, excluded from git)
- Live stats: total trades, win rate, W/L/BE breakdown, average R:R
- Delete individual entries

---

## Vault Structure

```
ict-trading-brain/
├── 00-inbox/          # Quick capture for new ideas
├── 01-concepts/       # 35 core ICT concept notes
│   ├── fair-value-gap.md
│   ├── order-block-bullish.md
│   ├── liquidity-sweep.md
│   └── ...
├── 02-setups/         # Trade setup strategies
├── 03-rules/          # Entry, SL, TP, risk, backtesting rules
├── 04-maps/           # Maps of Content (MOCs) — thematic overviews
│   ├── Liquidity & Sweeps - MOC.md
│   ├── Market Structure - MOC.md
│   ├── Sessions & Timing - MOC.md
│   └── ...
├── server.py          # Python HTTP server + REST API
├── graph_stats.py     # Vault analytics (run standalone)
├── static/
│   ├── app.js         # All frontend logic (graph, gestures, panels)
│   └── style.css      # Dark-mode styles
└── journal.json       # Auto-created on first trade log (gitignored)
```

---

## Setup

### Requirements
- **Python 3.8+** (no third-party packages needed — stdlib only)
- A modern browser (Chrome or Edge recommended for best MediaPipe support)
- A webcam (required for hand tracking; the graph works without it)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Squeezywyd/ict-trading-brain.git
cd ict-trading-brain

# 2. Start the server
python server.py
```

That's it. No `pip install`, no virtual environment, no build step.

```
ICT Trading Brain  —  http://localhost:8080
Press Ctrl-C to stop.
```

### Open the app

Navigate to **http://localhost:8080** in your browser.

On first load the browser will ask for **camera permission** — allow it to enable hand gesture control. The app is fully functional with mouse/keyboard if you deny camera access.

---

## Usage

### Mouse / Keyboard
- **Click** a node to select it and show the info card
- **Click + drag** a node to reposition it
- **Scroll** to zoom, **click + drag** on empty space to pan
- Type in the **search box** (top-left) to filter nodes
- Click **READ NOTE →** in the info card to open the full note

### Hand Gestures
Point your hand at the webcam and use the gestures from the table above. A green cursor tracks your index finger tip. The EMA-smoothed position prevents jitter.

### Session Tracker
Always visible in the top-right. No interaction needed — it updates every second.

### Confluence Checker
1. Click **CONFLUENCE** (top-right toolbar)
2. Tick each condition that is met for your current trade idea
3. Use the score to decide if the setup has enough confluences
4. Click **→ JOURNAL** to carry the checked items into a new journal entry

### Trading Journal
1. Click **JOURNAL** (top-right toolbar)
2. Fill in the trade form — session and datetime are auto-populated
3. Click **LOG TRADE** to save
4. The entry list below the form shows all past trades with stats

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | HTML shell |
| `GET` | `/api/notes` | All notes metadata (stem, title, folder, tags) |
| `GET` | `/api/graph` | Graph JSON — nodes with degree, edges |
| `GET` | `/api/note/<stem>` | Single note — markdown, frontmatter, outbound links |
| `GET` | `/api/journal` | All journal entries (JSON array) |
| `POST` | `/api/journal` | Save a new journal entry |
| `POST` | `/api/journal/delete/<id>` | Delete a journal entry by ID |

---

## Vault Analytics

Run `graph_stats.py` to get a detailed report of the vault structure:

```bash
python graph_stats.py
```

Output includes: node/edge counts, density, top 10 hub notes, isolated nodes, and dangling (broken) links.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3 — `http.server`, `socketserver`, stdlib only |
| Graph | D3.js v7 — force simulation, Canvas 2D rendering |
| Hand tracking | MediaPipe Hands (via CDN) |
| Markdown | marked.js (via CDN) |
| Notes format | Markdown with YAML frontmatter + Obsidian-style `[[wiki-links]]` |
| Storage | Flat files — `.md` notes + `journal.json` |

---

## Notes Format

Each note is a Markdown file with optional YAML frontmatter:

```markdown
---
title: Fair Value Gap
tags: [imbalance, price-delivery, entry]
---

A **Fair Value Gap (FVG)** is a three-candle imbalance where...

## See also
- [[order-block-bullish]]
- [[displacement-candle]]
```

The `[[wiki-link]]` syntax is Obsidian-compatible. Links are resolved bidirectionally and used to build the graph edges.

---

## License

MIT
