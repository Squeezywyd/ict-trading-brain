#!/usr/bin/env python3
# encoding: utf-8
"""
server.py — ICT Trading Brain web reader
Run:  python server.py
Open: http://localhost:8080
"""

import http.server
import json
import re
import socketserver
import sys
import time
import urllib.parse
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

VAULT_ROOT   = Path(__file__).parent
STATIC_DIR   = VAULT_ROOT / "static"
JOURNAL_FILE = VAULT_ROOT / "journal.json"
PORT = 8080

WIKI_LINK_RE = re.compile(r"\[\[([^\]|#]+?)(?:\|[^\]]+?)?\]\]")
YAML_FRONT_RE = re.compile(r"^---[ \t]*\r?\n(.*?)\r?\n---[ \t]*\r?\n", re.DOTALL)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def normalise(s: str) -> str:
    s = re.sub(r"[()[\]/\\&]+", " ", s)
    s = re.sub(r"[-_]+", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.lower().strip()


def parse_frontmatter(raw: str):
    """Return (meta_dict, body_str). Handles inline-list tags."""
    m = YAML_FRONT_RE.match(raw)
    if not m:
        return {}, raw
    block = m.group(1)
    body = raw[m.end():]
    meta = {}
    current_list_key = None
    for line in block.splitlines():
        stripped = line.strip()
        if stripped.startswith("- ") and current_list_key:
            meta[current_list_key].append(stripped[2:].strip().strip("'\""))
            continue
        current_list_key = None
        if ":" not in stripped:
            continue
        key, _, val = stripped.partition(":")
        key = key.strip()
        val = val.strip()
        if val.startswith("[") and val.endswith("]"):
            meta[key] = [t.strip().strip("'\"") for t in val[1:-1].split(",") if t.strip()]
        elif val == "" or val == "|":
            meta[key] = []
            current_list_key = key
        elif key == "tokens":
            try:
                meta[key] = int(val)
            except ValueError:
                meta[key] = val
        else:
            meta[key] = val
    return meta, body


def find_all_notes():
    notes = []
    for md_path in sorted(VAULT_ROOT.rglob("*.md")):
        rel = md_path.relative_to(VAULT_ROOT)
        parts = rel.parts
        folder = parts[0] if len(parts) > 1 else ""
        try:
            raw = md_path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        meta, _ = parse_frontmatter(raw)
        notes.append({
            "path": rel.as_posix(),
            "stem": md_path.stem,
            "folder": folder,
            "title": meta.get("title", md_path.stem),
            "tags": meta.get("tags", []),
        })
    return notes


def build_norm_map(notes):
    return {normalise(n["stem"]): n["stem"] for n in notes}


def resolve_link(target, stem_set, norm_map):
    if target in stem_set:
        return target
    lower = target.lower()
    for stem in stem_set:
        if stem.lower() == lower:
            return stem
    return norm_map.get(normalise(target))


# ---------------------------------------------------------------------------
# HTML shell
# ---------------------------------------------------------------------------

HTML_SHELL = """\
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ICT Trading Brain</title>
<link rel="stylesheet" href="/static/style.css">
<script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
</head>
<body>

<!-- Layer 0: webcam background -->
<video id="bg-video" autoplay muted playsinline></video>

<!-- Layer 1: graph canvas -->
<canvas id="graph-canvas"></canvas>

<!-- Layer 2: MediaPipe hand skeleton -->
<canvas id="hand-canvas"></canvas>

<!-- Layer 3: virtual finger cursor -->
<div id="cursor"></div>

<!-- UI panels -->
<div id="stats-panel">
  <div id="brand">ICT TRADING BRAIN</div>
  <input id="search-input" type="text" placeholder="Rechercher un noeud…" autocomplete="off" spellcheck="false">
  <div id="stats-text"></div>
</div>

<div id="gesture-legend">
  <div class="leg"><span class="lk">☝</span> POINTER &mdash; SURVOL</div>
  <div class="leg active"><span class="lk">🤏</span> PINCER &mdash; SÉLECTION</div>
  <div class="leg"><span class="lk">🤏→</span> PINCER+GLISSER &mdash; PAN</div>
  <div class="leg"><span class="lk">✌↔</span> ÉCARTER &mdash; ZOOM+</div>
  <div class="leg"><span class="lk">✌→</span> 2 DOIGTS &mdash; PAN</div>
  <div class="leg"><span class="lk">✌↔</span> RAPPROCHER &mdash; ZOOM&minus;</div>
</div>

<div id="node-info" class="hidden">
  <div id="ni-title"></div>
  <div id="ni-folder"></div>
  <div id="ni-stats"></div>
  <div id="ni-tags"></div>
  <button id="ni-read-btn" onclick="openSelectedNote()">LIRE LA NOTE &#x2192;</button>
</div>

<!-- Note reader (slide-in from right) -->
<div id="note-reader" class="hidden">
  <button id="close-reader" onclick="closeReader()">&#x2715;</button>
  <div id="breadcrumb"></div>
  <article id="note-body"></article>
</div>

<div id="gesture-indicator"></div>
<div id="toast"></div>

<!-- Right toolbar: session clock + panel toggle buttons -->
<div id="right-toolbar">
  <div id="session-widget">
    <div id="sw-time">--:--:-- ET</div>
    <div id="sw-row">
      <span id="sw-session">--</span>
      <span id="sw-po3"></span>
    </div>
    <div id="sw-next"></div>
  </div>
  <div id="tool-buttons">
    <button class="tb-btn" id="btn-confluence" onclick="togglePanel('confluence-panel')">CONFLUENCE</button>
    <button class="tb-btn" id="btn-journal" onclick="togglePanel('journal-panel')">JOURNAL</button>
  </div>
</div>

<!-- Confluence Checker panel (slides from right) -->
<div id="confluence-panel" class="side-panel hidden">
  <div class="sp-header">
    <span class="sp-title">CONFLUENCE CHECKER</span>
    <button class="sp-close" onclick="togglePanel('confluence-panel')">&#x2715;</button>
  </div>
  <div class="sp-body" id="confluence-body"></div>
  <div class="sp-footer">
    <div id="confluence-score"></div>
    <button class="sp-btn" onclick="clearConfluences()">CLEAR</button>
    <button class="sp-btn sp-btn-primary" onclick="saveToJournal()">&#x2192; JOURNAL</button>
  </div>
</div>

<!-- Trading Journal panel (slides from right) -->
<div id="journal-panel" class="side-panel hidden">
  <div class="sp-header">
    <span class="sp-title">TRADING JOURNAL</span>
    <button class="sp-close" onclick="togglePanel('journal-panel')">&#x2715;</button>
  </div>
  <div class="sp-body" id="journal-body"></div>
</div>

<script src="/static/app.js"></script>
</body>
</html>
"""


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------

MIME = {
    ".css": "text/css; charset=utf-8",
    ".js":  "application/javascript; charset=utf-8",
    ".ico": "image/x-icon",
    ".png": "image/png",
    ".svg": "image/svg+xml",
}


class VaultHandler(http.server.BaseHTTPRequestHandler):
    _notes_cache = None
    _norm_map     = None
    _stem_set     = None
    _stem_to_path = None

    @classmethod
    def _load(cls):
        if cls._notes_cache is None:
            cls._notes_cache = find_all_notes()
            cls._norm_map     = build_norm_map(cls._notes_cache)
            cls._stem_set     = {n["stem"] for n in cls._notes_cache}
            cls._stem_to_path = {n["stem"]: n["path"] for n in cls._notes_cache}

    # ------------------------------------------------------------------
    def do_GET(self):
        self._load()
        parsed = urllib.parse.urlparse(self.path)
        path   = urllib.parse.unquote(parsed.path)

        if path in ("/", "/index.html"):
            self._send_bytes(200, "text/html; charset=utf-8", HTML_SHELL.encode())
        elif path == "/api/notes":
            self._send_json(200, self._notes_cache)
        elif path == "/api/graph":
            self._api_graph()
        elif path.startswith("/api/note/"):
            self._api_note(path[len("/api/note/"):])
        elif path == "/api/journal":
            self._api_journal_get()
        elif path.startswith("/static/"):
            self._serve_static(path[len("/static/"):])
        else:
            self._send_json(404, {"error": "not found"})

    # ------------------------------------------------------------------
    def do_POST(self):
        self._load()
        parsed = urllib.parse.urlparse(self.path)
        path   = urllib.parse.unquote(parsed.path)
        if path == "/api/journal":
            self._api_journal_post()
        elif path.startswith("/api/journal/delete/"):
            self._api_journal_delete(path[len("/api/journal/delete/"):])
        else:
            self._send_json(404, {"error": "not found"})

    # ------------------------------------------------------------------
    def _api_journal_get(self):
        if not JOURNAL_FILE.exists():
            self._send_json(200, [])
            return
        try:
            data = json.loads(JOURNAL_FILE.read_text(encoding="utf-8"))
            self._send_json(200, data)
        except Exception:
            self._send_json(200, [])

    def _api_journal_post(self):
        length = int(self.headers.get("Content-Length", 0))
        body   = self.rfile.read(length)
        try:
            entry = json.loads(body)
        except Exception:
            self._send_json(400, {"error": "invalid JSON"})
            return
        entries = []
        if JOURNAL_FILE.exists():
            try:
                entries = json.loads(JOURNAL_FILE.read_text(encoding="utf-8"))
            except Exception:
                pass
        entry["id"] = str(int(time.time() * 1000))
        entries.insert(0, entry)
        JOURNAL_FILE.write_text(
            json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        self._send_json(200, entry)

    def _api_journal_delete(self, raw_id: str):
        entry_id = raw_id.strip("/")
        if not JOURNAL_FILE.exists():
            self._send_json(404, {"error": "no journal"})
            return
        try:
            entries = json.loads(JOURNAL_FILE.read_text(encoding="utf-8"))
        except Exception:
            self._send_json(500, {"error": "read error"})
            return
        entries = [e for e in entries if e.get("id") != entry_id]
        JOURNAL_FILE.write_text(
            json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        self._send_json(200, {"ok": True})

    # ------------------------------------------------------------------
    def _api_note(self, raw_path: str):
        raw_path = raw_path.strip("/")
        stem_set     = self._stem_set
        norm_map     = self._norm_map
        stem_to_path = self._stem_to_path

        # Resolve: accept stem, title, or relative path
        if raw_path.endswith(".md"):
            full = VAULT_ROOT / raw_path
        else:
            resolved = resolve_link(raw_path, stem_set, norm_map)
            if not resolved:
                self._send_json(404, {"error": f"Note not found: {raw_path!r}"})
                return
            full = VAULT_ROOT / stem_to_path[resolved]

        try:
            raw = full.read_text(encoding="utf-8", errors="replace")
        except OSError:
            self._send_json(404, {"error": "File not found"})
            return

        meta, body = parse_frontmatter(raw)

        # Collect outbound resolved link stems
        out_links = []
        seen = set()
        for t in WIKI_LINK_RE.findall(body):
            r = resolve_link(t.strip(), stem_set, norm_map)
            if r and r not in seen:
                seen.add(r)
                out_links.append(r)

        self._send_json(200, {
            "path":        full.relative_to(VAULT_ROOT).as_posix(),
            "stem":        full.stem,
            "frontmatter": meta,
            "markdown":    body,
            "links":       out_links,
        })

    # ------------------------------------------------------------------
    def _api_graph(self):
        from collections import defaultdict
        notes        = self._notes_cache
        stem_set     = self._stem_set
        norm_map     = self._norm_map
        stem_to_path = self._stem_to_path

        in_deg  = defaultdict(int)
        out_deg = defaultdict(int)
        edge_set = set()
        edges = []

        for note in notes:
            full = VAULT_ROOT / note["path"]
            try:
                raw = full.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            _, body = parse_frontmatter(raw)
            seen = set()
            for t in WIKI_LINK_RE.findall(body):
                r = resolve_link(t.strip(), stem_set, norm_map)
                if not r or r == note["stem"] or r in seen:
                    continue
                seen.add(r)
                key = (note["stem"], r)
                if key not in edge_set:
                    edge_set.add(key)
                    edges.append({"source": note["stem"], "target": r})
                    out_deg[note["stem"]] += 1
                    in_deg[r] += 1

        nodes = [
            {
                "stem":   n["stem"],
                "title":  n["title"],
                "folder": n["folder"],
                "tags":   n["tags"],
                "degree": in_deg[n["stem"]] + out_deg[n["stem"]],
            }
            for n in notes
        ]
        self._send_json(200, {"nodes": nodes, "edges": edges})

    # ------------------------------------------------------------------
    def _serve_static(self, filename: str):
        # Prevent path traversal
        safe = Path(filename).name
        fp   = STATIC_DIR / safe
        ext  = fp.suffix.lower()
        try:
            data = fp.read_bytes()
        except (OSError, FileNotFoundError):
            self._send_json(404, {"error": "static file not found"})
            return
        ct = MIME.get(ext, "application/octet-stream")
        self._send_bytes(200, ct, data, cache=False)

    # ------------------------------------------------------------------
    def _send_json(self, status: int, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self._send_bytes(status, "application/json; charset=utf-8", body)

    def _send_bytes(self, status: int, ct: str, data: bytes, cache=False):
        self.send_response(status)
        self.send_header("Content-Type", ct)
        self.send_header("Content-Length", str(len(data)))
        if cache:
            self.send_header("Cache-Control", "public, max-age=3600")
        else:
            self.send_header("Cache-Control", "no-cache")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        pass   # silent — no per-request noise


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print(f"ICT Trading Brain  —  http://localhost:{PORT}")
    print("Press Ctrl-C to stop.\n")
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), VaultHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
