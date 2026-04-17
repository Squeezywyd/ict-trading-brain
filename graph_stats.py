# encoding: utf-8
"""
graph_stats.py -- Obsidian vault graph analyser
Reads all .md files, builds a directed link graph, and reports statistics.
"""

import os
import re
import sys
from collections import defaultdict
from pathlib import Path

# Force UTF-8 output so the script works on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# -- 1. Discover all notes ---------------------------------------------------

VAULT_ROOT = Path(__file__).parent
SKIP_FILES = {"graph_stats.py"}


def find_notes(root: Path) -> dict:
    """Return {stem: file_path} for every .md file in the vault."""
    notes = {}
    for path in root.rglob("*.md"):
        if path.name in SKIP_FILES:
            continue
        notes[path.stem] = path
    return notes


# -- 2. Parse wiki-links -----------------------------------------------------

WIKI_LINK_RE = re.compile(r"\[\[([^\]|#]+?)(?:\|[^\]]+?)?\]\]")


def extract_links(content: str) -> list:
    raw = WIKI_LINK_RE.findall(content)
    return [t.strip() for t in raw]


def normalise(s: str) -> str:
    """Lowercase, strip parentheses/slashes, collapse separators to spaces for fuzzy matching."""
    s = re.sub(r"[()[\]/\\]+", " ", s)   # remove grouping and path chars
    s = re.sub(r"[-_]+", " ", s)          # hyphens/underscores → space
    s = re.sub(r"\s+", " ", s)            # collapse multiple spaces
    return s.lower().strip()


def resolve_link(target: str, note_stems: set, norm_map: dict) -> str:
    """
    Resolve a raw link target to a known note stem.
    Matching order:
      1. Exact stem match
      2. Case-insensitive stem match
      3. Normalised match (hyphens == spaces, case-insensitive)
    """
    if target in note_stems:
        return target
    lower = target.lower()
    for stem in note_stems:
        if stem.lower() == lower:
            return stem
    # Normalised: "Fair Value Gap" -> "fair value gap" matches "fair-value-gap"
    norm_target = normalise(target)
    return norm_map.get(norm_target)


# -- 3. Build the graph -------------------------------------------------------


def build_graph(notes: dict):
    """
    Returns:
        edges      : set of (source, target) directed unique edges
        out_degree : {stem: outbound edge count}
        in_degree  : {stem: inbound edge count}
        raw_links  : total [[link]] occurrences (including duplicates)
        dangling   : list of (source, raw_target) for unresolved links
    """
    note_stems = set(notes.keys())
    # Pre-build a normalised -> stem lookup for fast fuzzy matching
    norm_map = {normalise(stem): stem for stem in note_stems}

    edges = set()
    out_degree = defaultdict(int)
    in_degree = defaultdict(int)
    dangling = []
    raw_links = 0

    for stem, path in notes.items():
        try:
            content = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue

        seen = set()
        for raw_target in extract_links(content):
            raw_links += 1
            resolved = resolve_link(raw_target, note_stems, norm_map)
            if resolved is None:
                dangling.append((stem, raw_target))
                continue
            if resolved == stem:
                continue
            if resolved in seen:
                continue
            seen.add(resolved)
            edges.add((stem, resolved))
            out_degree[stem] += 1
            in_degree[resolved] += 1

    return edges, dict(out_degree), dict(in_degree), raw_links, dangling


# -- 4. Statistics ------------------------------------------------------------


def graph_density(n_nodes: int, n_edges: int) -> float:
    """Directed density = E / (N * (N-1))."""
    if n_nodes < 2:
        return 0.0
    return n_edges / (n_nodes * (n_nodes - 1))


def top_hubs(notes: dict, out_degree: dict, in_degree: dict, k: int = 10):
    combined = {
        stem: out_degree.get(stem, 0) + in_degree.get(stem, 0)
        for stem in notes
    }
    return sorted(combined.items(), key=lambda x: x[1], reverse=True)[:k]


# -- 5. Report ----------------------------------------------------------------

SEP  = "=" * 54
SEP2 = "-" * 54

CYAN   = "\033[96m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
BOLD   = "\033[1m"
RESET  = "\033[0m"
DIM    = "\033[2m"


def bar(value: float, width: int = 32) -> str:
    filled = round(min(value, 1.0) * width)
    return "[" + "#" * filled + "." * (width - filled) + "]"


