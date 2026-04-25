"use client";
import { useState, useEffect } from 'react';
import { Store, LayoutDashboard, Package, Truck, LogOut, Loader2, History as HistoryIcon } from 'lucide-react';
import Auth from './components/Auth';
import ShopVerification from './components/ShopVerification';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Delivery from './components/Delivery';
import History from './components/History';

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
          const res = await fetch(`/api/retailer/profile/${parsed.email}`);
          if (res.ok) {
            const data = await res.json();
            setRetailer(data);
            localStorage.setItem('medz_retailer', JSON.stringify(data));
          } else {
            setRetailer(parsed);
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-slate-400" />
      </div>
    );
  }

  if (!retailer) {
    return <Auth onLoginSuccess={(data) => setRetailer(data)} />;
  }

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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders',    label: 'Orders',    icon: Package },
    { id: 'delivery',  label: 'Delivery',  icon: Truck },
    { id: 'history',   label: 'History',   icon: HistoryIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col flex-shrink-0 shadow-[1px_0_0_0_rgb(241,245,249)]">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
            <Store size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-slate-900 font-black tracking-tight leading-none">MedZ</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Retailer Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Logged in as</p>
            <p className="text-sm text-slate-900 font-bold truncate">{retailer.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all justify-center"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        {activeTab === 'dashboard' && <Dashboard retailer={retailer} />}
        {activeTab === 'orders'    && <Orders retailer={retailer} />}
        {activeTab === 'delivery'  && <Delivery />}
        {activeTab === 'history'   && <History />}
      </main>

    </div>
  );
}
