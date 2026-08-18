'use client';
import React, { useState } from 'react';
import { Receipt, FileText, CheckCircle2, Clock, PhoneCall, ExternalLink, X, ShieldCheck, Printer, Download } from 'lucide-react';

export default function OrdersView({ 
  ordersHistory, 
  setCurrentView, 
  setActiveDeliveryOrder,
  onOpenInvoice,
}) {
  const [selectedRx, setSelectedRx] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide animate-fade-in">
      <div className="max-w-[1024px] mx-auto">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>
        <h1 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mb-8">Order History</h1>

        {ordersHistory.length === 0 ? (
          <div className="bg-[var(--color-surface-container-lowest)] p-12 rounded-xl atmospheric-shadow border border-[var(--color-outline-variant)] text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-outline-variant)] mb-5 text-5xl">package_2</span>
            <p className="text-[var(--color-on-surface)] font-heading font-bold mb-1">No orders yet</p>
            <p className="text-[var(--color-on-surface-variant)] text-sm font-body">When you place an order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {ordersHistory.map((order, i) => {
              const hasRx = Boolean(order.prescription || order.items?.some(it => it.requiresPrescription));
              return (
                <div key={i} className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] p-6 rounded-xl atmospheric-shadow hover:border-[var(--color-primary)]/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 pb-5 border-b border-[var(--color-outline-variant)] gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-bold text-[var(--color-on-surface)] text-base">{order.id}</p>
                        {hasRx && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                            Rx Order
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-outline)] mt-1 font-medium">{order.date}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] bg-[var(--color-secondary-container)]/30 px-2.5 py-1 rounded-md w-fit">{order.status}</span>
                      <p className="font-heading font-bold text-lg text-[var(--color-on-surface)]">₹{order.total}</p>
                    </div>
                  </div>

                  {/* Prescription verification banner if attached */}
                  {order.prescription && (
                    <div className="mb-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {order.prescription.type === 'doctor_call' ? (
                          <PhoneCall size={14} className="text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                        )}
                        <span className="text-blue-950 dark:text-blue-200 font-medium">
                          {order.prescription.type === 'doctor_call' 
                            ? 'Free Doctor Consultation Scheduled'
                            : `Prescription: ${order.prescription.fileName || 'Attached'} (Pharmacist Verified)`}
                        </span>
                      </div>
                      {order.prescription.dataUrl && (
                        <button
                          type="button"
                          onClick={() => setSelectedRx(order.prescription)}
                          className="text-xs text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink size={12} /> View Rx
                        </button>
                      )}
                    </div>
                  )}

                  <ul className="text-sm text-[var(--color-on-surface-variant)] space-y-3 font-body">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span className="flex items-center gap-3">
                          <span className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-xs font-semibold px-2 py-0.5 rounded">{item.quantity}x</span>
                          <span className="text-[var(--color-on-surface)]">{item.name}</span>
                          {item.requiresPrescription && (
                            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">Rx</span>
                          )}
                        </span>
                        <span className="text-xs text-[var(--color-outline)]">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 pt-4 border-t border-[var(--color-outline-variant)]/60 flex flex-wrap items-center justify-between gap-3">
                    {order.status !== 'Delivered' ? (
                      <button onClick={() => { setActiveDeliveryOrder && setActiveDeliveryOrder(order); setCurrentView('delivery'); }}
                        className="text-sm font-heading font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">local_shipping</span> Track Order
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Order Delivered
                      </span>
                    )}

                    {onOpenInvoice && (
                      <button
                        type="button"
                        onClick={() => onOpenInvoice(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[var(--color-outline-variant)] shadow-sm"
                      >
                        <Receipt size={14} className="text-[var(--color-primary)]" />
                        <span>Download GST Invoice</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Prescription Modal */}
        {selectedRx && (
          <div 
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedRx(null)}
          >
            <div 
              className="relative max-w-2xl w-full max-h-[85vh] bg-[var(--color-surface)] border border-white/20 rounded-2xl overflow-hidden flex flex-col p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--color-outline-variant)]">
                <div>
                  <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)]">
                    {selectedRx.fileName || 'Attached Doctor Prescription'}
                  </h3>
                  <p className="text-xs text-[var(--color-outline)]">
                    Patient: {selectedRx.patientName || 'Self'} • Dr. {selectedRx.doctorName || 'Attending Physician'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRx(null)}
                  className="p-2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center p-2">
                <img 
                  src={selectedRx.dataUrl} 
                  alt="Prescription" 
                  className="max-h-[65vh] object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TransactionsView({ ordersHistory, setCurrentView, onOpenInvoice }) {
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
                    <th className="py-4 px-6 font-semibold">Order ID</th>
                    <th className="py-4 px-6 font-semibold">Date</th>
                    <th className="py-4 px-6 font-semibold">Method</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Amount</th>
                    <th className="py-4 px-6 font-semibold text-center">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]/40 font-body">
                  {ordersHistory.map((order, idx) => (
                    <tr key={idx} className="hover:bg-[var(--color-surface-container-low)] transition-colors">
                      <td className="py-4 px-6 font-semibold text-[var(--color-on-surface)] font-mono">{order.id}</td>
                      <td className="py-4 px-6 text-[var(--color-on-surface-variant)]">{order.date}</td>
                      <td className="py-4 px-6 text-[var(--color-on-surface-variant)] uppercase text-xs font-bold">{order.paymentMethod || 'Online'}</td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)] bg-[var(--color-secondary-container)]/30 px-2 py-0.5 rounded">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-[var(--color-on-surface)] font-mono">₹{order.total}</td>
                      <td className="py-4 px-6 text-center">
                        {onOpenInvoice ? (
                          <button
                            type="button"
                            onClick={() => onOpenInvoice(order)}
                            className="px-2.5 py-1 rounded-lg bg-[var(--color-primary-fixed)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Receipt size={13} />
                            <span>Invoice</span>
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--color-outline)]">-</span>
                        )}
                      </td>
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
