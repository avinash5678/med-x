"use client";
import { useState, useEffect } from 'react';
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
          // Reverse geocoding using free OpenStreetMap Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          
          if (data && data.address) {
            setShopData(prev => ({
              ...prev,
              latitude,
              longitude,
              address: data.display_name,
              city: data.address.city || data.address.town || data.address.village || '',
              state: data.address.state || '',
              pincode: data.address.postcode || ''
            }));
          } else {
            setShopData(prev => ({ ...prev, latitude, longitude }));
          }
        } catch (err) {
          setError('Failed to fetch address from location. Please enter manually.');
          setShopData(prev => ({ ...prev, latitude, longitude }));
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setError('Failed to get location. Please allow location access or enter manually.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopData.latitude || !shopData.longitude) {
      setError("Please 'Use My Location' to verify your physical shop presence.");
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

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30">
          <Store size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Verify Your Pharmacy</h2>
          <p className="text-slate-400">We need to verify your physical location to connect you with nearby customers.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Shop Name *</label>
            <input
              type="text" required
              value={shopData.shop_name}
              onChange={e => setShopData({...shopData, shop_name: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Apollo Pharmacy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Phone Number *</label>
            <input
              type="tel" required
              value={shopData.phone}
              onChange={e => setShopData({...shopData, phone: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:ring-1 focus:ring-emerald-500"
              placeholder="9876543210"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Drug License Number</label>
          <input
            type="text"
            value={shopData.license_number}
            onChange={e => setShopData({...shopData, license_number: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 focus:ring-1 focus:ring-emerald-500"
            placeholder="Optional"
          />
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <MapPin size={18} className="text-blue-400" /> Physical Location Verification *
              </h3>
              <p className="text-sm text-slate-400 mt-1">Please allow location access to verify your shop's coordinates.</p>
            </div>
            <button
              type="button"
              onClick={getLocation}
              disabled={geoLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors whitespace-nowrap disabled:opacity-70"
            >
              {geoLoading ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
              {geoLoading ? 'Detecting...' : 'Use My Location'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Full Address</label>
              <textarea
                required rows="2"
                value={shopData.address}
                onChange={e => setShopData({...shopData, address: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
              <input
                type="text" required
                value={shopData.city}
                onChange={e => setShopData({...shopData, city: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">PIN Code</label>
              <input
                type="text" required
                value={shopData.pincode}
                onChange={e => setShopData({...shopData, pincode: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {shopData.latitude && (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={16} />
              Location Verified: {shopData.latitude.toFixed(4)}, {shopData.longitude.toFixed(4)}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Verification'}
        </button>
      </form>
    </div>
  );
}
