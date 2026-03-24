"use client";
import { useMemo, useState } from "react";

function badgeStyle(bg, color) {
  return {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: bg,
    color,
    fontWeight: 700,
    fontSize: 13,
    marginRight: 8,
    marginBottom: 8
  };
}

function cardStyle() {
  return {
    background: "linear-gradient(180deg, #121826 0%, #0b1020 100%)",
    border: "1px solid #22304a",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
  };
}

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        ...cardStyle(),
        minWidth: 150,
        flex: 1,
        borderColor: accent || "#22304a"
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>{label}</div>
      <div style={{ color: "white", fontSize: 30, fontWeight: 800 }}>{value ?? "-"}</div>
    </div>
  );
}

function Section({ title, children, action }) {
  return (
    <div style={{ ...cardStyle(), marginTop: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12
        }}
      >
        <h3 style={{ margin: 0, color: "white", fontSize: 22 }}>{title}</h3>
        {action}
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function ListCard({ items, emoji }) {
  if (!items?.length) {
    return <div style={{ color: "#94a3b8" }}>No data yet.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#0f172a",
            border: "1px solid #22304a",
            borderRadius: 14,
            padding: 14,
            color: "#e2e8f0"
          }}
        >
          <span style={{ marginRight: 10 }}>{emoji}</span>
          {item}
        </div>
      ))}
    </div>
  );
}

