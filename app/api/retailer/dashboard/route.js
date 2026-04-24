const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/retailer/dashboard`);
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("Retailer dashboard proxy error:", err);
    return Response.json({ error: "Failed to connect to backend." }, { status: 502 });
  }
}
