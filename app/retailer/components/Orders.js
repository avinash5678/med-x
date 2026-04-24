"use client";
import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Check, X, Loader2, AlertTriangle, Phone } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchOrders();
    // Poll for new orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/retailer/orders');
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  const handleAction = async (orderId, action) => {
    setActionLoading(`${orderId}-${action}`);
    try {
      const res = await fetch(`/api/retailer/orders/${orderId}/${action}`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchOrders(); // Refresh instantly
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingOrders = orders.filter(o => o.retailer_status === 'pending');

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Order Management</h1>
          <p className="text-slate-400">Accept and reject incoming orders</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="relative">
            <Package size={20} className="text-slate-400" />
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 w-3 h-3 rounded-full border-2 border-slate-900 animate-pulse"></span>
            )}
          </div>
          <span className="font-bold text-white">{pendingOrders.length} Pending</span>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center p-12 text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Loading orders...
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No pending orders</h3>
          <p className="text-slate-400">New customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingOrders.map(order => (
            <div key={order.order_id} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
              
              <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{order.order_id}</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.timestamp * 1000).toLocaleTimeString()}</span>
                    <span>•</span>
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">₹{order.total}</span>
                  </div>
                </div>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">New</span>
              </div>

              <div className="mb-6 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <span className="bg-slate-800 text-slate-300 font-bold px-2 py-1 rounded text-xs">{item.quantity}x</span>
                      <span className="font-medium text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-slate-400 font-bold text-sm">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 rounded-2xl p-4 mb-6 border border-slate-800/50">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-sm mb-1">{order.address?.name || 'Customer'}</p>
                    <p className="text-slate-400 text-sm mb-2 leading-relaxed line-clamp-2">{order.address?.street}, {order.address?.city} - {order.address?.pincode}</p>
                    <a href={`tel:${order.address?.phone}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300">
                      <Phone size={12} /> {order.address?.phone || 'No phone'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(order.order_id, 'reject')}
                  disabled={actionLoading !== null}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {actionLoading === `${order.order_id}-reject` ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />} Reject
                </button>
                <button
                  onClick={() => handleAction(order.order_id, 'accept')}
                  disabled={actionLoading !== null}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                >
                  {actionLoading === `${order.order_id}-accept` ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Accept Order
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
