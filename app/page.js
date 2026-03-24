"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);

  async function generate() {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setResult(data.result);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>PUBG WOW AI Map Builder</h1>

      <textarea
        style={{ width: "100%", height: 100 }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <br /><br />
      <button onClick={generate}>Generate</button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>{result.mapName}</h2>
          <p><b>Mode:</b> {result.mode}</p>
          <p><b>Theme:</b> {result.theme}</p>
          <p><b>Players:</b> {result.players}</p>

          <h3>Layout</h3>
          <ul>
            {result.layout.map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3>Rules</h3>
          <ul>
            {result.rules.map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3>Weapons</h3>
          <ul>
            {result.weapons.map((x, i) => <li key={i}>{x}</li>)}
          </ul>

          <h3>Build Steps</h3>
          <ol>
            {result.buildSteps.map((x, i) => <li key={i}>{x}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
