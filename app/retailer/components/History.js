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
      // Get all orders that are either delivered or rejected
      const res = await fetch('/api/retailer/orders');
      if (res.ok) {
        const data = await res.json();
        // Filter out pending and active orders, keeping only completed (delivered or rejected)
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
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Order History</h1>
          <p className="text-slate-400">View your past deliveries and rejected orders</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 w-full md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No history yet</h3>
          <p className="text-slate-400">Completed and rejected orders will appear here.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Date & Time</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {filteredHistory.map(order => {
                  const isDelivered = order.status === 'delivered';
                  const date = new Date((order.delivered_at || order.accepted_at || order.timestamp) * 1000);
                  
                  return (
                    <tr key={order.order_id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-bold text-white">
                        {order.order_id}
                      </td>
                      <td className="p-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-800 p-1.5 rounded-md text-slate-400">
                            <MapPin size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-white leading-none">{order.address?.name || 'Customer'}</p>
                            <p className="text-xs text-slate-500 mt-1">{order.address?.city || 'Unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        ₹{order.total}
                      </td>
                      <td className="p-4">
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 size={12} /> Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            <XCircle size={12} /> Rejected
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
            <div className="p-8 text-center text-slate-500">
              No orders found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
