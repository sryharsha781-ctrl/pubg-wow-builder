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
You are a PUBG WOW map designer.

Return ONLY valid JSON in this exact shape:
{
  "mapName": "string",
  "mode": "string",
  "theme": "string",
  "players": "string",
  "summary": "string",
  "layout": ["string"],
  "rules": ["string"],
  "weapons": ["string"],
  "buildSteps": ["string"]
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

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        mapName: "Generated Map",
        mode: "Custom",
        theme: "Mixed",
        players: "Unknown",
        summary: text || "No structured output returned.",
        layout: [],
        rules: [],
        weapons: [],
        buildSteps: []
      };
    }

    return Response.json({ result: parsed });
  } catch (err) {
    return Response.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
