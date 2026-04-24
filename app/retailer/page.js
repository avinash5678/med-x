"use client";
import { useState, useEffect } from 'react';
import { Store, LayoutDashboard, Package, Truck, LogOut, Loader2 } from 'lucide-react';
import Auth from './components/Auth';
import ShopVerification from './components/ShopVerification';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Delivery from './components/Delivery';

export default function RetailerPortal() {
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, orders, delivery

  useEffect(() => {
    const checkAuth = async () => {
      const saved = localStorage.getItem('medz_retailer');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Fetch latest profile to ensure shop_verified is up to date
          const res = await fetch(`/api/retailer/profile/${parsed.email}`);
          if (res.ok) {
            const data = await res.json();
            setRetailer(data);
            localStorage.setItem('medz_retailer', JSON.stringify(data));
          } else {
            setRetailer(parsed); // Fallback to local storage
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medz_retailer');
    setRetailer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }

  // View 1: Auth
  if (!retailer) {
    return <Auth onLoginSuccess={(data) => setRetailer(data)} />;
  }

  // View 2: Shop Verification
  if (!retailer.shop_verified) {
    return (
      <ShopVerification 
        retailerEmail={retailer.email} 
        onVerified={(shopDetails) => {
          const updated = { ...retailer, shop_verified: true, shop_details: shopDetails };
          setRetailer(updated);
          localStorage.setItem('medz_retailer', JSON.stringify(updated));
        }} 
      />
    );
  }

  // View 3: Authenticated Portal (Dashboard, Orders, Delivery)
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <Store size={20} />
          </div>
          <div>
            <h2 className="text-white font-black tracking-tight leading-none mb-1">MedZ</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Retailer Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package size={20} /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'delivery' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Truck size={20} /> Delivery
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-2">
            <p className="text-xs text-slate-500 font-medium mb-1">Logged in as</p>
            <p className="text-sm text-white font-bold truncate">{retailer.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors justify-center"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        {activeTab === 'dashboard' && <Dashboard retailer={retailer} />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'delivery' && <Delivery />}
      </main>

    </div>
  );
}
