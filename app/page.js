\"use client\";

import { useState } from "react";

function ScoreCard({ label, value }) {
  return (
    <div style={{
      border: "1px solid #2b2b2b",
      borderRadius: 12,
      padding: 12,
      background: "#111827",
      color: "white",
      minWidth: 120
    }}>
      <div style={{ fontSize: 12, opacity: 0.75 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: 18,
      marginTop: 16,
      background: "white"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b1020",
      color: "white",
      padding: 24,
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          border: "1px solid #24304a",
          borderRadius: 20,
          padding: 24,
          background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)"
        }}>
          <div style={{ fontSize: 13, color: "#93c5fd", fontWeight: 700, letterSpacing: 0.5 }}>
            PUBG WOW
          </div>
          <h1 style={{ marginTop: 8, marginBottom: 10, fontSize: 40 }}>
            AI Map Builder
          </h1>
          <p style={{ marginTop: 0, color: "#cbd5e1", maxWidth: 800 }}>
            Turn a simple prompt into a structured PUBG WOW map blueprint with layout, rules,
            weapons, build steps, and QA scores.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Build a 4v4 desert industrial TDM map with a center sniper tower, side tunnels, mirrored spawns, anti-camp flank routes, and fast respawn."
            style={{
              width: "100%",
              minHeight: 120,
              marginTop: 14,
              padding: 16,
              borderRadius: 14,
              border: "1px solid #334155",
              background: "#020617",
              color: "white",
              fontSize: 16,
              boxSizing: "border-box"
            }}
          />

          <button
            onClick={generate}
            disabled={loading}
            style={{
              marginTop: 14,
              padding: "12px 18px",
              borderRadius: 12,
              border: "none",
              background: loading ? "#64748b" : "#22c55e",
              color: "#08110a",
              fontWeight: 700,
              cursor: loading ? "default" : "pointer"
            }}
          >
            {loading ? "Generating..." : "Generate Map"}
          </button>

          {error && (
            <div style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 12,
              background: "#450a0a",
              color: "#fecaca",
              border: "1px solid #7f1d1d"
            }}>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div style={{ marginTop: 22 }}>
            <div style={{
              border: "1px solid #24304a",
              borderRadius: 20,
              padding: 22,
              background: "#f8fafc",
              color: "#0f172a"
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: 34 }}>{result.mapName}</h2>
                <span style={{
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  padding: "6px 10px",
                  borderRadius: 999
                }}>
                  {result.mode}
                </span>
                <span style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "6px 10px",
                  borderRadius: 999
                }}>
                  {result.theme}
                </span>
              </div>

              <p style={{ marginTop: 10, fontSize: 16 }}>
                <strong>Players:</strong> {result.players}
              </p>
              <p style={{ color: "#334155", lineHeight: 1.55 }}>{result.summary}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
                <ScoreCard label="Spawn Safety" value={result.qa?.spawnSafety ?? "-"} />
                <ScoreCard label="Fairness" value={result.qa?.fairness ?? "-"} />
                <ScoreCard label="Flow" value={result.qa?.flow ?? "-"} />
                <ScoreCard label="Performance" value={result.qa?.performance ?? "-"} />
              </div>

              <Section title="Layout">
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {result.layout?.map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
                </ul>
              </Section>

              <Section title="Rules">
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {result.rules?.map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
                </ul>
              </Section>

              <Section title="Weapons">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {result.weapons?.map((item, i) => (
                    <span key={i} style={{
                      padding: "8px 12px",
                      background: "#e2e8f0",
                      borderRadius: 999
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Build Steps">
                <ol style={{ margin: 0, paddingLeft: 22 }}>
                  {result.buildSteps?.map((item, i) => <li key={i} style={{ marginBottom: 10 }}>{item}</li>)}
                </ol>
              </Section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
