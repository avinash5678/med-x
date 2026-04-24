const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

// GET retailer orders (with optional status filter)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const url = status
      ? `${BACKEND_URL}/retailer/orders?status=${status}`
      : `${BACKEND_URL}/retailer/orders`;

    const res = await fetch(url);
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("Retailer orders proxy error:", err);
    return Response.json({ error: "Failed to connect to backend." }, { status: 502 });
  }
}
