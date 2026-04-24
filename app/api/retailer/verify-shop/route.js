const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/retailer/verify-shop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("Retailer verify-shop proxy error:", err);
    return Response.json({ error: "Failed to connect to backend." }, { status: 502 });
  }
}
