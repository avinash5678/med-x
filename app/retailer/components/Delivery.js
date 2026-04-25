"use client";
import { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Package, MapPin, Loader2 } from 'lucide-react';

export default function Delivery() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/retailer/orders?status=accepted');
      const data = await res.json();
      if (res.ok) {
        setOrders(data.filter(o => o.status !== 'delivered'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/retailer/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusStep = (status) => {
    if (status === 'none' || status === 'packing') return 0;
    if (status === 'packed') return 1;
    if (status === 'out_for_delivery') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  const steps = [
    { icon: Package,      label: 'Packing' },
    { icon: CheckCircle2, label: 'Packed' },
    { icon: Truck,        label: 'Out for Delivery' },
    { icon: MapPin,       label: 'Delivered' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">Delivery Management</h1>
        <p className="text-slate-500 text-sm font-medium">Track and update active deliveries</p>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center p-16 text-slate-400 gap-2">
          <Loader2 className="animate-spin" size={20} /> Loading active deliveries...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-100 border-dashed rounded-3xl p-14 text-center shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Truck size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No active deliveries</h3>
          <p className="text-slate-500 text-sm">Accept orders from the Orders tab to start delivery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {orders.map(order => {
            const step = getStatusStep(order.delivery_status || 'none');

            return (
              <div
                key={order.order_id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-all"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{order.order_id}</h3>
                    <p className="text-slate-500 text-sm font-medium">
                      {order.address?.name} · {order.address?.city}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-sm">
                    ₹{order.total}
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="mb-7 px-1">
                  <div className="relative flex justify-between">
                    {/* Track line */}
                    <div className="absolute top-4 left-[8%] right-[8%] h-[3px] bg-slate-100 rounded-full z-0">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        style={{ width: `${(step / 3) * 100}%` }}
                      />
                    </div>

                    {steps.map(({ icon: Icon, label }, idx) => (
                      <div key={idx} className="relative z-10 flex flex-col items-center w-1/4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 mb-2.5 ${
                          idx <= step
                            ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)] ring-4 ring-emerald-50'
                            : 'bg-white border-2 border-slate-200 text-slate-400'
                        }`}>
                          <Icon size={14} />
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider text-center leading-tight ${
                          idx <= step ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex gap-3">
                  {step === 0 && (
                    <button
                      onClick={() => updateStatus(order.order_id, 'packed')}
                      disabled={updating === order.order_id}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-[0_4px_12px_rgb(0,0,0,0.12)] active:scale-[0.98] disabled:opacity-50"
                    >
                      {updating === order.order_id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <><CheckCircle2 size={16} /> Mark as Packed</>}
                    </button>
                  )}
                  {step === 1 && (
                    <button
                      onClick={() => updateStatus(order.order_id, 'out_for_delivery')}
                      disabled={updating === order.order_id}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-[0_4px_12px_rgba(245,158,11,0.2)] active:scale-[0.98] disabled:opacity-50"
                    >
                      {updating === order.order_id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <><Truck size={16} /> Assign to Delivery</>}
                    </button>
                  )}
                  {step === 2 && (
                    <button
                      onClick={() => updateStatus(order.order_id, 'delivered')}
                      disabled={updating === order.order_id}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-[0_4px_12px_rgba(16,185,129,0.25)] active:scale-[0.98] disabled:opacity-50"
                    >
                      {updating === order.order_id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <><MapPin size={16} /> Mark Delivered</>}
                    </button>
                  )}
                  {step === 3 && (
                    <div className="w-full text-center text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 py-3 rounded-xl">
                      ✓ Delivered
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
