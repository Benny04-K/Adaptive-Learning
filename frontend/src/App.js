import { useState, useRef, useEffect } from "react";

// ─── API Base URL ─────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8080/api";

// ─── Constants ────────────────────────────────────────────────────────────────
const COLORS = {
  assessment: { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8" },
  unit:       { bg: "#F0FDF4", border: "#22C55E", text: "#15803D" },
  start:      { bg: "#ECFDF5", border: "#10B981", text: "#065F46" },
  end:        { bg: "#F9FAFB", border: "#6B7280", text: "#374151" },
};

const METRICS_BY_TYPE = {
  assessment: ["completion", "passed", "score", "score_range"],
  unit:       ["completion", "time_spent_minutes", "percentage_completion"],
};

const OPERATOR_OPTIONS = [
  { value: "eq",  label: "= eq"  },
  { value: "ne",  label: "≠ ne"  },
  { value: "gt",  label: "> gt"  },
  { value: "gte", label: "≥ gte" },
  { value: "lt",  label: "< lt"  },
  { value: "lte", label: "≤ lte" },
];

function genId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Node Icon ────────────────────────────────────────────────────────────────
function NodeIcon({ type, size = 14 }) {
  const color = COLORS[type]?.border || "#6B7280";
  if (type === "start")
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={color} />
        <polygon points="6,5 12,8 6,11" fill="white" />
      </svg>
    );
  if (type === "end")
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="2" />
        <circle cx="8" cy="8" r="3" fill={color} />
      </svg>
    );
  if (type === "assessment")
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <rect x="2" y="1" width="12" height="14" rx="2" fill={color} />
        <rect x="4" y="5" width="8" height="1.5" rx=".75" fill="white" />
        <rect x="4" y="8" width="6" height="1.5" rx=".75" fill="white" />
        <rect x="4" y="11" width="4" height="1.5" rx=".75" fill="white" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" stroke={color} strokeWidth="2" />
      <path d="M5 8h6M8 5v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Left Panel: Component Card ───────────────────────────────────────────────
function ComponentCard({ component, onDragStart }) {
  const c = COLORS[component.type] || COLORS.unit;
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, component)}
      style={{
        background: "#fff",
        border: "0.5px solid #E2E8F0",
        borderRadius: 8,
        padding: "10px 12px",
        cursor: "grab",
        marginBottom: 8,
        userSelect: "none",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.border)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <NodeIcon type={component.type} size={14} />
        <span style={{ fontSize: 13, fontWeight: 500, color: "#0F172A", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {component.title}
        </span>
        <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: c.bg, color: c.text, border: `0.5px solid ${c.border}`, flexShrink: 0 }}>
          {component.type}
        </span>
      </div>
      <p style={{ fontSize: 12, color: "#64748B", margin: 0, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {component.shortDescription}
      </p>
      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>⏱ {component.approximateDurationMinutes} min</div>
    </div>
  );
}

// ─── Canvas Node ──────────────────────────────────────────────────────────────
function CanvasNode({ node, isSelected, onMouseDown, onPortMouseDown }) {
  const c = COLORS[node.type] || COLORS.unit;
  return (
    <div
      style={{
        position: "absolute",
        left: node.position.x,
        top: node.position.y,
        width: 200,
        background: c.bg,
        border: `1.5px solid ${isSelected ? c.border : c.border + "99"}`,
        borderRadius: 10,
        padding: "10px 12px",
        cursor: "grab",
        boxSizing: "border-box",
        zIndex: isSelected ? 10 : 5,
        outline: isSelected ? `3px solid ${c.border}33` : "none",
        outlineOffset: 2,
      }}
      onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, node.id); }}
    >
      {/* Incoming port — top (all except start) */}
      {node.type !== "start" && (
        <div
          title="Target port"
          style={{ position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)", width: 12, height: 12, borderRadius: "50%", background: "#CBD5E1", border: "2px solid white", zIndex: 20, cursor: "crosshair" }}
          onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, node.id); }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <NodeIcon type={node.type} size={14} />
        <span style={{ fontSize: 13, fontWeight: 500, color: c.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {node.label}
        </span>
      </div>
      {node.config?.approximateDurationMinutes > 0 && (
        <div style={{ fontSize: 11, color: "#94A3B8" }}>⏱ {node.config.approximateDurationMinutes} min</div>
      )}

      {/* Outgoing port — bottom (all except end) */}
      {node.type !== "end" && (
        <div
          title="Drag to connect"
          style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: c.border, border: "2px solid white", zIndex: 20, cursor: "crosshair" }}
          onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, node.id); }}
        />
      )}
    </div>
  );
}

