import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
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
Return ONLY valid JSON:
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

    const parsed = JSON.parse(text);

    return NextResponse.json({ result: parsed });

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
