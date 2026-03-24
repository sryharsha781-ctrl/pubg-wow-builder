"use client";
import { useState } from "react";

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
        headers: {
          "Content-Type": "application/json"
        },
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

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>PUBG WOW AI Map Builder</h1>

      <textarea
        style={{ width: "100%", height: 120 }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your map..."
      />

      <br />
      <br />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 20 }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>{result.mapName || "Untitled Map"}</h2>
          <p><b>Mode:</b> {result.mode || "-"}</p>
          <p><b>Theme:</b> {result.theme || "-"}</p>
          <p><b>Players:</b> {result.players || "-"}</p>
          <p><b>Summary:</b> {result.summary || "-"}</p>

          <h3>Layout</h3>
          <ul>
            {(result.layout || []).map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3>Rules</h3>
          <ul>
            {(result.rules || []).map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3>Weapons</h3>
          <ul>
            {(result.weapons || []).map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3>Build Steps</h3>
          <ol>
            {(result.buildSteps || []).map((x, i) => <li key={i}>{x}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
