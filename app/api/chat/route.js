export async function POST(req) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openRouterKey && !geminiKey) {
    return Response.json(
      { error: "AI API key (OPENROUTER_API_KEY or GEMINI_API_KEY) not configured on server." },
      { status: 500 }
    );
  }

  try {
    const { query, systemInstruction, expectJson } = await req.json();

    // 1. If OpenRouter API key is configured, use OpenRouter with model fallbacks
    if (openRouterKey) {
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }
      messages.push({ role: "user", content: query });

      const payload = {
        models: [
          "openai/gpt-oss-20b:free",
          "google/gemma-4-26b-a4b-it:free",
          "google/gemma-4-26b-a4b:free",
          "meta-llama/llama-3.3-70b-instruct:free",
          "google/gemini-2.0-flash-exp:free"
        ],
        messages,
        ...(expectJson && { response_format: { type: "json_object" } }),
      };

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Med Z Pharmacy",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return Response.json(
          { error: data.error?.message || "OpenRouter API error" },
          { status: res.status }
        );
      }

      const reply =
        data.choices?.[0]?.message?.content ||
        "I couldn't process that request.";

      return Response.json({ reply });
    }

    // 2. Fallback to Gemini if only Gemini key is available
    const payload = {
      contents: [{ parts: [{ text: query }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    if (expectJson) {
      payload.generationConfig = { responseMimeType: "application/json" };
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
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
    console.error("AI chat proxy error:", err);
    return Response.json(
      { error: "Failed to connect to AI service." },
      { status: 500 }
    );
  }
}