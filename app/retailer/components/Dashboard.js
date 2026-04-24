"use client";
import { useState, useEffect } from 'react';
import { Package, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard({ retailer }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/retailer/dashboard');
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="p-8 text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-black text-white mb-2">Welcome back, {retailer?.name?.split(' ')[0]}</h1>
      <p className="text-slate-400 mb-8">{retailer?.shop_details?.shop_name} • Dashboard Overview</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-lg">Action Needed</span>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Pending Orders</p>
          <h3 className="text-3xl font-black text-white">{stats.pending_orders}</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-lg">All Time</span>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Total Revenue</p>
          <h3 className="text-3xl font-black text-emerald-400">₹{stats.total_revenue}</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
              <Package size={24} />
            </div>
            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-lg">Active</span>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Orders in Progress</p>
          <h3 className="text-3xl font-black text-white">{stats.accepted_orders}</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-lg">Today</span>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Delivered Today</p>
          <h3 className="text-3xl font-black text-white">{stats.today_delivered}</h3>
        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            <AlertCircle className="text-amber-400" size={20} />
            Stay online to receive orders
          </h3>
          <p className="text-slate-400 text-sm">Customers in your area are looking for medicines. Keep this portal open to get notified instantly when new orders arrive.</p>
        </div>
        <div className="relative z-10 flex-shrink-0">
          <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            You are online
          </div>
        </div>
      </div>
    </div>
  );
}