function MiniMap({ layout = [] }) {
  const points = useMemo(() => {
    return [
      { x: 18, y: 22, label: layout[0] || "Spawn West" },
      { x: 50, y: 18, label: layout[1] || "Center Zone" },
      { x: 82, y: 24, label: layout[2] || "Spawn East" },
      { x: 25, y: 70, label: layout[3] || "Lower Route" },
      { x: 75, y: 72, label: layout[4] || "High Route" }
    ];
  }, [layout]);

  return (
    <div
      style={{
        background: "#08101f",
        border: "1px solid #22304a",
        borderRadius: 18,
        padding: 14
      }}
    >
      <svg viewBox="0 0 100 100" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}>
        <rect x="2" y="2" width="96" height="96" rx="8" fill="#0b1220" stroke="#1e293b" />
        <rect x="10" y="10" width="80" height="18" rx="4" fill="#132238" stroke="#22304a" />
        <rect x="8" y="58" width="30" height="24" rx="4" fill="#102032" stroke="#22304a" />
        <rect x="62" y="56" width="30" height="26" rx="4" fill="#102032" stroke="#22304a" />
        <rect x="42" y="38" width="16" height="24" rx="4" fill="#16324c" stroke="#38bdf8" />
        <path d="M20 20 L50 26 L80 20" stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="3 3" />
        <path d="M24 70 L50 50 L76 70" stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="3 3" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.4" fill={i === 1 ? "#38bdf8" : "#22c55e"} />
            <text x={p.x + 4} y={p.y - 4} fontSize="4" fill="#cbd5e1">
              {p.label.slice(0, 18)}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 10 }}>
        Visual preview based on generated layout zones.
      </div>
    </div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("API did not return valid JSON.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function copyJson() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #111827 0%, #070b16 50%, #05070d 100%)",
        fontFamily: "Arial, sans-serif",
        color: "white",
        padding: 24
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            ...cardStyle(),
            padding: 26,
            background: "linear-gradient(180deg, #0f172a 0%, #0b1020 100%)"
          }}
        >
          <div style={{ color: "#38bdf8", fontWeight: 800, letterSpacing: 1 }}>PUBG WOW</div>
          <h1 style={{ marginTop: 8, marginBottom: 10, fontSize: 48, lineHeight: 1.05 }}>
            AI Map Builder
          </h1>
          <p style={{ color: "#cbd5e1", maxWidth: 840, fontSize: 17, lineHeight: 1.6 }}>
            Generate polished PUBG WOW map blueprints with layout, rules, weapons, build steps,
            score breakdowns, and a mini visual preview.
          </p>

          <div style={{ marginTop: 18 }}>
            <textarea
              style={{
                width: "100%",
                minHeight: 130,
                borderRadius: 16,
                background: "#020617",
                border: "1px solid #334155",
                color: "white",
                padding: 16,
                fontSize: 16,
                boxSizing: "border-box",
                resize: "vertical"
              }}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Build a 4v4 desert industrial map with a center sniper tower, mirrored spawns, underground tunnel flank, and fast respawn."
            />
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={generate}
              disabled={loading}
              style={{
                padding: "12px 18px",
                background: loading ? "#475569" : "#22c55e",
                color: "#04110a",
                border: "none",
                cursor: loading ? "default" : "pointer",
                borderRadius: 10,
                fontWeight: 800
              }}
            >
              {loading ? "Generating..." : "Generate Map"}
            </button>

            {result && (
              <button
                onClick={copyJson}
                style={{
                  padding: "12px 18px",
                  background: "#0f172a",
                  color: "white",
                  border: "1px solid #334155",
                  cursor: "pointer",
                  borderRadius: 10,
                  fontWeight: 700
                }}
              >
                Copy JSON
              </button>
            )}
          </div>

          {error && (
            <div
              style={{
                marginTop: 16,
                color: "#fecaca",
                background: "#450a0a",
                border: "1px solid #7f1d1d",
                padding: 12,
                borderRadius: 12
              }}
            >
              {error}
            </div>
          )}
        </div>

        {result && (
          <div style={{ marginTop: 22 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
              <div style={{ flex: 1, minWidth: 320 }}>
                <div style={{ ...cardStyle(), padding: 22 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: 12,
                      flexWrap: "wrap"
                    }}
                  >
                    <div>
                      <h2 style={{ margin: 0, color: "white", fontSize: 36 }}>
                        {result.mapName || "Untitled Map"}
                      </h2>
                      <p style={{ color: "#cbd5e1", lineHeight: 1.6, marginTop: 12 }}>
                        {result.summary || "No summary returned."}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <span style={badgeStyle("#dbeafe", "#1d4ed8")}>{result.mode || "Custom"}</span>
                    <span style={badgeStyle("#dcfce7", "#166534")}>{result.theme || "Mixed"}</span>
                    <span style={badgeStyle("#fef3c7", "#92400e")}>{result.players || "Unknown players"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
                  <StatCard label="Spawn Safety" value={result.qa?.spawnSafety ?? 88} accent="#38bdf8" />
                  <StatCard label="Fairness" value={result.qa?.fairness ?? 90} accent="#22c55e" />
                  <StatCard label="Flow" value={result.qa?.flow ?? 87} accent="#f59e0b" />
                  <StatCard label="Performance" value={result.qa?.performance ?? 85} accent="#a78bfa" />
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 320 }}>
                <Section title="Map Visualization">
                  <MiniMap layout={result.layout || []} />
                </Section>
              </div>
            </div>

            <Section title="Layout">
              <ListCard items={result.layout || []} emoji="🗺️" />
            </Section>

            <div
              style={{
                display: "grid",
                gap: 18,
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                marginTop: 18
              }}
            >
              <div>
                <Section title="Rules">
                  <ListCard items={result.rules || []} emoji="⚙️" />
                </Section>
              </div>

              <div>
                <Section title="Weapons">
                  {(result.weapons || []).length ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {(result.weapons || []).map((item, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#0f172a",
                            border: "1px solid #22304a",
                            padding: "10px 12px",
                            borderRadius: 999,
                            color: "#e2e8f0",
                            fontWeight: 700
                          }}
                        >
                          🔫 {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "#94a3b8" }}>No weapon list yet.</div>
                  )}
                </Section>
              </div>
            </div>

            <Section
              title="Build Steps"
              action={<span style={{ color: "#93c5fd", fontSize: 13 }}>Follow in order</span>}
            >
              {(result.buildSteps || []).length ? (
                <ol style={{ color: "#e2e8f0", paddingLeft: 22, margin: 0 }}>
                  {(result.buildSteps || []).map((item, i) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: 12,
                        background: "#0f172a",
                        border: "1px solid #22304a",
                        borderRadius: 14,
                        padding: 14
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <div style={{ color: "#94a3b8" }}>No build steps yet.</div>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
