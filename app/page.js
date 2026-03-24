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
    <div style={{
      ...cardStyle(),
      minWidth: 150,
      flex: 1,
      borderColor: accent || "#22304a"
    }}>
      <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>{label}</div>
      <div style={{ color: "white", fontSize: 30, fontWeight: 800 }}>{value ?? "-"}</div>
    </div>
  );
}

function Section({ title, children, action }) {
  return (
    <div style={{ ...cardStyle(), marginTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
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
        <div key={i} style={{
          background: "#0f172a",
          border: "1px solid #22304a",
          borderRadius: 14,
          padding: 14,
          color: "#e2e8f0"
        }}>
          <span style={{ marginRight: 10 }}>{emoji}</span>
          {item}
        </div>
      ))}
    </div>
  );
}

function MiniMap({ layout = [] }) {
  const points = useMemo(() => {
    const defaults = [
      { x: 18, y: 22, label: layout[0] || "Spawn West" },
      { x: 50, y: 18, label: layout[1] || "Center Zone" },
      { x: 82, y: 24, label: layout[2] || "Spawn East" },
      { x: 25, y: 70, label: layout[3] || "Lower Route" },
      { x: 75, y: 72, label: layout[4] || "High Route" },
    ];
    return defaults;
  }, [layout]);

  return (
    <div style={{
      background: "#08101f",
      border: "1px solid #22304a",
      borderRadius: 18,
      padding: 14
    }}>
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
            <text x={p.x + 4} y={p.y - 4} fontSize="4" fill="#cbd5e1">{p.label.slice(0, 18)}</text>
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
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #111827 0%, #070b16 50%, #05070d 100%)",
      fontFamily: "Arial, sans-serif",
      color: "white",
      padding: 24
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{
          ...cardStyle(),
          padding: 26,
          background: "linear-gradient(180deg, #0f172a 0%, #0b1020 100%)"
        }}>
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
