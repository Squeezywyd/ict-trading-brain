/* ============================================================
   ICT Trading Brain — app.js
   Sections:
     1. STATE
     2. NOTE LOADER + HISTORY
     3. RENDERER (marked.js + wiki-links + backlinks)
     4. GRAPH ENGINE (D3 force + Canvas 2D)
     5. GESTURE ENGINE (MediaPipe Hands)
   ============================================================ */

'use strict';

/* ============================================================
   1. STATE
   ============================================================ */

const STATE = {
  // Notes
  allNotes:     [],
  stemToNote:   {},
  normMap:      {},
  currentStem:  null,
  history:      [],
  historyIndex: -1,

  // Graph
  graphData:    null,     // {nodes, edges}
  simulation:   null,     // d3 force simulation
  transform:    null,     // current d3 zoom transform (set in init)
  zoomBehavior: null,
  graphCanvas:  null,
  graphCtx:     null,

  // Interaction
  hoveredNode:  null,     // node object under cursor
  selectedNode: null,     // node object (pinched/clicked)
  draggedNode:  null,     // node being dragged by gesture
  searchQuery:  '',
};

const BACKLINK_INDEX = {};

/* ============================================================
   2. NOTE LOADER + HISTORY
   ============================================================ */

const FOLDER_DISPLAY = {
  '':            'Root',
  '00-inbox':    '00 · Inbox',
  '01-concepts': '01 · Concepts',
  '02-setups':   '02 · Setups',
  '03-rules':    '03 · Rules',
  '04-maps':     '04 · Maps',
};

function normaliseJS(s) {
  s = s.replace(/[()[\]/\\&]+/g, ' ');
  s = s.replace(/[-_]+/g, ' ');
  s = s.replace(/\s+/g, ' ');
  return s.toLowerCase().trim();
}

function resolveToStem(target) {
  if (!target) return null;
  if (STATE.stemToNote[target]) return target;
  const lower = target.toLowerCase();
  for (const stem of Object.keys(STATE.stemToNote)) {
    if (stem.toLowerCase() === lower) return stem;
  }
  return STATE.normMap[normaliseJS(target)] || null;
}

async function loadNoteList() {
  const res = await fetch('/api/notes');
  STATE.allNotes = await res.json();
  for (const n of STATE.allNotes) {
    STATE.stemToNote[n.stem] = n;
    STATE.normMap[normaliseJS(n.stem)] = n.stem;
    if (n.title !== n.stem) {
      const nt = normaliseJS(n.title);
      if (!STATE.normMap[nt]) STATE.normMap[nt] = n.stem;
    }
  }
}

async function navigateTo(stemOrTitle, pushHistory = true) {
  const stem = resolveToStem(stemOrTitle);
  if (!stem) { showToast(`Not found: "${stemOrTitle}"`); return; }

  const res = await fetch(`/api/note/${encodeURIComponent(stem)}`);
  if (!res.ok) { showToast('Could not load note'); return; }
  const data = await res.json();

  if (pushHistory) {
    STATE.history = STATE.history.slice(0, STATE.historyIndex + 1);
    STATE.history.push(stem);
    STATE.historyIndex = STATE.history.length - 1;
  }
  STATE.currentStem = stem;

  for (const target of (data.links || [])) {
    if (!BACKLINK_INDEX[target]) BACKLINK_INDEX[target] = new Set();
    BACKLINK_INDEX[target].add(stem);
  }

  renderNote(data);
  openReader();

  if (STATE.graphData) {
    const node = STATE.graphData.nodes.find(n => n.stem === stem) || null;
    STATE.selectedNode = node;
    updateNodeInfo(node);
    drawGraph();
  }
}

function openReader() {
  document.getElementById('note-reader').classList.remove('hidden');
}

function closeReader() {
  document.getElementById('note-reader').classList.add('hidden');
  STATE.currentStem  = null;
  STATE.selectedNode = null;
  drawGraph();
}
window.closeReader = closeReader;

function openSelectedNote() {
  const n = STATE.selectedNode || STATE.hoveredNode;
  if (n) navigateTo(n.stem);
}
window.openSelectedNote = openSelectedNote;

window.navigateTo = navigateTo;

/* ============================================================
   3. RENDERER
   ============================================================ */

