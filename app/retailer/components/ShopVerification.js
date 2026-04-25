"use client";
import { useState } from 'react';
import { MapPin, Navigation, Loader2, Store, CheckCircle2 } from 'lucide-react';

export default function ShopVerification({ retailerEmail, onVerified }) {
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');

  const [shopData, setShopData] = useState({
    shop_name: '',
    phone: '',
    license_number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null
  });

  const getLocation = () => {
    setGeoLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          if (data?.address) {
            setShopData(prev => ({
              ...prev,
              latitude, longitude,
              address: data.display_name,
              city: data.address.city || data.address.town || data.address.village || '',
              state: data.address.state || '',
              pincode: data.address.postcode || ''
            }));
          } else {
            setShopData(prev => ({ ...prev, latitude, longitude }));
          }
        } catch {
          setError('Failed to fetch address. Please enter manually.');
          setShopData(prev => ({ ...prev, latitude, longitude }));
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setError('Failed to get location. Please allow location access or enter manually.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopData.latitude || !shopData.longitude) {
      setError("Please click 'Use My Location' to verify your physical shop presence.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/retailer/verify-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: retailerEmail, ...shopData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify shop');
      onVerified(data.shop_details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 md:p-10">

        {/* Header */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Store size={26} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Verify Your Pharmacy</h2>
            <p className="text-slate-500 text-sm">
              We need to verify your physical location to connect you with nearby customers.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Shop Name *</label>
              <input
                type="text" required
                value={shopData.shop_name}
                onChange={e => setShopData({ ...shopData, shop_name: e.target.value })}
                className={inputClass}
                placeholder="e.g. Apollo Pharmacy"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
              <input
                type="tel" required
                value={shopData.phone}
                onChange={e => setShopData({ ...shopData, phone: e.target.value })}
                className={inputClass}
                placeholder="9876543210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Drug License Number</label>
            <input
              type="text"
              value={shopData.license_number}
              onChange={e => setShopData({ ...shopData, license_number: e.target.value })}
              className={inputClass}
              placeholder="Optional"
            />
          </div>

          {/* Location Block */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 rounded-l-2xl" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-slate-500" />
                  Physical Location Verification *
                </h3>
                <p className="text-xs text-slate-500 mt-1">Allow location access to verify your shop's coordinates.</p>
              </div>
              <button
                type="button"
                onClick={getLocation}
                disabled={geoLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap disabled:opacity-60 active:scale-[0.98] shadow-[0_4px_12px_rgb(0,0,0,0.12)]"
              >
                {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                {geoLoading ? 'Detecting...' : 'Use My Location'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Address</label>
                <textarea
                  required rows={2}
                  value={shopData.address}
                  onChange={e => setShopData({ ...shopData, address: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">City</label>
                <input
                  type="text" required
                  value={shopData.city}
                  onChange={e => setShopData({ ...shopData, city: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">PIN Code</label>
                <input
                  type="text" required
                  value={shopData.pincode}
                  onChange={e => setShopData({ ...shopData, pincode: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 px-4 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                />
              </div>
            </div>

            {shopData.latitude && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <CheckCircle2 size={15} />
                Location Verified: {shopData.latitude.toFixed(4)}, {shopData.longitude.toFixed(4)}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all shadow-[0_4px_12px_rgb(0,0,0,0.12)] active:scale-[0.98] flex items-center justify-center gap-2 text-base disabled:opacity-60 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Verification'}
          </button>
        </form>
      </div>
    </div>
  );
}