// ─── SVG Edge Layer ───────────────────────────────────────────────────────────
function EdgeLayer({ nodes, edges, selectedEdgeId, onSelectEdge, connectingFrom, mousePos }) {
  function centre(nid) {
    const n = nodes.find((x) => x.id === nid);
    return n ? { x: n.position.x + 100, y: n.position.y + 40 } : { x: 0, y: 0 };
  }
  function cubic(sx, sy, tx, ty) {
    const mid = sy + (ty - sy) * 0.5;
    return `M${sx},${sy} C${sx},${mid} ${tx},${mid} ${tx},${ty}`;
  }
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 2 }}>
      <defs>
        <marker id="arr"     markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#94A3B8" /></marker>
        <marker id="arr-sel" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#3B82F6" /></marker>
        <marker id="arr-pre" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#F59E0B" /></marker>
      </defs>

      {edges.map((edge) => {
        const s   = centre(edge.sourceNodeId);
        const t   = centre(edge.targetNodeId);
        const sel = selectedEdgeId === edge.id;
        const mx  = (s.x + t.x) / 2;
        const my  = (s.y + 40 + t.y) / 2;
        const d   = cubic(s.x, s.y + 40, t.x, t.y);
        return (
          <g key={edge.id} style={{ pointerEvents: "all", cursor: "pointer" }} onClick={() => onSelectEdge(edge.id)}>
            <path d={d} stroke="transparent" strokeWidth={14} fill="none" />
            <path d={d} stroke={sel ? "#3B82F6" : "#CBD5E1"} strokeWidth={sel ? 2 : 1.5} fill="none"
              strokeDasharray={edge.isDefault ? "none" : "5,4"}
              markerEnd={sel ? "url(#arr-sel)" : "url(#arr)"} />
            {edge.label && (
              <g>
                <rect x={mx - 38} y={my - 10} width={76} height={20} rx={4}
                  fill={sel ? "#EFF6FF" : "white"} stroke={sel ? "#3B82F6" : "#E2E8F0"} strokeWidth={0.5} />
                <text x={mx} y={my + 4} textAnchor="middle" fontSize={10}
                  fill={sel ? "#1D4ED8" : "#64748B"} fontFamily="sans-serif">
                  {edge.label.length > 16 ? edge.label.slice(0, 16) + "…" : edge.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {connectingFrom && mousePos && (() => {
        const s = centre(connectingFrom.nodeId);
        return (
          <path d={cubic(s.x, s.y + 40, mousePos.x, mousePos.y)}
            stroke="#F59E0B" strokeWidth={1.5} fill="none"
            strokeDasharray="6,4" markerEnd="url(#arr-pre)" />
        );
      })()}
    </svg>
  );
}

// ─── Rule Editor ──────────────────────────────────────────────────────────────
function RuleEditor({ rule, nodes, onChange, onDelete }) {
  const srcNode = nodes.find((n) => n.id === rule.sourceNodeId);
  const srcType = srcNode?.type === "assessment" ? "assessment" : "unit";
  const metrics = METRICS_BY_TYPE[srcType] || [];
  const isRange = rule.operator === "between" || rule.metric === "score_range";
  const isBool  = ["completion", "passed"].includes(rule.metric);

  return (
    <div style={{ background: "#F8FAFC", border: "0.5px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#475569" }}>Condition rule</span>
        <button onClick={onDelete} style={{ fontSize: 11, color: "#EF4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Remove</button>
      </div>

      <div style={{ marginBottom: 6 }}>
        <label style={lbl}>Source node</label>
        <select value={rule.sourceNodeId} onChange={(e) => onChange({ ...rule, sourceNodeId: e.target.value })} style={{ width: "100%", fontSize: 12 }}>
          {nodes.filter((n) => n.type !== "start" && n.type !== "end").map((n) => (
            <option key={n.id} value={n.id}>{n.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 6 }}>
        <label style={lbl}>Metric</label>
        <select value={rule.metric} onChange={(e) => onChange({ ...rule, metric: e.target.value, value: undefined, range: undefined })} style={{ width: "100%", fontSize: 12 }}>
          {metrics.map((m) => <option key={m} value={m}>{m.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {isBool && (
        <div style={{ marginBottom: 6 }}>
          <label style={lbl}>Value</label>
          <select value={String(rule.value ?? "true")} onChange={(e) => onChange({ ...rule, operator: "eq", value: e.target.value === "true" })} style={{ width: "100%", fontSize: 12 }}>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div>
      )}

      {!isBool && !isRange && (
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 6 }}>
          <div>
            <label style={lbl}>Operator</label>
            <select value={rule.operator} onChange={(e) => onChange({ ...rule, operator: e.target.value })} style={{ width: "100%", fontSize: 12 }}>
              {OPERATOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Value</label>
            <input type="number" value={rule.value ?? ""} onChange={(e) => onChange({ ...rule, value: Number(e.target.value) })} style={{ width: "100%", fontSize: 12, boxSizing: "border-box" }} />
          </div>
        </div>
      )}

      {isRange && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <div>
            <label style={lbl}>Min</label>
            <input type="number" value={rule.range?.min ?? ""} onChange={(e) => onChange({ ...rule, operator: "between", range: { ...rule.range, min: Number(e.target.value) } })} style={{ width: "100%", fontSize: 12, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={lbl}>Max</label>
            <input type="number" value={rule.range?.max ?? ""} onChange={(e) => onChange({ ...rule, operator: "between", range: { ...rule.range, max: Number(e.target.value) } })} style={{ width: "100%", fontSize: 12, boxSizing: "border-box" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Properties Panel ─────────────────────────────────────────────────────────
function PropertiesPanel({ selected, nodes, edges, onUpdateNode, onUpdateEdge, onDeleteSelected }) {
  if (!selected) {
    return (
      <div style={{ padding: "32px 16px", textAlign: "center", color: "#94A3B8" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>☝️</div>
        <div style={{ fontSize: 13 }}>Select a node or edge to edit properties</div>
      </div>
    );
  }

  if (selected.type === "node") {
    const node = nodes.find((n) => n.id === selected.id);
    if (!node) return null;
    const c = COLORS[node.type] || COLORS.unit;
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <NodeIcon type={node.type} size={16} />
            <span style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>Node</span>
          </div>
          {node.type !== "start" && node.type !== "end" && (
            <button onClick={onDeleteSelected} style={{ fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>🗑 Delete</button>
          )}
        </div>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: c.bg, color: c.text, border: `0.5px solid ${c.border}`, display: "inline-block", marginBottom: 14 }}>{node.type}</span>

        <label style={lbl}>Label</label>
        <input value={node.label} onChange={(e) => onUpdateNode(node.id, { label: e.target.value })} style={inp} />

        <label style={lbl}>Description</label>
        <textarea value={node.description || ""} onChange={(e) => onUpdateNode(node.id, { description: e.target.value })} rows={3} placeholder="Enter description…" style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} />

        {(node.type === "unit" || node.type === "assessment") && (
          <>
            <label style={lbl}>Duration (min)</label>
            <input type="number" value={node.config?.approximateDurationMinutes || ""} onChange={(e) => onUpdateNode(node.id, { config: { ...node.config, approximateDurationMinutes: Number(e.target.value) } })} style={inp} />
          </>
        )}

        {node.type === "assessment" && (
          <>
            <label style={lbl}>Max score</label>
            <input type="number" value={node.config?.assessment?.maxScore || ""} onChange={(e) => onUpdateNode(node.id, { config: { ...node.config, assessment: { ...node.config?.assessment, maxScore: Number(e.target.value) } } })} style={inp} />
            <label style={lbl}>Passing score</label>
            <input type="number" value={node.config?.assessment?.passingScore || ""} onChange={(e) => onUpdateNode(node.id, { config: { ...node.config, assessment: { ...node.config?.assessment, passingScore: Number(e.target.value) } } })} style={inp} />
          </>
        )}
      </div>
    );
  }

  if (selected.type === "edge") {
    const edge = edges.find((e) => e.id === selected.id);
    if (!edge) return null;
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>Connection</span>
          <button onClick={onDeleteSelected} style={{ fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>🗑 Delete</button>
        </div>

        <label style={lbl}>Label</label>
        <input value={edge.label || ""} onChange={(e) => onUpdateEdge(edge.id, { label: e.target.value })} placeholder="e.g. Score below passing" style={inp} />

        <label style={lbl}>Priority</label>
        <input type="number" min={1} value={edge.priority || 1} onChange={(e) => onUpdateEdge(edge.id, { priority: Number(e.target.value) })} style={inp} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <input type="checkbox" id="isDefault" checked={edge.isDefault || false} onChange={(e) => onUpdateEdge(edge.id, { isDefault: e.target.checked })} />
          <label htmlFor="isDefault" style={{ fontSize: 12, color: "#64748B" }}>Default connection</label>
        </div>

        <div style={{ borderTop: "0.5px solid #E2E8F0", paddingTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>Conditions</span>
            <select value={edge.conditions?.operator || "AND"} onChange={(e) => onUpdateEdge(edge.id, { conditions: { ...edge.conditions, operator: e.target.value } })} style={{ fontSize: 12 }}>
              <option value="AND">ALL match (AND)</option>
              <option value="OR">ANY match (OR)</option>
            </select>
          </div>

          {(edge.conditions?.rules || []).map((rule, idx) => (
            <RuleEditor
              key={rule.id}
              rule={rule}
              nodes={nodes}
              onChange={(updated) => {
                const rules = [...(edge.conditions?.rules || [])];
                rules[idx] = updated;
                onUpdateEdge(edge.id, { conditions: { ...edge.conditions, rules } });
              }}
              onDelete={() => {
                const rules = (edge.conditions?.rules || []).filter((_, i) => i !== idx);
                onUpdateEdge(edge.id, { conditions: { ...edge.conditions, rules } });
              }}
            />
          ))}

          <button
            onClick={() => {
              const first = nodes.find((n) => n.type !== "start" && n.type !== "end");
              const srcType = first?.type || "assessment";
              const newRule = { id: genId("rule"), sourceType: srcType, sourceNodeId: first?.id || "", metric: METRICS_BY_TYPE[srcType][0], operator: "eq", value: true };
              onUpdateEdge(edge.id, { conditions: { ...edge.conditions, rules: [...(edge.conditions?.rules || []), newRule] } });
            }}
            style={{ width: "100%", padding: "7px", fontSize: 12, borderRadius: 6, border: "0.5px dashed #CBD5E1", background: "none", cursor: "pointer", color: "#64748B" }}
          >
            + Add condition
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Save Modal ───────────────────────────────────────────────────────────────
function SaveModal({ isOpen, onClose, onSave, loading }) {
  const [name,   setName]   = useState("My Learning Path");
  const [desc,   setDesc]   = useState("");
  const [status, setStatus] = useState("draft");
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 24, width: 400, border: "0.5px solid #E2E8F0" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 500 }}>Save learning path</h3>
        <label style={lbl}>Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inp} />
        <label style={lbl}>Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} />
        <label style={lbl}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...inp, marginBottom: 20 }}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={btnOutline}>Cancel</button>
          <button
            onClick={() => { if (name.trim()) onSave({ name, description: desc, status }); }}
            disabled={loading}
            style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Load Modal ───────────────────────────────────────────────────────────────
function LoadModal({ isOpen, onClose, paths, onLoad, onDelete, loading }) {
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 24, width: 500, maxHeight: "65vh", overflowY: "auto", border: "0.5px solid #E2E8F0" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 500 }}>Saved learning paths</h3>

        {loading && <p style={{ fontSize: 13, color: "#94A3B8" }}>Loading from server…</p>}

        {!loading && paths.length === 0 && (
          <p style={{ fontSize: 13, color: "#94A3B8" }}>No saved paths yet. Build and save one first.</p>
        )}

        {!loading && paths.map((p) => (
          <div key={p.id} style={{ border: "0.5px solid #E2E8F0", borderRadius: 8, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>
                {p.nodes?.length || 0} nodes · {p.edges?.length || 0} edges ·{" "}
                <span style={{ color: p.status === "published" ? "#15803D" : "#B45309" }}>{p.status}</span>
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>ID: {p.id}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => onLoad(p)} style={btnOutline}>Load</button>
              <button onClick={() => onDelete(p.id)} style={{ ...btnOutline, color: "#EF4444", borderColor: "#FECACA" }}>Delete</button>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button onClick={onClose} style={btnOutline}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const err = toast.type === "error";
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: err ? "#FEF2F2" : "#F0FDF4", border: `0.5px solid ${err ? "#FCA5A5" : "#86EFAC"}`, color: err ? "#991B1B" : "#166534", padding: "10px 20px", borderRadius: 8, fontSize: 13, zIndex: 2000, whiteSpace: "nowrap" }}>
      {err ? "⚠ " : "✓ "}{toast.msg}
    </div>
  );
}

// ─── Shared micro-styles ──────────────────────────────────────────────────────
const lbl        = { fontSize: 12, color: "#64748B", display: "block", marginBottom: 4 };
const inp        = { width: "100%", fontSize: 13, marginBottom: 12, boxSizing: "border-box" };
const btnGhost   = { padding: "7px 14px", fontSize: 12, borderRadius: 6, border: "0.5px solid #E2E8F0",   background: "none",    cursor: "pointer", color: "#64748B" };
const btnOutline = { padding: "7px 14px", fontSize: 12, borderRadius: 6, border: "0.5px solid #CBD5E1",   background: "#fff",    cursor: "pointer", color: "#0F172A" };
const btnPrimary = { padding: "7px 18px", fontSize: 12, borderRadius: 6, border: "none",                  background: "#1D4ED8", cursor: "pointer", color: "#fff", fontWeight: 500 };

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {

  // ── State ──────────────────────────────────────────────────────────────────
  const [components,     setComponents]     = useState([]);         // from GET /api/components
  const [componentsLoading, setComponentsLoading] = useState(true); // left panel loading state

  const [nodes,          setNodes]          = useState([
    { id: "node-start", componentId: "system-start", type: "start", label: "Start Assessment",   position: { x: 320, y: 40  } },
    { id: "node-end",   componentId: "system-end",   type: "end",   label: "Complete Assessment", position: { x: 320, y: 540 } },
  ]);
  const [edges,          setEdges]          = useState([]);
  const [selected,       setSelected]       = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [mousePos,       setMousePos]       = useState(null);
  const [draggingId,     setDraggingId]     = useState(null);
  const [dragOffset,     setDragOffset]     = useState({ x: 0, y: 0 });

  const [showSave,       setShowSave]       = useState(false);
  const [showLoad,       setShowLoad]       = useState(false);
  const [savedPaths,     setSavedPaths]     = useState([]);
  const [saveLoading,    setSaveLoading]    = useState(false);
  const [loadLoading,    setLoadLoading]    = useState(false);

  const [toast,          setToast]          = useState(null);
  const [zoom,           setZoom]           = useState(0.85);

  const canvasRef = useRef(null);

  // ── Fetch components from backend on mount ─────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/components`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setComponents(data.items);
        setComponentsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load components:", err);
        notify("Could not connect to backend at localhost:8080", "error");
        setComponentsLoading(false);
      });
  }, []);

  // ── Helper ─────────────────────────────────────────────────────────────────
  function notify(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Drag from left panel ───────────────────────────────────────────────────
  function handlePanelDragStart(e, component) {
    e.dataTransfer.setData("componentData", JSON.stringify(component));
  }

  function handleCanvasDrop(e) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("componentData");
    if (!raw) return;
    const cmp  = JSON.parse(raw);
    const rect = canvasRef.current.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / zoom - 100;
    const y    = (e.clientY - rect.top)  / zoom - 30;
    const node = {
      id:          genId("node"),
      componentId: cmp.id,
      type:        cmp.type,
      label:       cmp.title,
      position:    { x: Math.max(0, x), y: Math.max(0, y) },
      config: {
        approximateDurationMinutes: cmp.approximateDurationMinutes,
        ...(cmp.type === "assessment"
          ? { assessment: { maxScore: cmp.metadata.assessment.maxScore, passingScore: cmp.metadata.assessment.passingScore } }
          : {}),
      },
    };
    setNodes((prev) => [...prev, node]);
    setSelected({ type: "node", id: node.id });
  }

  // ── Node drag to reposition ────────────────────────────────────────────────
  function handleNodeMouseDown(e, nodeId) {
    if (connectingFrom) return;
    const n    = nodes.find((x) => x.id === nodeId);
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingId(nodeId);
    setDragOffset({ x: e.clientX / zoom - n.position.x - rect.left / zoom, y: e.clientY / zoom - n.position.y - rect.top / zoom });
    setSelected({ type: "node", id: nodeId });
  }

  // ── Port drag to draw edge ─────────────────────────────────────────────────
  function handlePortMouseDown(e, nodeId) {
    e.preventDefault();
    setConnectingFrom({ nodeId });
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom });
  }

  function handleCanvasMouseMove(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx   = (e.clientX - rect.left) / zoom;
    const cy   = (e.clientY - rect.top)  / zoom;
    if (connectingFrom) setMousePos({ x: cx, y: cy });
    if (draggingId)
      setNodes((prev) => prev.map((n) =>
        n.id === draggingId ? { ...n, position: { x: cx - dragOffset.x, y: cy - dragOffset.y } } : n
      ));
  }

  function handleCanvasMouseUp(e) {
    if (connectingFrom) {
      const rect   = canvasRef.current.getBoundingClientRect();
      const cx     = (e.clientX - rect.left) / zoom;
      const cy     = (e.clientY - rect.top)  / zoom;
      const target = nodes.find((n) =>
        n.id !== connectingFrom.nodeId &&
        cx >= n.position.x && cx <= n.position.x + 200 &&
        cy >= n.position.y && cy <= n.position.y + 60
      );
      if (target && !edges.some((ed) => ed.sourceNodeId === connectingFrom.nodeId && ed.targetNodeId === target.id)) {
        const newEdge = { id: genId("edge"), sourceNodeId: connectingFrom.nodeId, targetNodeId: target.id, label: "", priority: 1, isDefault: false, conditions: { operator: "AND", rules: [] } };
        setEdges((prev) => [...prev, newEdge]);
        setSelected({ type: "edge", id: newEdge.id });
      }
      setConnectingFrom(null);
      setMousePos(null);
    }
    setDraggingId(null);
  }

  // ── CRUD helpers ───────────────────────────────────────────────────────────
  function updateNode(id, patch) { setNodes((prev) => prev.map((n) => n.id === id ? { ...n, ...patch } : n)); }
  function updateEdge(id, patch) { setEdges((prev) => prev.map((e) => e.id === id ? { ...e, ...patch } : e)); }

  function deleteSelected() {
    if (!selected) return;
    if (selected.type === "node") {
      const n = nodes.find((x) => x.id === selected.id);
      if (n?.type === "start" || n?.type === "end") return;
      setNodes((prev) => prev.filter((x) => x.id !== selected.id));
      setEdges((prev) => prev.filter((e) => e.sourceNodeId !== selected.id && e.targetNodeId !== selected.id));
    } else {
      setEdges((prev) => prev.filter((e) => e.id !== selected.id));
    }
    setSelected(null);
  }

  // ── POST /api/learning-paths ───────────────────────────────────────────────
  function handleSave(meta) {
    if (nodes.length < 2) { notify("Need at least 2 nodes on the canvas", "error"); return; }
    if (edges.length < 1) { notify("Need at least 1 connection between nodes", "error"); return; }

    const payload = {
      name:        meta.name,
      description: meta.description,
      status:      meta.status,
      version:     1,
      canvas:      { zoom, offsetX: 0, offsetY: 0 },
      nodes,
      edges,
    };

    setSaveLoading(true);
    fetch(`${API_BASE}/learning-paths`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((saved) => {
        setSaveLoading(false);
        setShowSave(false);
        notify(`"${saved.name}" saved to server ✓`);
        console.log("Saved path:", saved);
      })
      .catch((err) => {
        setSaveLoading(false);
        notify("Save failed: " + err.message, "error");
      });
  }

  // ── GET /api/learning-paths (list all) ────────────────────────────────────
  function openLoadModal() {
    setShowLoad(true);
    setLoadLoading(true);
    fetch(`${API_BASE}/learning-paths`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSavedPaths(data);
        setLoadLoading(false);
      })
      .catch((err) => {
        notify("Could not load paths: " + err.message, "error");
        setLoadLoading(false);
      });
  }

  // ── Load a path into the canvas ────────────────────────────────────────────
  function handleLoad(path) {
    setNodes(path.nodes || []);
    setEdges(path.edges || []);
    setZoom(path.canvas?.zoom || 0.85);
    setSelected(null);
    setShowLoad(false);
    notify(`Loaded "${path.name}"`);
  }

  // ── DELETE /api/learning-paths/{id} ───────────────────────────────────────
  function handleDeletePath(id) {
    fetch(`${API_BASE}/learning-paths/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok && res.status !== 204) throw new Error(`Server error: ${res.status}`);
        setSavedPaths((prev) => prev.filter((p) => p.id !== id));
        notify("Path deleted");
      })
      .catch((err) => notify("Delete failed: " + err.message, "error"));
  }

  // ── Load built-in SAT example ──────────────────────────────────────────────
  function loadExample() {
    setNodes([
      { id: "s",  componentId: "system-start",             type: "start",      label: "Start Assessment",        position: { x: 310, y: 20  } },
      { id: "m1", componentId: "cmp-assess-math-1",        type: "assessment", label: "Math Module 1",           position: { x: 260, y: 130 }, config: { approximateDurationMinutes: 35, assessment: { maxScore: 100, passingScore: 50 } } },
      { id: "me", componentId: "cmp-unit-math-2-easy",     type: "unit",       label: "Math Module 2 – Easy",    position: { x: 50,  y: 310 }, config: { approximateDurationMinutes: 35 } },
      { id: "ma", componentId: "cmp-unit-math-2-advanced", type: "unit",       label: "Math Module 2 – Advanced",position: { x: 480, y: 310 }, config: { approximateDurationMinutes: 35 } },
      { id: "r1", componentId: "cmp-assess-reading-1",     type: "assessment", label: "Reading & Comp Module 1", position: { x: 260, y: 470 }, config: { approximateDurationMinutes: 32, assessment: { maxScore: 100, passingScore: 55 } } },
      { id: "e",  componentId: "system-end",               type: "end",        label: "Complete Assessment",     position: { x: 310, y: 620 } },
    ]);
    setEdges([
      { id: "e1", sourceNodeId: "s",  targetNodeId: "m1", label: "Begin",      priority: 1, isDefault: true,  conditions: { operator: "AND", rules: [] } },
      { id: "e2", sourceNodeId: "m1", targetNodeId: "me", label: "Score < 50", priority: 1, isDefault: false, conditions: { operator: "AND", rules: [{ id: "r1", sourceType: "assessment", sourceNodeId: "m1", metric: "score_range", operator: "between", range: { min: 0, max: 49, minInclusive: true, maxInclusive: true } }] } },
      { id: "e3", sourceNodeId: "m1", targetNodeId: "ma", label: "Passed ✓",   priority: 2, isDefault: false, conditions: { operator: "AND", rules: [{ id: "r2", sourceType: "assessment", sourceNodeId: "m1", metric: "passed", operator: "eq", value: true }] } },
      { id: "e4", sourceNodeId: "me", targetNodeId: "r1", label: "",           priority: 1, isDefault: true,  conditions: { operator: "AND", rules: [] } },
      { id: "e5", sourceNodeId: "ma", targetNodeId: "r1", label: "",           priority: 1, isDefault: true,  conditions: { operator: "AND", rules: [] } },
      { id: "e6", sourceNodeId: "r1", targetNodeId: "e",  label: "Complete",   priority: 1, isDefault: true,  conditions: { operator: "AND", rules: [] } },
    ]);
    setSelected(null);
    notify("SAT example loaded");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif", background: "#F8FAFC", overflow: "hidden" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ background: "#fff", borderBottom: "0.5px solid #E2E8F0", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#0F172A" }}>Adaptive Learning Path Builder</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Create conditional quiz flows with adaptive sections</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={loadExample}     style={btnGhost}>Load example</button>
          <button onClick={openLoadModal}   style={btnOutline}>📂 Load</button>
          <button onClick={() => setShowSave(true)} style={btnOutline}>💾 Save draft</button>
          <button onClick={() => setShowSave(true)} style={btnPrimary}>▶ Publish</button>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Left panel ─────────────────────────────────────────────────── */}
        <aside style={{ width: 224, background: "#fff", borderRight: "0.5px solid #E2E8F0", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 14px 10px", borderBottom: "0.5px solid #E2E8F0" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A", marginBottom: 2 }}>Add Components</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Drag or click to add to canvas</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>

            {/* Loading state */}
            {componentsLoading && (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#94A3B8", fontSize: 13 }}>
                Loading components…
              </div>
            )}

            {/* Loaded — group by type */}
            {!componentsLoading && ["assessment", "unit"].map((type) => (
              <div key={type} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {type}s
                </div>
                {components
                  .filter((c) => c.type === type)
                  .map((c) => (
                    <ComponentCard key={c.id} component={c} onDragStart={handlePanelDragStart} />
                  ))}
              </div>
            ))}

            {/* How it works hint */}
            <div style={{ background: "#F8FAFC", border: "0.5px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#475569", marginBottom: 6 }}>ℹ How it works</div>
              <ul style={{ fontSize: 11, color: "#94A3B8", margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
                <li>Drag components onto the canvas</li>
                <li>Drag the <strong>bottom dot</strong> to connect</li>
                <li>Click a connection to add conditions</li>
                <li>System routes learners automatically</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* ── Canvas ─────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, position: "relative", overflow: "hidden", background: "#F1F5F9" }}>

          {/* Zoom bar */}
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 20, display: "flex", alignItems: "center", gap: 4, background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 8, padding: "4px 8px" }}>
            <button onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.1).toFixed(1)))} style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "#64748B", lineHeight: 1 }}>−</button>
            <span style={{ fontSize: 12, color: "#64748B", minWidth: 40, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(2,  +(z + 0.1).toFixed(1)))} style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "#64748B", lineHeight: 1 }}>+</button>
            <div style={{ width: 1, height: 16, background: "#E2E8F0", margin: "0 2px" }} />
            <button onClick={() => setZoom(0.85)} title="Reset zoom" style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", fontSize: 14, color: "#64748B" }}>⊡</button>
          </div>

          {/* Stats bar */}
          <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 20, display: "flex", gap: 6 }}>
            {[
              { label: "Nodes",       value: nodes.length },
              { label: "Connections", value: edges.length },
              { label: "Assessments", value: nodes.filter((n) => n.type === "assessment").length },
            ].map((s) => (
              <div key={s.label} style={{ background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#64748B" }}>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>{s.value}</span> {s.label}
              </div>
            ))}
          </div>

          {/* Dot-grid */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <defs>
              <pattern id="dots" x="0" y="0" width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse">
                <circle cx={zoom} cy={zoom} r="0.8" fill="#CBD5E1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>

          {/* Canvas surface */}
          <div
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, overflow: "hidden" }}
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0", position: "relative", width: "100%", height: "100%", cursor: connectingFrom ? "crosshair" : "default" }}>
              <EdgeLayer
                nodes={nodes}
                edges={edges}
                selectedEdgeId={selected?.type === "edge" ? selected.id : null}
                onSelectEdge={(id) => setSelected({ type: "edge", id })}
                connectingFrom={connectingFrom}
                mousePos={mousePos}
              />
              {nodes.map((node) => (
                <CanvasNode
                  key={node.id}
                  node={node}
                  isSelected={selected?.type === "node" && selected.id === node.id}
                  onMouseDown={handleNodeMouseDown}
                  onPortMouseDown={handlePortMouseDown}
                />
              ))}
            </div>
          </div>
        </main>

        {/* ── Right panel ────────────────────────────────────────────────── */}
        <aside style={{ width: 284, background: "#fff", borderLeft: "0.5px solid #E2E8F0", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "0.5px solid #E2E8F0" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>Properties</div>
            {selected && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, textTransform: "capitalize" }}>{selected.type}</div>}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <PropertiesPanel
              selected={selected}
              nodes={nodes}
              edges={edges}
              onUpdateNode={updateNode}
              onUpdateEdge={updateEdge}
              onDeleteSelected={deleteSelected}
            />
          </div>
        </aside>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <SaveModal
        isOpen={showSave}
        onClose={() => setShowSave(false)}
        onSave={handleSave}
        loading={saveLoading}
      />
      <LoadModal
        isOpen={showLoad}
        onClose={() => setShowLoad(false)}
        paths={savedPaths}
        onLoad={handleLoad}
        onDelete={handleDeletePath}
        loading={loadLoading}
      />

      <Toast toast={toast} />
    </div>
  );
}