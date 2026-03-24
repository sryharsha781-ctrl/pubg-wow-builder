"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    setResult(data.result || data.error);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>PUBG WOW AI Map Builder</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your map..."
        style={{ width: "100%", height: 120 }}
      />

      <button onClick={generate}>
        {loading ? "Generating..." : "Generate"}
      </button>

      <pre>{result}</pre>
    </div>
  );
}