function preprocessWikiLinks(markdown) {
  return markdown.replace(
    /\[\[([^\]|#\n]+?)(?:\|([^\]]+?))?\]\]/g,
    (_, target, alias) => {
      const t    = target.trim();
      const stem = resolveToStem(t) || normaliseJS(t);
      const disp = alias ? alias.trim() : t;
      return `[${disp}](wiki:${encodeURIComponent(stem)})`;
    }
  );
}

// Marked v5+ uses marked.use() with token-based renderer — set up once.
function setupMarked() {
  marked.use({
    renderer: {
      link({ href, title, text }) {
        if (href && href.startsWith('wiki:')) {
          const stem = decodeURIComponent(href.slice(5));
          const note = STATE.stemToNote[stem] || {};
          const ttl  = (title || note.title || stem).replace(/"/g, '&quot;');
          return `<a class="wiki-link" data-stem="${stem}" href="#" title="${ttl}" ` +
                 `onclick="navigateTo('${stem.replace(/'/g, "\\'")}');return false;">${text}</a>`;
        }
        return false;   // use marked's default link rendering
      },
      listitem({ text, task, checked }) {
        if (task) return `<li><input type="checkbox" disabled ${checked ? 'checked' : ''}> ${text}</li>\n`;
        return false;
      },
    },
    gfm: true,
    breaks: false,
  });
}

function renderBacklinks(stem) {
  const sources = BACKLINK_INDEX[stem];
  if (!sources || sources.size === 0) return '';
  const items = [...sources].sort().map(s => {
    const n = STATE.stemToNote[s] || { title: s };
    return `<li><a class="wiki-link" href="#" onclick="navigateTo('${s.replace(/'/g, "\\'")}');return false;">${n.title}</a></li>`;
  }).join('');
  return `<section class="backlinks"><h3>Linked from</h3><ul>${items}</ul></section>`;
}

function renderNote(data) {
  const html = marked.parse(preprocessWikiLinks(data.markdown || ''));
  const tags = (data.frontmatter.tags || [])
    .map(t => `<span class="tag-pill">#${t}</span>`).join('');

  document.getElementById('note-body').innerHTML =
    (tags ? `<div class="note-meta">${tags}</div>` : '') +
    html +
    renderBacklinks(data.stem);

  const parts  = (data.path || '').split('/');
  const folder = parts.length > 1 ? parts[0] : '';
  document.getElementById('breadcrumb').innerHTML =
    `<span class="bc-folder">${FOLDER_DISPLAY[folder] || folder}</span>` +
    `<span class="bc-sep">/</span>` +
    `<span class="bc-title">${data.frontmatter.title || data.stem}</span>`;

  document.getElementById('note-body').scrollTop = 0;
  document.title = `${data.frontmatter.title || data.stem} — ICT Trading Brain`;
}

/* ============================================================
   4. GRAPH ENGINE (D3 force + Canvas 2D)
   ============================================================ */

const NODE_COLOUR = {
  '':            '#00e5ff',
  '00-inbox':    '#546e7a',
  '01-concepts': '#00e676',
  '02-setups':   '#ffd54f',
  '03-rules':    '#ef5350',
  '04-maps':     '#ce93d8',
};

function nodeRadius(d) {
  return Math.max(5, Math.sqrt(d.degree) * 2.8 + 4);
}

async function loadGraph() {
  const res = await fetch('/api/graph');
  STATE.graphData = await res.json();
  initCanvasGraph();
}

function initCanvasGraph() {
  const { nodes, edges } = STATE.graphData;
  const canvas = document.getElementById('graph-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  STATE.graphCanvas = canvas;
  STATE.graphCtx    = canvas.getContext('2d');
  STATE.transform   = d3.zoomIdentity;

  const W = canvas.width;
  const H = canvas.height;

  // D3 force simulation — updates node x/y positions only
  const sim = d3.forceSimulation(nodes)
    .force('link',    d3.forceLink(edges).id(d => d.stem).distance(72).strength(0.32))
    .force('charge',  d3.forceManyBody().strength(-230))
    .force('center',  d3.forceCenter(W / 2, H / 2))
    .force('collide', d3.forceCollide(d => nodeRadius(d) + 6));

  sim.on('tick', drawGraph);
  STATE.simulation = sim;

  // Node drag — must be attached BEFORE d3.zoom so stopImmediatePropagation
  // prevents D3 zoom from treating the same mousedown as a pan start.
  let _dragNode = null;
  canvas.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const n = _nearNodeAtEvent(e);
    if (n) {
      _dragNode = n;
      sim.alphaTarget(0.3).restart();
      e.stopImmediatePropagation();   // block D3 zoom from starting a pan
    }
  });
  window.addEventListener('mousemove', e => {
    if (!_dragNode) return;
    const t = STATE.transform || d3.zoomIdentity;
    _dragNode.fx = (e.clientX - t.x) / t.k;
    _dragNode.fy = (e.clientY - t.y) / t.k;
  });
  window.addEventListener('mouseup', () => {
    if (_dragNode) { sim.alphaTarget(0); _dragNode = null; }
  });

  // D3 zoom — handles wheel zoom and click-drag pan
  // Attached AFTER mousedown so node-drag takes priority via stopImmediatePropagation
  const zoom = d3.zoom()
    .scaleExtent([0.06, 8])
    .on('zoom', e => {
      STATE.transform = e.transform;
      drawGraph();
    });

  d3.select(canvas).call(zoom);
  STATE.zoomBehavior = zoom;

  // Click to select (D3 zoom does not suppress click unless mouse moved)
  canvas.addEventListener('click', e => {
    const n = findNearestNode(e.clientX, e.clientY, 30);
    if (n) {
      STATE.selectedNode = n;
      updateNodeInfo(n);
      drawGraph();
    } else {
      STATE.selectedNode = null;
      updateNodeInfo(STATE.hoveredNode);
      drawGraph();
    }
  });

  // Mouse hover
  canvas.addEventListener('mousemove', e => {
    const n = findNearestNode(e.clientX, e.clientY);
    if (n !== STATE.hoveredNode) {
      STATE.hoveredNode = n;
      updateNodeInfo(STATE.selectedNode || n);
      drawGraph();
    }
  });

  // Search
  document.getElementById('search-input').addEventListener('input', e => {
    STATE.searchQuery = e.target.value.trim().toLowerCase();
    drawGraph();
  });

  updateStatsPanel();
}

function _nearNodeAtEvent(evt) {
  return findNearestNode(evt.clientX, evt.clientY, 24);
}

function findNearestNode(vpX, vpY, threshPx) {
  if (!STATE.graphData) return null;
  const t     = STATE.transform || d3.zoomIdentity;
  const gx    = (vpX - t.x) / t.k;
  const gy    = (vpY - t.y) / t.k;
  const limit = (threshPx !== undefined ? threshPx : GS.HOVER_DIST_PX) / t.k;

  let best = null, bestDist = Infinity;
  for (const n of STATE.graphData.nodes) {
    if (n.x == null) continue;
    const d = Math.hypot(n.x - gx, n.y - gy);
    if (d < bestDist) { bestDist = d; best = n; }
  }
  return bestDist < limit ? best : null;
}

function drawGraph() {
  const canvas = STATE.graphCanvas;
  if (!canvas || !STATE.graphData) return;
  const ctx    = STATE.graphCtx;
  const { nodes, edges } = STATE.graphData;
  const t      = STATE.transform || d3.zoomIdentity;
  const W      = canvas.width;
  const H      = canvas.height;
  const query  = STATE.searchQuery || '';
  const hov    = STATE.hoveredNode;
  const sel    = STATE.selectedNode;

  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(t.x, t.y);
  ctx.scale(t.k, t.k);

  // Build dim / lit sets
  let dimSet = null;
  if (query) {
    dimSet = new Set();
    for (const n of nodes) {
      if (!n.title.toLowerCase().includes(query) &&
          !n.stem.toLowerCase().includes(query)  &&
          !(n.tags || []).some(tg => tg.toLowerCase().includes(query))) {
        dimSet.add(n.stem);
      }
    }
  }

  const focusStem = (sel || hov)?.stem;
  let litSet = null;
  if (focusStem) {
    litSet = new Set([focusStem]);
    for (const e of edges) {
      const src = e.source?.stem ?? e.source;
      const tgt = e.target?.stem ?? e.target;
      if (src === focusStem) litSet.add(tgt);
      if (tgt === focusStem) litSet.add(src);
    }
  }

  // Draw edges
  for (const e of edges) {
    const src = typeof e.source === 'object' ? e.source : { x: 0, y: 0, stem: e.source };
    const tgt = typeof e.target === 'object' ? e.target : { x: 0, y: 0, stem: e.target };
    if (src.x == null || tgt.x == null) continue;

    const isLit = litSet && litSet.has(src.stem) && litSet.has(tgt.stem);
    const isDim = (dimSet && (dimSet.has(src.stem) || dimSet.has(tgt.stem))) ||
                  (litSet && !isLit);

    ctx.beginPath();
    ctx.moveTo(src.x, src.y);
    ctx.lineTo(tgt.x, tgt.y);
    ctx.strokeStyle = isLit  ? 'rgba(0,230,118,0.7)'
                    : isDim  ? 'rgba(30,46,30,0.15)'
                             : 'rgba(30,46,30,0.45)';
    ctx.lineWidth   = (isLit ? 1.5 : 0.8) / t.k;
    ctx.stroke();
  }

  // Draw nodes
  for (const n of nodes) {
    if (n.x == null) continue;

    const r      = nodeRadius(n);
    const col    = NODE_COLOUR[n.folder] || '#888';
    const isHov  = hov && hov.stem  === n.stem;
    const isSel  = sel && sel.stem  === n.stem;
    const isDim  = (dimSet && dimSet.has(n.stem)) ||
                   (litSet && !litSet.has(n.stem));

    // Always reset shadow state at the start of each node draw
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur  = 0;
    ctx.globalAlpha = isDim ? 0.11 : 1;

    // Glow
    if (isHov || isSel) {
      ctx.shadowColor = isSel ? '#00e5ff' : col;
      ctx.shadowBlur  = (isSel ? 20 : 12) / t.k;
    }

    // Circle fill
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle   = col;
    ctx.globalAlpha = isDim ? 0.11 : (isHov || isSel ? 1 : 0.82);
    ctx.fill();

    // Reset shadow after glow fill
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur  = 0;

    // Selection corner-bracket box
    if (isSel) {
      const br = r + 7;
      const bl = br * 0.42;
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth   = 1.2 / t.k;
      ctx.globalAlpha = 0.88;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(n.x - br, n.y - br + bl); ctx.lineTo(n.x - br, n.y - br); ctx.lineTo(n.x - br + bl, n.y - br);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(n.x + br - bl, n.y - br); ctx.lineTo(n.x + br, n.y - br); ctx.lineTo(n.x + br, n.y - br + bl);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(n.x + br, n.y + br - bl); ctx.lineTo(n.x + br, n.y + br); ctx.lineTo(n.x + br - bl, n.y + br);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(n.x - br + bl, n.y + br); ctx.lineTo(n.x - br, n.y + br); ctx.lineTo(n.x - br, n.y + br - bl);
      ctx.stroke();
    }

    // Label (visible for hubs, hovered, selected)
    const showLabel = n.degree > 14 || isHov || isSel;
    if (showLabel) {
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = isDim ? 0.11 : (isHov || isSel ? 1 : 0.45);
      ctx.fillStyle   = isHov || isSel ? '#c8d8c8' : '#3a5a3a';
      const fs        = Math.max(7, 9 / t.k);
      ctx.font        = `${fs}px "Courier New", monospace`;
      ctx.textAlign   = 'center';
      const label = n.title.length > 22 ? n.title.slice(0, 21) + '…' : n.title;
      ctx.fillText(label, n.x, n.y + r + 12 / t.k);
    }

    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function updateStatsPanel() {
  if (!STATE.graphData) return;
  const N = STATE.graphData.nodes.length;
  const E = STATE.graphData.edges.length;
  const density = N > 1 ? (E / (N * (N - 1))).toFixed(4) : '0.0000';
  document.getElementById('stats-text').innerHTML =
    `<span>${N}</span> noeuds &nbsp;·&nbsp; <span>${E}</span> connexions<br>densité&nbsp;<span>${density}</span>`;
}

function updateNodeInfo(node) {
  const el = document.getElementById('node-info');
  if (!node) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');

  document.getElementById('ni-title').textContent = node.title || node.stem;
  document.getElementById('ni-folder').textContent =
    FOLDER_DISPLAY[node.folder] || node.folder || 'Root';

  const edges = STATE.graphData.edges;
  const inD   = edges.filter(e => (e.target?.stem ?? e.target) === node.stem).length;
  const outD  = edges.filter(e => (e.source?.stem ?? e.source) === node.stem).length;
  document.getElementById('ni-stats').innerHTML =
    `<span>${outD}</span> sortants &nbsp;·&nbsp; <span>${inD}</span> entrants`;

  const tags = (node.tags || []).map(t => `<span class="tag-pill">#${t}</span>`).join('');
  document.getElementById('ni-tags').innerHTML = tags;
}

/* ============================================================
   5. GESTURE ENGINE (MediaPipe Hands)
   ============================================================ */

const GS = {
  // EMA-smoothed cursor position (viewport px)
  cx: 0, cy: 0,
  SMOOTH: 0.20,

  // Pinch state
  pinching:       false,
  pinchStartMs:   0,
  pinchStartNode: null,   // stem at pinch start, or null (empty space)
  PINCH_DIST_PX:  46,
  PINCH_SHORT_MS: 550,    // < this → select; >= this → drag / pan

  // Pan-via-pinch
  panStartVpX: 0, panStartVpY: 0,
  panStartTx: 0,  panStartTy: 0,

  // Two-finger
  prevTwoCxN: null, prevTwoCyN: null,
  prevSpread: null,

  // Hover snap distance
  HOVER_DIST_PX: 58,
};

function onFrame(results) {
  const handCanvas = document.getElementById('hand-canvas');
  const ctx = handCanvas.getContext('2d');
  ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);

  const lms   = results.multiHandLandmarks;
  const indEl = document.getElementById('gesture-indicator');
  const W = handCanvas.width;
  const H = handCanvas.height;

  if (!lms || lms.length === 0) {
    hideCursor();
    indEl.textContent = '';
    clearGestureState();
    return;
  }

  const lm = lms[0];

  // Draw skeleton on hand-canvas
  if (typeof drawConnectors !== 'undefined') {
    drawConnectors(ctx, lm, HAND_CONNECTIONS,
      { color: 'rgba(0,230,118,0.55)', lineWidth: 1.5 });
    drawLandmarks(ctx, lm,
      { color: 'rgba(0,229,255,0.65)', lineWidth: 1, radius: 2 });
  }

  const thumbTip  = lm[4];
  const indexTip  = lm[8];
  const middleTip = lm[12];
  const indexMcp  = lm[5];
  const middleMcp = lm[9];

  const indexExt  = indexTip.y  < indexMcp.y  - 0.02;
  const middleExt = middleTip.y < middleMcp.y - 0.02;

  // Flip x for mirror-image: landmarks are 0..1 left-to-right in camera space
  // The video is CSS-mirrored, so we flip x here too
  const ixPx = (1 - indexTip.x) * W;
  const iyPx = indexTip.y * H;

  const pinchDist = Math.hypot(
    (thumbTip.x - indexTip.x) * W,
    (thumbTip.y - indexTip.y) * H
  );
  const isPinching = pinchDist < GS.PINCH_DIST_PX;

  // ---- Two-finger (index + middle extended) ----
  if (indexExt && middleExt) {
    hideCursor();
    handleTwoFinger(indexTip, middleTip, W, H, indEl);
    if (GS.pinching) handlePinchRelease();
    GS.pinching = false; GS.pinchStartMs = 0; GS.pinchStartNode = null;
    return;
  }
  resetTwoFinger();

  // ---- No finger extended ----
  if (!indexExt) {
    hideCursor();
    indEl.textContent = '';
    if (GS.pinching) handlePinchRelease();
    GS.pinching = false;
    return;
  }

  // ---- Index finger only ----
  GS.cx += GS.SMOOTH * (ixPx - GS.cx);
  GS.cy += GS.SMOOTH * (iyPx - GS.cy);
  showCursor(GS.cx, GS.cy, isPinching);

  // Hover snap
  const nearNode = findNearestNode(GS.cx, GS.cy);
  if (nearNode !== STATE.hoveredNode) {
    STATE.hoveredNode = nearNode;
    updateNodeInfo(STATE.selectedNode || nearNode);
    drawGraph();
  }

  // Pinch start
  if (isPinching && !GS.pinching) {
    GS.pinching       = true;
    GS.pinchStartMs   = Date.now();
    GS.pinchStartNode = nearNode ? nearNode.stem : null;
    const t         = STATE.transform || d3.zoomIdentity;
    GS.panStartVpX  = GS.cx;
    GS.panStartVpY  = GS.cy;
    GS.panStartTx   = t.x;
    GS.panStartTy   = t.y;
  }

  // Pinch hold
  if (isPinching && GS.pinching) {
    const elapsed = Date.now() - GS.pinchStartMs;

    if (GS.pinchStartNode && elapsed > GS.PINCH_SHORT_MS) {
      // Long pinch on node → drag it
      const node = STATE.graphData.nodes.find(n => n.stem === GS.pinchStartNode);
      if (node) {
        const t = STATE.transform || d3.zoomIdentity;
        node.fx = (GS.cx - t.x) / t.k;
        node.fy = (GS.cy - t.y) / t.k;
        STATE.simulation.alphaTarget(0.3).restart();
        STATE.draggedNode = node;
        drawGraph();
      }
      indEl.textContent = 'DRAG';
    } else if (!GS.pinchStartNode) {
      // Pinch on empty space → pan
      const dx  = GS.cx - GS.panStartVpX;
      const dy  = GS.cy - GS.panStartVpY;
      const cur = STATE.transform || d3.zoomIdentity;
      const newT = d3.zoomIdentity
        .translate(GS.panStartTx + dx, GS.panStartTy + dy)
        .scale(cur.k);
      d3.select(STATE.graphCanvas).call(STATE.zoomBehavior.transform, newT);
      indEl.textContent = 'PAN';
    } else {
      indEl.textContent = elapsed > 300 ? 'HOLD…' : '';
    }
  }

  // Pinch release
  if (!isPinching && GS.pinching) {
    handlePinchRelease();
    GS.pinching = false;
  }

  if (!isPinching) {
    indEl.textContent = nearNode ? nearNode.title.slice(0, 20) : '';
  }
}

function handlePinchRelease() {
  const elapsed = Date.now() - GS.pinchStartMs;

  // Short pinch on node → select it (node info card shown)
  if (GS.pinchStartNode && elapsed < GS.PINCH_SHORT_MS) {
    const node = STATE.graphData.nodes.find(n => n.stem === GS.pinchStartNode);
    if (node) {
      STATE.selectedNode = node;
      updateNodeInfo(node);
      drawGraph();
    }
  }

  // Release dragged node (keep fixed position)
  if (STATE.draggedNode) {
    STATE.simulation.alphaTarget(0);
    STATE.draggedNode = null;
  }

  GS.pinchStartMs   = 0;
  GS.pinchStartNode = null;
}

function handleTwoFinger(indexTip, middleTip, W, H, indEl) {
  const cxN = 1 - (indexTip.x + middleTip.x) / 2;
  const cyN = (indexTip.y + middleTip.y) / 2;
  const spreadPx = Math.hypot(
    (indexTip.x - middleTip.x) * W,
    (indexTip.y - middleTip.y) * H
  );

  if (GS.prevTwoCxN === null) {
    GS.prevTwoCxN = cxN; GS.prevTwoCyN = cyN; GS.prevSpread = spreadPx;
    return;
  }

  const dx = (cxN - GS.prevTwoCxN) * W;
  const dy = (cyN - GS.prevTwoCyN) * H;
  const spreadDelta  = spreadPx / GS.prevSpread;
  const spreadChange = Math.abs(spreadDelta - 1);

  if (spreadChange > 0.018 && GS.prevSpread > 10) {
    // Zoom: pinch/spread changing faster than pan
    d3.select(STATE.graphCanvas).call(STATE.zoomBehavior.scaleBy, spreadDelta, [W / 2, H / 2]);
    indEl.textContent = spreadDelta > 1 ? '+ ZOOM' : '− ZOOM';
  } else if (Math.abs(dx) + Math.abs(dy) > 1.5) {
    // Pan
    const cur  = STATE.transform || d3.zoomIdentity;
    const newT = d3.zoomIdentity.translate(cur.x + dx, cur.y + dy).scale(cur.k);
    d3.select(STATE.graphCanvas).call(STATE.zoomBehavior.transform, newT);
    indEl.textContent = 'PAN';
  }

  GS.prevTwoCxN = cxN; GS.prevTwoCyN = cyN; GS.prevSpread = spreadPx;
}

function resetTwoFinger() {
  GS.prevTwoCxN = null; GS.prevTwoCyN = null; GS.prevSpread = null;
}

function clearGestureState() {
  if (GS.pinching) handlePinchRelease();
  GS.pinching = false;
  resetTwoFinger();
  if (STATE.hoveredNode) {
    STATE.hoveredNode = null;
    updateNodeInfo(STATE.selectedNode);
    drawGraph();
  }
}

function showCursor(x, y, pinching) {
  const c = document.getElementById('cursor');
  c.style.display = 'block';
  c.style.left    = x + 'px';
  c.style.top     = y + 'px';
  c.classList.toggle('pinching', pinching);
}

function hideCursor() {
  document.getElementById('cursor').style.display = 'none';
}

let _toastTimer = null;
function showToast(msg, ms = 1800) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

async function initGestures() {
  const video      = document.getElementById('bg-video');
  const handCanvas = document.getElementById('hand-canvas');

  // Set dimensions to match the viewport (same as graph-canvas)
  handCanvas.width  = window.innerWidth;
  handCanvas.height = window.innerHeight;

  if (typeof Hands === 'undefined') {
    console.warn('MediaPipe Hands not loaded');
    return;
  }

  const hands = new Hands({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.70,
    minTrackingConfidence: 0.60,
  });
  hands.onResults(onFrame);

  if (typeof Camera === 'undefined') return;
  // Use the background video as the camera source at a reasonable resolution
  const cam = new Camera(video, {
    onFrame: async () => { await hands.send({ image: video }); },
    width: 640,
    height: 480,
  });
  try {
    await cam.start();
  } catch (e) {
    console.warn('Camera access denied:', e);
  }
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Configure marked once (v5+ API)
  setupMarked();

  // Keep canvas dimensions in sync with window
  window.addEventListener('resize', () => {
    const gc = document.getElementById('graph-canvas');
    const hc = document.getElementById('hand-canvas');
    gc.width  = hc.width  = window.innerWidth;
    gc.height = hc.height = window.innerHeight;
    drawGraph();
  });

  try {
    await loadNoteList();
    await loadGraph();
  } catch (e) {
    console.error('Graph load failed:', e);
    showToast('Load error: ' + e.message, 6000);
  }

  initGestures().catch(e => console.warn('Gesture init error:', e));

  loadSavedConfluences();
  updateSessionWidget();
  setInterval(updateSessionWidget, 1000);
});

/* ============================================================
   6. PANEL MANAGEMENT
   ============================================================ */

let _pendingConfluences = null;
const SIDE_PANELS = ['confluence-panel', 'journal-panel'];

function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const isHidden = panel.classList.contains('hidden');

  if (isHidden) {
    // Close note reader when opening a tool panel
    document.getElementById('note-reader').classList.add('hidden');
    STATE.currentStem = null;
    // Close sibling panels
    for (const id of SIDE_PANELS) {
      if (id !== panelId) {
        document.getElementById(id)?.classList.add('hidden');
        _setToolBtnActive(id, false);
      }
    }
  }

  panel.classList.toggle('hidden', !isHidden);
  _setToolBtnActive(panelId, isHidden);

  if (isHidden) {
    if (panelId === 'confluence-panel') buildConfluencePanel();
    if (panelId === 'journal-panel')    loadJournal().then(buildJournalPanel);
  }
}
window.togglePanel = togglePanel;

function _setToolBtnActive(panelId, active) {
  const map = { 'confluence-panel': 'btn-confluence', 'journal-panel': 'btn-journal' };
  document.getElementById(map[panelId])?.classList.toggle('active', active);
}

/* ============================================================
   7. SESSION TRACKER  (times in ET = UTC−5 std / UTC−4 DST)
   ============================================================ */

function _isDST(d) {
  const y     = d.getUTCFullYear();
  const start = _nthSun(y, 2, 2);  start.setUTCHours(7);  // 2nd Sun Mar 02:00 ET std
  const end   = _nthSun(y, 10, 1); end.setUTCHours(6);    // 1st Sun Nov 02:00 ET DST
  return d >= start && d < end;
}

function _nthSun(y, month, n) {
  const d = new Date(Date.UTC(y, month, 1));
  while (d.getUTCDay() !== 0) d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCDate(d.getUTCDate() + (n - 1) * 7);
  return d;
}

function _getETNow() {
  const now = new Date();
  const off = _isDST(now) ? -4 : -5;
  return new Date(now.getTime() + off * 3_600_000);
}

// Kill Zones in ET minutes from midnight [start, end)
const ET_SESSIONS = [
  { name: 'Asian KZ',  start: 20*60,    end: 24*60,    color: '#546e7a', po3: 'ACCUMULATION' },
  { name: 'Asian KZ',  start: 0,        end:  2*60,    color: '#546e7a', po3: 'ACCUMULATION' },
  { name: 'London KZ', start:  2*60,    end:  5*60,    color: '#4db6ac', po3: 'MANIPULATION'  },
  { name: 'NY AM KZ',  start:  8*60+30, end: 11*60,    color: '#ffd54f', po3: 'DISTRIBUTION'  },
  { name: 'NY Lunch',  start: 11*60,    end: 13*60+30, color: '#546e7a', po3: ''               },
  { name: 'NY PM KZ',  start: 13*60+30, end: 16*60,    color: '#ff8a65', po3: 'DISTRIBUTION'  },
];

const _SESSION_BOUNDS = [...new Set(ET_SESSIONS.flatMap(s => [s.start, s.end]))].sort((a,b) => a-b);

function _activeSession(etMin) {
  return ET_SESSIONS.find(s => etMin >= s.start && etMin < s.end) || null;
}

function _minsUntilNext(etMin) {
  for (const b of _SESSION_BOUNDS) { if (b > etMin) return b - etMin; }
  return 24*60 - etMin + _SESSION_BOUNDS[0];
}

function updateSessionWidget() {
  const et  = _getETNow();
  const h   = et.getUTCHours(), m = et.getUTCMinutes(), s = et.getUTCSeconds();
  const etMin = h * 60 + m;

  document.getElementById('sw-time').textContent =
    `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ET`;

  const sess   = _activeSession(etMin);
  const sessEl = document.getElementById('sw-session');
  const po3El  = document.getElementById('sw-po3');
  const nextEl = document.getElementById('sw-next');

  if (sess) {
    sessEl.textContent = sess.name;
    sessEl.style.color = sess.color;
    po3El.textContent  = sess.po3 ? `· ${sess.po3}` : '';
    po3El.style.color  = sess.color;
  } else {
    sessEl.textContent = 'OFF SESSION';
    sessEl.style.color = 'var(--text-dim)';
    po3El.textContent  = '';
  }

  const ml  = _minsUntilNext(etMin);
  const hh  = Math.floor(ml / 60), mm = ml % 60;
  nextEl.textContent = `next in ${hh > 0 ? hh + 'h ' : ''}${mm}m`;
}

/* ============================================================
   8. CONFLUENCE CHECKER
   ============================================================ */

const CONFLUENCES = [
  { category: 'Higher Timeframe', items: [
    { id: 'htf-bias',  label: 'HTF market structure bias confirmed' },
    { id: 'htf-zone',  label: 'In HTF premium / discount zone' },
    { id: 'htf-pd',    label: 'At HTF PD array (OB / FVG / Breaker)' },
  ]},
  { category: 'Price Delivery', items: [
    { id: 'fvg',  label: 'Fair Value Gap (FVG) on entry TF' },
    { id: 'ifvg', label: 'Inverse FVG / inverse structure present' },
    { id: 'ob',   label: 'Order Block (OB) alignment' },
    { id: 'vi',   label: 'Volume Imbalance (VI) present' },
  ]},
  { category: 'Liquidity', items: [
    { id: 'liq-swept', label: 'Buy-side / sell-side liquidity swept' },
    { id: 'eq-hl',     label: 'Equal highs / lows tapped' },
    { id: 'stop-hunt', label: 'Stop hunt / liquidity grab confirmed' },
  ]},
  { category: 'Market Structure', items: [
    { id: 'bos',   label: 'BOS confirmed on lower TF' },
    { id: 'choch', label: 'CHoCH on entry TF' },
    { id: 'smt',   label: 'SMT divergence present' },
  ]},
  { category: 'Timing', items: [
    { id: 'kz',      label: 'In Kill Zone (London / NY AM / PM)' },
    { id: 'no-news', label: 'No high-impact news in trade window' },
    { id: 'po3',     label: 'Power of Three phase aligned' },
  ]},
  { category: 'Risk', items: [
    { id: 'stop-valid', label: 'Stop beyond swing low / high' },
    { id: 'min-rr',     label: 'Minimum 2R target available' },
    { id: 'size',       label: 'Position size within 1% risk' },
  ]},
];

const cfState = {};

function loadSavedConfluences() {
  try { Object.assign(cfState, JSON.parse(localStorage.getItem('ict-cf') || '{}')); } catch {}
}

function _saveCf() { localStorage.setItem('ict-cf', JSON.stringify(cfState)); }

function buildConfluencePanel() {
  const body = document.getElementById('confluence-body');
  if (!body) return;
  let html = '';
  for (const cat of CONFLUENCES) {
    html += `<div class="cf-category"><div class="cf-cat-title">${_esc(cat.category)}</div>`;
    for (const item of cat.items) {
      const on = !!cfState[item.id];
      html += `<div class="cf-item${on?' checked':''}" onclick="toggleConfluence('${item.id}')">` +
              `<div class="cf-checkbox">${on ? '&#10003;' : ''}</div>` +
              `<div class="cf-label">${_esc(item.label)}</div></div>`;
    }
    html += '</div>';
  }
  body.innerHTML = html;
  _updateCfScore();
}

function toggleConfluence(id) {
  cfState[id] = !cfState[id];
  buildConfluencePanel();
  _saveCf();
}
window.toggleConfluence = toggleConfluence;

function clearConfluences() {
  for (const k of Object.keys(cfState)) cfState[k] = false;
  buildConfluencePanel();
  _saveCf();
}
window.clearConfluences = clearConfluences;

function _updateCfScore() {
  const total   = CONFLUENCES.reduce((a,c) => a + c.items.length, 0);
  const checked = Object.values(cfState).filter(Boolean).length;
  const pct     = Math.round(checked / total * 100);
  const el      = document.getElementById('confluence-score');
  if (el) el.innerHTML = `Score: <span class="score-val">${checked}/${total}</span> (${pct}%)`;
}

function _getCheckedLabels() {
  return CONFLUENCES.flatMap(c => c.items).filter(i => cfState[i.id]).map(i => i.label);
}

function saveToJournal() {
  _pendingConfluences = _getCheckedLabels().join('; ');
  togglePanel('journal-panel');
}
window.saveToJournal = saveToJournal;

/* ============================================================
   9. TRADING JOURNAL
   ============================================================ */

let _journalEntries = [];
let _jfOpen = true;

async function loadJournal() {
  try {
    const res = await fetch('/api/journal');
    _journalEntries = await res.json();
  } catch { _journalEntries = []; }
}

function buildJournalPanel() {
  const body = document.getElementById('journal-body');
  if (!body) return;

  const et      = _getETNow();
  const etMin   = et.getUTCHours() * 60 + et.getUTCMinutes();
  const sess    = _activeSession(etMin);
  const sessVal = sess ? sess.name : '';
  const now     = new Date();
  const iso     = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const sessOpts = ['Asian KZ', 'London KZ', 'NY AM KZ', 'NY PM KZ']
    .map(v => `<option value="${v}"${v===sessVal?' selected':''}>${v}</option>`).join('');

  body.innerHTML = `
<div class="jf-section">
  <div class="jf-toggle${_jfOpen?'':' collapsed'}" id="jf-toggle" onclick="toggleJournalForm()">
    <span class="jf-toggle-title">+ Log New Trade</span>
    <span class="jf-toggle-icon" id="jf-icon">${_jfOpen ? '&#9662;' : '&#9656;'}</span>
  </div>
  <div class="jf-form-content${_jfOpen?'':' collapsed'}" id="jf-form-content">
    <form id="journal-form" onsubmit="submitJournalEntry(event)">
      <div class="jf-row">
        <div class="jf-field"><label class="jf-label">Date / Time</label>
          <input type="datetime-local" class="jf-input" id="jf-dt" value="${iso}" required></div>
        <div class="jf-field"><label class="jf-label">Instrument</label>
          <input type="text" class="jf-input" id="jf-instr" placeholder="NQ, ES, EURUSD…" required></div>
      </div>
      <div class="jf-row">
        <div class="jf-field"><label class="jf-label">Session</label>
          <select class="jf-select" id="jf-sess"><option value="">— select —</option>${sessOpts}</select></div>
        <div class="jf-field"><label class="jf-label">Direction</label>
          <select class="jf-select" id="jf-dir"><option value="Long">Long</option><option value="Short">Short</option></select></div>
      </div>
      <div class="jf-row">
        <div class="jf-field"><label class="jf-label">Entry</label>
          <input type="number" class="jf-input" id="jf-entry" step="any" placeholder="0.00"></div>
        <div class="jf-field"><label class="jf-label">Stop Loss</label>
          <input type="number" class="jf-input" id="jf-sl" step="any" placeholder="0.00"></div>
      </div>
      <div class="jf-row">
        <div class="jf-field"><label class="jf-label">Take Profit</label>
          <input type="number" class="jf-input" id="jf-tp" step="any" placeholder="0.00"></div>
        <div class="jf-field"><label class="jf-label">Exit Price</label>
          <input type="number" class="jf-input" id="jf-exit" step="any" placeholder="0.00"></div>
      </div>
      <div class="jf-row">
        <div class="jf-field"><label class="jf-label">Result</label>
          <select class="jf-select" id="jf-result">
            <option value="Win">Win</option><option value="Loss">Loss</option><option value="BE">Breakeven</option>
          </select></div>
        <div class="jf-field"><label class="jf-label">R:R Achieved</label>
          <input type="number" class="jf-input" id="jf-rr" step="0.1" min="0" placeholder="2.0"></div>
      </div>
      <div class="jf-row full">
        <div class="jf-field"><label class="jf-label">Confluences Used</label>
          <input type="text" class="jf-input" id="jf-cf" placeholder="FVG, OB, London KZ…"></div>
      </div>
      <div class="jf-row full">
        <div class="jf-field"><label class="jf-label">Notes</label>
          <textarea class="jf-textarea" id="jf-notes" placeholder="Rationale, emotions, lessons…"></textarea></div>
      </div>
      <button type="submit" class="jf-submit">LOG TRADE</button>
    </form>
  </div>
</div>
<div id="jl-section">
  <div class="jl-header">Journal Entries</div>
  <div id="jl-stats"></div>
  <div id="jl-list"></div>
</div>`;

  if (_pendingConfluences !== null) {
    const cfEl = document.getElementById('jf-cf');
    if (cfEl) cfEl.value = _pendingConfluences;
    _pendingConfluences = null;
  }

  _renderJournalList();
}

function toggleJournalForm() {
  _jfOpen = !_jfOpen;
  document.getElementById('jf-form-content')?.classList.toggle('collapsed', !_jfOpen);
  const icon = document.getElementById('jf-icon');
  if (icon) icon.innerHTML = _jfOpen ? '&#9662;' : '&#9656;';
  document.getElementById('jf-toggle')?.classList.toggle('collapsed', !_jfOpen);
}
window.toggleJournalForm = toggleJournalForm;

async function submitJournalEntry(e) {
  e.preventDefault();
  const g = id => document.getElementById(id)?.value || '';
  const entry = {
    datetime: g('jf-dt'), instrument: g('jf-instr'), session: g('jf-sess'),
    direction: g('jf-dir'), entry: g('jf-entry'), sl: g('jf-sl'),
    tp: g('jf-tp'), exit: g('jf-exit'), result: g('jf-result'),
    rr: g('jf-rr'), confluences: g('jf-cf'), notes: g('jf-notes'),
  };
  try {
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error();
    const saved = await res.json();
    _journalEntries.unshift(saved);
    _renderJournalList();
    document.getElementById('journal-form')?.reset();
    const now = new Date();
    const iso = new Date(now - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const dtEl = document.getElementById('jf-dt');
    if (dtEl) dtEl.value = iso;
    showToast('Trade logged', 2000);
    if (_jfOpen) toggleJournalForm();
  } catch { showToast('Error saving trade', 3000); }
}
window.submitJournalEntry = submitJournalEntry;

async function deleteJournalEntry(id) {
  try {
    await fetch(`/api/journal/delete/${id}`, { method: 'POST' });
    _journalEntries = _journalEntries.filter(e => e.id !== id);
    _renderJournalList();
    showToast('Entry deleted', 1500);
  } catch { showToast('Error deleting', 3000); }
}
window.deleteJournalEntry = deleteJournalEntry;

function _renderJournalList() {
  const listEl  = document.getElementById('jl-list');
  const statsEl = document.getElementById('jl-stats');
  if (!listEl) return;

  const total  = _journalEntries.length;
  const wins   = _journalEntries.filter(e => e.result === 'Win').length;
  const losses = _journalEntries.filter(e => e.result === 'Loss').length;
  const be     = _journalEntries.filter(e => e.result === 'BE').length;
  const wr     = total ? Math.round(wins / total * 100) : 0;
  const avgRR  = total
    ? (_journalEntries.reduce((s,e) => s + (parseFloat(e.rr)||0), 0) / total).toFixed(2)
    : '—';

  if (statsEl) statsEl.innerHTML = `
    <div class="jl-stats">
      <div class="jl-stat">Trades: <span class="sv neutral">${total}</span></div>
      <div class="jl-stat">Win Rate: <span class="sv ${wr>=50?'win':'loss'}">${wr}%</span></div>
      <div class="jl-stat">W/L/BE: <span class="sv win">${wins}</span>/<span class="sv loss">${losses}</span>/<span class="sv neutral">${be}</span></div>
      <div class="jl-stat">Avg R:R: <span class="sv neutral">${avgRR}</span></div>
    </div>`;

  if (!total) { listEl.innerHTML = '<div class="jl-empty">No trades logged yet.</div>'; return; }

  listEl.innerHTML = _journalEntries.map(e => {
    const rc = e.result==='Win' ? 'win' : e.result==='Loss' ? 'loss' : 'be';
    const dc = e.direction==='Long' ? 'var(--accent-green)' : 'var(--accent-red)';
    const dt = e.datetime
      ? new Date(e.datetime).toLocaleString([], { dateStyle:'short', timeStyle:'short' })
      : '—';
    return `
<div class="je-card ${rc}">
  <div class="je-top">
    <span class="je-instrument">${_esc(e.instrument||'—')}</span>
    <div style="display:flex;align-items:center;gap:8px">
      <span class="je-result ${rc}">${_esc(e.result||'BE')}</span>
      <button class="je-delete" onclick="deleteJournalEntry('${e.id}')">&#x2715;</button>
    </div>
  </div>
  <div class="je-meta">
    <span>${dt}</span>
    <span style="color:${dc}">${_esc(e.direction||'')}</span>
    ${e.session ? `<span>${_esc(e.session)}</span>` : ''}
    ${e.rr      ? `<span>R:R ${_esc(e.rr)}</span>`  : ''}
  </div>
  ${(e.entry||e.sl||e.exit) ? `
  <div class="je-prices">
    ${e.entry ? `Entry:<span>${_esc(e.entry)}</span>` : ''}
    ${e.sl    ? `SL:<span>${_esc(e.sl)}</span>`       : ''}
    ${e.tp    ? `TP:<span>${_esc(e.tp)}</span>`       : ''}
    ${e.exit  ? `Exit:<span>${_esc(e.exit)}</span>`   : ''}
  </div>` : ''}
  ${e.confluences ? `<div class="je-confluences">${_esc(e.confluences)}</div>` : ''}
  ${e.notes       ? `<div class="je-notes">${_esc(e.notes)}</div>`             : ''}
</div>`;
  }).join('');
}

function _esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
