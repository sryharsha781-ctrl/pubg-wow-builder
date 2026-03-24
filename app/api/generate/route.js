export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Create a PUBG WOW map with this idea: ${prompt}. Return a structured map with layout, rules, and build steps.`
      })
    });

    const data = await response.json();

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No response";

    return Response.json({ result: text });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
