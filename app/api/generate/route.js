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
        model: "gpt-4o-mini",
        input: `Create a structured PUBG WOW map design: ${prompt}`
      })
    });

    const data = await response.json();

    return Response.json({ result: data.output[0].content[0].text });

  } catch (err) {
    return Response.json({ error: "Error" });
  }
}
