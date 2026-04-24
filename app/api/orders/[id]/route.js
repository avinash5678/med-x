const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${BACKEND_URL}/order-status/${id}`);
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ error: "Failed to connect" }, { status: 502 });
  }
}
