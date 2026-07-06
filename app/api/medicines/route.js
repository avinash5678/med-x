import { promises as fs } from 'fs';
import path from 'path';

let cachedMedicines = null;

async function loadMedicines() {
  if (cachedMedicines) return cachedMedicines;

  // Try MongoDB first
  try {
    const { MongoClient } = await import('mongodb');
    const MONGO_URI = process.env.MONGO_URI;
    if (MONGO_URI) {
      const client = new MongoClient(MONGO_URI);
      await client.connect();
      const db = client.db('medz_db');
      const medicines = await db.collection('medicines').find({}).toArray();
      if (medicines.length > 0) {
        cachedMedicines = medicines.map(m => ({ ...m, _id: m._id.toString() }));
        return cachedMedicines;
      }
    }
  } catch (err) {
    console.warn('MongoDB not available, falling back to local JSON:', err.message);
  }

  // Fallback: load from medicines.json
  try {
    const filePath = path.join(process.cwd(), 'medicines.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    cachedMedicines = JSON.parse(raw);
    return cachedMedicines;
  } catch (err) {
    console.error('Failed to load medicines.json:', err);
    return [];
  }
}

export async function GET(req) {
  try {
    const allMedicines = await loadMedicines();

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').toLowerCase();
    const category = searchParams.get('category') || 'All';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Filter
    let filtered = allMedicines;
    if (search) {
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(search) ||
        m.description?.toLowerCase().includes(search) ||
        m.generic?.toLowerCase().includes(search)
      );
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(m => m.category === category);
    }

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const medicines = filtered.slice(skip, skip + limit);

    return Response.json({ medicines, total, page });
  } catch (err) {
    console.error('Medicines API error:', err);
    return Response.json(
      { error: 'Failed to fetch medicines.', medicines: [], total: 0 },
      { status: 500 }
    );
  }
}
