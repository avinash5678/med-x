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
    return (
      <div className="p-8 text-slate-400 text-sm font-medium">Loading dashboard...</div>
    );
  }

  const statCards = [
    {
      label: 'Pending Orders',
      value: stats.pending_orders,
      badge: 'Action Needed',
      badgeColor: 'bg-amber-50 text-amber-600 border-amber-100',
      iconBg: 'bg-amber-50 text-amber-500',
      icon: Clock,
      valueColor: 'text-slate-900',
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.total_revenue}`,
      badge: 'All Time',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-500',
      icon: TrendingUp,
      valueColor: 'text-emerald-600',
    },
    {
      label: 'Orders in Progress',
      value: stats.accepted_orders,
      badge: 'Active',
      badgeColor: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-50 text-blue-500',
      icon: Package,
      valueColor: 'text-slate-900',
    },
    {
      label: 'Delivered Today',
      value: stats.today_delivered,
      badge: 'Today',
      badgeColor: 'bg-purple-50 text-purple-600 border-purple-100',
      iconBg: 'bg-purple-50 text-purple-500',
      icon: CheckCircle2,
      valueColor: 'text-slate-900',
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">
        Welcome back, {retailer?.name?.split(' ')[0]} 👋
      </h1>
      <p className="text-slate-500 text-sm font-medium mb-8">
        {retailer?.shop_details?.shop_name} · Dashboard Overview
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, badge, badgeColor, iconBg, icon: Icon, valueColor }) => (
          <div
            key={label}
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.07)] transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <div className={`w-11 h-11 ${iconBg} rounded-2xl flex items-center justify-center`}>
                <Icon size={22} />
              </div>
              <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeColor}`}>
                {badge}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">{label}</p>
            <h3 className={`text-3xl font-black tracking-tight ${valueColor}`}>{value}</h3>
          </div>
        ))}
      </div>

      {/* Online Banner */}
      <div className="bg-white border border-slate-100 rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-[0_2px_12px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1.5">
            <AlertCircle className="text-amber-500" size={18} />
            Stay online to receive orders
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Customers in your area are looking for medicines. Keep this portal open to get notified instantly when new orders arrive.
          </p>
        </div>
        <div className="relative z-10 flex-shrink-0">
          <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full font-semibold text-sm flex items-center gap-2.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            You are online
          </div>
        </div>
      </div>
    </div>
  );
}
