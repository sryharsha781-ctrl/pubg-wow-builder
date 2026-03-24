```javascript
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return Response.json({ error: "Prompt is required." }, { status: 400 });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `
Return ONLY valid JSON for a PUBG WOW map in this exact shape:
{
  "mapName": "string",
  "mode": "string",
  "theme": "string",
  "players": "string",
  "summary": "string",
  "layout": ["string"],
  "rules": ["string"],
  "weapons": ["string"],
  "buildSteps": ["string"],
  "qa": {
    "spawnSafety": number,
    "fairness": number,
    "flow": number,
    "performance": number
  }
}

Prompt: ${prompt}
`
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return Response.json(
        { error: data?.error?.message || "OpenAI request failed." },
        { status: openaiRes.status }
      );
    }

    let text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    text = text.trim();

    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/i, "").replace(/\s*```$/i, "");
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "Model did not return valid JSON.", raw: text },
        { status: 500 }
      );
    }

    return Response.json({ result: parsed });
  } catch (err) {
    return Response.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
