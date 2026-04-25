"use client";
import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, XCircle, MapPin, Search, Loader2 } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/retailer/orders');
      if (res.ok) {
        const data = await res.json();
        const completed = data.filter(o =>
          o.status === 'delivered' ||
          o.retailer_status === 'rejected' ||
          o.status === 'cancelled'
        );
        setHistory(completed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(order =>
    order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.address?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">Order History</h1>
          <p className="text-slate-500 text-sm font-medium">View your past deliveries and rejected orders</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all w-full md:w-60 placeholder-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 text-slate-400 gap-2">
          <Loader2 className="animate-spin" size={20} /> Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white border border-slate-100 border-dashed rounded-3xl p-14 text-center shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Package size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No history yet</h3>
          <p className="text-slate-500 text-sm">Completed and rejected orders will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_2px_12px_rgb(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Date & Time</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredHistory.map(order => {
                  const isDelivered = order.status === 'delivered';
                  const date = new Date((order.delivered_at || order.accepted_at || order.timestamp) * 1000);

                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{order.order_id}</td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500">
                            <MapPin size={13} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none text-xs">{order.address?.name || 'Customer'}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{order.address?.city || 'Unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">₹{order.total}</td>
                      <td className="px-6 py-4">
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 size={11} /> Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 border border-red-100 px-2.5 py-1 rounded-full text-xs font-bold">
                            <XCircle size={11} /> Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredHistory.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No orders found matching &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
