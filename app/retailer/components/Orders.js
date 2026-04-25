"use client";
import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Check, X, Loader2, Phone } from 'lucide-react';

export default function Orders({ retailer }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
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
      const body = action === 'accept' ? { retailer_info: retailer?.shop_details } : {};
      const res = await fetch(`/api/retailer/orders/${orderId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingOrders = orders.filter(o => o.retailer_status === 'pending');

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">Order Management</h1>
          <p className="text-slate-500 text-sm font-medium">Accept and reject incoming orders</p>
        </div>
        <div className="bg-white border border-slate-100 shadow-sm px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
          <div className="relative">
            <Package size={18} className="text-slate-500" />
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
          <span className="font-bold text-slate-900 text-sm">{pendingOrders.length} Pending</span>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center p-16 text-slate-400 gap-2">
          <Loader2 className="animate-spin" size={20} /> Loading orders...
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="bg-white border border-slate-100 border-dashed rounded-3xl p-14 text-center shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Package size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No pending orders</h3>
          <p className="text-slate-500 text-sm">New customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {pendingOrders.map(order => (
            <div
              key={order.order_id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-all relative overflow-hidden"
            >
              {/* Accent bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-3xl" />

              {/* Order Header */}
              <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{order.order_id}</h3>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(order.timestamp * 1000).toLocaleTimeString()}
                    </span>
                    <span>·</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      ₹{order.total}
                    </span>
                  </div>
                </div>
                <span className="bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  New
                </span>
              </div>

              {/* Items */}
              <div className="mb-5 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="bg-white border border-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-lg text-xs">
                        {item.quantity}x
                      </span>
                      <span className="text-sm font-medium text-slate-800">{item.name}</span>
                    </div>
                    <span className="text-slate-700 font-bold text-sm">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="bg-white border border-slate-200 text-blue-500 p-2 rounded-xl mt-0.5 flex-shrink-0">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm mb-0.5">{order.address?.name || 'Customer'}</p>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {order.address?.street}, {order.address?.city} – {order.address?.pincode}
                    </p>
                    <a href={`tel:${order.address?.phone}`} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600 mt-1.5">
                      <Phone size={11} /> {order.address?.phone || 'No phone'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(order.order_id, 'reject')}
                  disabled={actionLoading !== null}
                  className="flex-1 bg-white hover:bg-red-50 text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-200 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
                >
                  {actionLoading === `${order.order_id}-reject` ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                  Reject
                </button>
                <button
                  onClick={() => handleAction(order.order_id, 'accept')}
                  disabled={actionLoading !== null}
                  className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-[0_4px_12px_rgb(0,0,0,0.12)] active:scale-[0.98] disabled:opacity-50"
                >
                  {actionLoading === `${order.order_id}-accept` ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Accept Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
