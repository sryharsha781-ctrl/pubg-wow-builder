export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return Response.json({ error: "Prompt is required." }, { status: 400 });
    }

    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        mapName: { type: "string" },
        mode: { type: "string" },
        theme: { type: "string" },
        players: { type: "string" },
        summary: { type: "string" },
        layout: {
          type: "array",
          items: { type: "string" }
        },
        rules: {
          type: "array",
          items: { type: "string" }
        },
        weapons: {
          type: "array",
          items: { type: "string" }
        },
        buildSteps: {
          type: "array",
          items: { type: "string" }
        },
        qa: {
          type: "object",
          additionalProperties: false,
          properties: {
            spawnSafety: { type: "number" },
            fairness: { type: "number" },
            flow: { type: "number" },
            performance: { type: "number" }
          },
          required: ["spawnSafety", "fairness", "flow", "performance"]
        }
      },
      required: [
        "mapName",
        "mode",
        "theme",
        "players",
        "summary",
        "layout",
        "rules",
        "weapons",
        "buildSteps",
        "qa"
      ]
    };

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        instructions:
          "You are a PUBG WOW map designer. Generate original, balanced maps using design principles, not direct copies of existing PUBG maps. Keep outputs practical and buildable in a custom editor.",
        input: `Create a structured PUBG WOW map design for this prompt: ${prompt}`,
        text: {
          format: {
            type: "json_schema",
            name: "pubg_wow_map",
            schema,
            strict: true
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data?.error?.message || "OpenAI request failed." },
        { status: response.status }
      );
    }

    const text = data.output_text || "";
    const result = JSON.parse(text);

    return Response.json({ result });
  } catch (error) {
    return Response.json(
      { error: error.message || "Server error." },
      { status: 500 }
    );
  }
}
