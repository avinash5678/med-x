'use client';
import React from 'react';
import { Receipt } from 'lucide-react';

export default function OrdersView({ ordersHistory, setCurrentView, setActiveDeliveryOrder }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide">
      <div className="max-w-[1024px] mx-auto">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>
        <h2 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mb-8">Order History</h2>

        {ordersHistory.length === 0 ? (
          <div className="bg-[var(--color-surface-container-lowest)] p-12 rounded-xl atmospheric-shadow border border-[var(--color-outline-variant)] text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-outline-variant)] mb-5 text-5xl">package_2</span>
            <p className="text-[var(--color-on-surface)] font-heading font-bold mb-1">No orders yet</p>
            <p className="text-[var(--color-on-surface-variant)] text-sm font-body">When you place an order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {ordersHistory.map((order, i) => (
              <div key={i} className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] p-6 rounded-xl atmospheric-shadow hover:border-[var(--color-primary)]/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 pb-5 border-b border-[var(--color-outline-variant)] gap-3">
                  <div>
                    <p className="font-heading font-bold text-[var(--color-on-surface)] text-base">{order.id}</p>
                    <p className="text-xs text-[var(--color-outline)] mt-1 font-medium">{order.date}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] bg-[var(--color-secondary-container)]/30 px-2.5 py-1 rounded-md w-fit">{order.status}</span>
                    <p className="font-heading font-bold text-lg text-[var(--color-on-surface)]">₹{order.total}</p>
                  </div>
                </div>
                <ul className="text-sm text-[var(--color-on-surface-variant)] space-y-3 font-body">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="flex items-center gap-3">
                        <span className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-xs font-semibold px-2 py-0.5 rounded">{item.quantity}x</span>
                        {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
                {order.status !== 'Delivered' && (
                  <button onClick={() => { setActiveDeliveryOrder && setActiveDeliveryOrder(order); setCurrentView('delivery'); }}
                    className="mt-4 text-sm font-heading font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">local_shipping</span> Track Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TransactionsView({ ordersHistory, setCurrentView }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide">
      <div className="max-w-[1280px] mx-auto">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>
        <h2 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mb-8">Transactions</h2>

        {ordersHistory.length === 0 ? (
          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl p-16 text-center flex flex-col items-center atmospheric-shadow">
            <Receipt size={40} className="text-[var(--color-outline-variant)] mb-5" />
            <h3 className="text-base font-heading font-bold text-[var(--color-on-surface)] mb-1">No transactions yet</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] font-body">Your payment history will appear here.</p>
          </div>
        ) : (
          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden atmospheric-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--color-surface-container-low)] text-[var(--color-outline)] border-b border-[var(--color-outline-variant)]">
                  <tr>
                    <th className="p-5 font-heading font-bold uppercase tracking-wider text-[11px]">Date</th>
                    <th className="p-5 font-heading font-bold uppercase tracking-wider text-[11px]">Order Ref</th>
                    <th className="p-5 font-heading font-bold uppercase tracking-wider text-[11px]">Method</th>
                    <th className="p-5 font-heading font-bold uppercase tracking-wider text-[11px] text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]/50">
                  {ordersHistory.map((order, idx) => (
                    <tr key={idx} className="hover:bg-[var(--color-surface-container-low)] transition-colors">
                      <td className="p-5 text-[var(--color-on-surface-variant)] font-medium whitespace-nowrap">{order.date}</td>
                      <td className="p-5 font-heading font-semibold text-[var(--color-on-surface)]">{order.id}</td>
                      <td className="p-5">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${order.paymentMethod === 'razorpay' ? 'bg-[var(--color-primary-fixed)] text-[var(--color-primary)]' : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]'}`}>
                          {order.paymentMethod === 'razorpay' ? 'Online' : 'COD'}
                        </span>
                      </td>
                      <td className="p-5 font-heading font-bold text-[var(--color-on-surface)] text-right">₹{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
