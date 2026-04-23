export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Gemini API key not configured on server." },
      { status: 500 }
    );
  }

  try {
    const { query, systemInstruction, expectJson } = await req.json();

    const payload = {
      contents: [{ parts: [{ text: query }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    if (expectJson) {
      payload.generationConfig = { responseMimeType: "application/json" };
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return Response.json(
        { error: data.error?.message || "Gemini API error" },
        { status: res.status }
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't process that request.";

    return Response.json({ reply });
  } catch (err) {
    console.error("Gemini proxy error:", err);
    return Response.json(
      { error: "Failed to connect to AI service." },
      { status: 500 }
    );
  }
}