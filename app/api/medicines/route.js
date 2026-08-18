import { promises as fs } from 'fs';
import path from 'path';

let cachedMedicines = null;

async function loadMedicines() {
  if (cachedMedicines) return cachedMedicines;

  // Load from medicines.json (MongoDB catalog served separately via lib/mongodb.js)
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
    const salt = (searchParams.get('salt') || '').toLowerCase();
    const substitutesForId = searchParams.get('substitutesFor');
    const genericOnly = searchParams.get('genericOnly') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // If substitutes requested for a specific medicine
    if (substitutesForId) {
      const targetMed = allMedicines.find(m => String(m.id) === String(substitutesForId));
      if (!targetMed) {
        return Response.json({ targetMedicine: null, substitutes: [] });
      }
      
      const targetSalt = (targetMed.salt || '').toLowerCase().trim();
      const substitutes = allMedicines
        .filter(m => String(m.id) !== String(targetMed.id))
        .filter(m => {
          const mSalt = (m.salt || '').toLowerCase().trim();
          // Exact salt match or category/description match if same active class
          return (targetSalt && mSalt && (mSalt === targetSalt || mSalt.includes(targetSalt) || targetSalt.includes(mSalt))) ||
                 (m.category === targetMed.category && m.isGeneric);
        })
        .map(sub => {
          const savingsAmount = Math.max(0, targetMed.price - sub.price);
          const savingsPercent = targetMed.price > 0 ? Math.round((savingsAmount / targetMed.price) * 100) : 0;
          return {
            ...sub,
            savingsAmount,
            savingsPercent,
            isCheaper: sub.price < targetMed.price
          };
        })
        .sort((a, b) => (b.savingsPercent - a.savingsPercent) || (a.price - b.price));

      return Response.json({ targetMedicine: targetMed, substitutes });
    }

    // Filter
    let filtered = allMedicines;
    if (search) {
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(search) ||
        m.description?.toLowerCase().includes(search) ||
        m.generic?.toLowerCase().includes(search) ||
        m.salt?.toLowerCase().includes(search) ||
        m.manufacturer?.toLowerCase().includes(search)
      );
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(m => m.category === category);
    }
    if (salt) {
      filtered = filtered.filter(m => m.salt?.toLowerCase().includes(salt));
    }
    if (genericOnly) {
      filtered = filtered.filter(m => m.isGeneric);
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
