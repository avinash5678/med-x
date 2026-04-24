"use client";
import { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Package, MapPin, Loader2, ArrowRight } from 'lucide-react';

export default function Delivery() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/retailer/orders?status=accepted');
      const data = await res.json();
      if (res.ok) {
        // Only show orders that are not yet fully delivered
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
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const activeOrders = orders;

  const getStatusStep = (status) => {
    if (status === 'none' || status === 'packing') return 0;
    if (status === 'packed') return 1;
    if (status === 'out_for_delivery') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Delivery Management</h1>
        <p className="text-slate-400">Track and update active deliveries</p>
      </div>

      {loading && activeOrders.length === 0 ? (
        <div className="flex items-center justify-center p-12 text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Loading active deliveries...
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No active deliveries</h3>
          <p className="text-slate-400">Accept orders from the Orders tab to start delivery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activeOrders.map(order => {
            const step = getStatusStep(order.delivery_status || 'none');
            
            return (
              <div key={order.order_id} className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{order.order_id}</h3>
                    <p className="text-slate-400 text-sm font-medium">{order.address?.name} • {order.address?.city}</p>
                  </div>
                  <div className="bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-xl text-sm border border-slate-700">
                    ₹{order.total}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 px-2">
                  <div className="flex justify-between relative mb-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        style={{ width: `${(step / 3) * 100}%` }}
                      />
                    </div>
                    
                    {[
                      { icon: <Package size={16} />, label: 'Packing' },
                      { icon: <CheckCircle2 size={16} />, label: 'Packed' },
                      { icon: <Truck size={16} />, label: 'Out for Delivery' },
                      { icon: <MapPin size={16} />, label: 'Delivered' }
                    ].map((s, idx) => (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${idx <= step ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 ring-4 ring-slate-900' : 'bg-slate-800 text-slate-500 ring-4 ring-slate-900'}`}>
                          {s.icon}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Packing</span>
                    <span className="ml-2">Packed</span>
                    <span className="mr-4">Out</span>
                    <span>Done</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-slate-950 rounded-2xl p-2 flex gap-2 border border-slate-800/50">
                  {step === 0 && (
                    <button 
                      onClick={() => updateStatus(order.order_id, 'packed')}
                      disabled={updating === order.order_id}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {updating === order.order_id ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Mark as Packed</>}
                    </button>
                  )}
                  {step === 1 && (
                    <button 
                      onClick={() => updateStatus(order.order_id, 'out_for_delivery')}
                      disabled={updating === order.order_id}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {updating === order.order_id ? <Loader2 size={18} className="animate-spin" /> : <><Truck size={18} /> Assign to Delivery</>}
                    </button>
                  )}
                  {step === 2 && (
                    <button 
                      onClick={() => updateStatus(order.order_id, 'delivered')}
                      disabled={updating === order.order_id}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      {updating === order.order_id ? <Loader2 size={18} className="animate-spin" /> : <><MapPin size={18} /> Mark Delivered</>}
                    </button>
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