def print_report(notes, edges, out_degree, in_degree, raw_links, dangling):
    n_nodes  = len(notes)
    n_edges  = len(edges)
    density  = graph_density(n_nodes, n_edges)

    all_degrees = [out_degree.get(s, 0) + in_degree.get(s, 0) for s in notes]
    avg_out     = sum(out_degree.values()) / n_nodes if n_nodes else 0
    avg_degree  = sum(all_degrees) / n_nodes if n_nodes else 0
    max_degree  = max(all_degrees) if all_degrees else 0
    isolated    = sum(1 for d in all_degrees if d == 0)

    print()
    print(f"{BOLD}{SEP}{RESET}")
    print(f"{BOLD}  ICT TRADING BRAIN  --  GRAPH STATISTICS{RESET}")
    print(f"{BOLD}{SEP}{RESET}")
    print()

    # Core numbers
    print(f"  {CYAN}NOEUDS     {RESET}{BOLD}{n_nodes:>6}{RESET}   notes in vault")
    print(f"  {CYAN}CONNEXIONS {RESET}{BOLD}{n_edges:>6}{RESET}   unique directed edges")
    print(f"  {CYAN}DENSITE    {RESET}{BOLD}{density:>9.3f}{RESET}   E / N*(N-1)")
    print()
    print(f"  {bar(density)}  {density * 100:.1f}%")
    print()

    # Degree distribution
    print(f"{BOLD}{SEP2}{RESET}")
    print(f"{BOLD}  DEGREE DISTRIBUTION{RESET}")
    print(f"{BOLD}{SEP2}{RESET}")
    print(f"  Average total degree   {avg_degree:>7.1f}")
    print(f"  Average out-degree     {avg_out:>7.1f}")
    print(f"  Max total degree       {max_degree:>7}")
    print(f"  Isolated nodes (deg=0) {isolated:>7}")
    print(f"  Raw [[link]] count     {raw_links:>7}  (incl. duplicates)")
    print(f"  Dangling links         {len(dangling):>7}  (target not found)")
    print()

    # Top 10 hubs
    hubs = top_hubs(notes, out_degree, in_degree, k=10)

    print(f"{BOLD}{SEP2}{RESET}")
    print(f"{BOLD}  TOP 10 HUB NOTES  (most connected){RESET}")
    print(f"{BOLD}{SEP2}{RESET}")
    print(f"  {'#':<4}  {'NOTE':<36}  {'OUT':>4}  {'IN':>4}  {'TOT':>4}")
    print(f"  {'-'*4}  {'-'*36}  {'-'*4}  {'-'*4}  {'-'*4}")
    for rank, (stem, total) in enumerate(hubs, start=1):
        out = out_degree.get(stem, 0)
        inn = in_degree.get(stem, 0)
        star = " ***" if rank <= 3 else ""
        label = stem[:36]
        print(f"  {rank:<4}  {GREEN}{label:<36}{RESET}  {out:>4}  {inn:>4}  {BOLD}{total:>4}{RESET}{YELLOW}{star}{RESET}")
    print()

    # 5 least connected
    least = sorted(
        [(s, out_degree.get(s, 0) + in_degree.get(s, 0)) for s in notes],
        key=lambda x: x[1]
    )[:5]

    print(f"{BOLD}{SEP2}{RESET}")
    print(f"{BOLD}  5 LEAST-CONNECTED NOTES{RESET}")
    print(f"{BOLD}{SEP2}{RESET}")
    for stem, total in least:
        out = out_degree.get(stem, 0)
        inn = in_degree.get(stem, 0)
        print(f"  {stem:<44}  out={out}  in={inn}")
    print()

    # 3-hop reachability estimate
    reachable_3  = min(avg_out ** 3, n_nodes)
    reachable_pct = min(reachable_3 / n_nodes * 100, 100) if n_nodes else 0

    print(f"{BOLD}{SEP2}{RESET}")
    print(f"{BOLD}  3-HOP REACHABILITY ESTIMATE{RESET}")
    print(f"{BOLD}{SEP2}{RESET}")
    print(f"  Average out-degree        {avg_out:>8.1f}")
    print(f"  Est. nodes via 3 hops     {reachable_3:>8.0f}  (avg_out^3)")
    print(f"  Total nodes               {n_nodes:>8}")
    print(f"  Coverage estimate         {reachable_pct:>7.1f}%")
    print()
    print(f"{BOLD}{SEP}{RESET}")
    print()


# -- 6. Entry point -----------------------------------------------------------

if __name__ == "__main__":
    notes = find_notes(VAULT_ROOT)
    edges, out_degree, in_degree, raw_links, dangling = build_graph(notes)
    print_report(notes, edges, out_degree, in_degree, raw_links, dangling)
