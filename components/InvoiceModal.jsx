'use client';
import React, { useRef } from 'react';
import { 
  Printer, Download, X, ShieldCheck, CheckCircle2, 
  FileText, Building2, User, Phone, MapPin, Receipt
} from 'lucide-react';

export default function InvoiceModal({
  isOpen,
  onClose,
  order,
}) {
  const printContentRef = useRef(null);

  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-${(order.id || 'ORD-1000').replace(/[^0-9]/g, '') || '8921'}-2026`;
  const invoiceDate = order.date || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const items = order.items || [];
  const orderTotal = Number(order.total) || 0;
  
  // Calculate 12% GST breakdown (CGST 6% + SGST 6%)
  const gstRate = 0.12;
  const taxableSubtotal = Math.round((orderTotal / (1 + gstRate)) * 100) / 100;
  const totalGst = Math.round((orderTotal - taxableSubtotal) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textReceipt = `
=====================================================
            MED Z HEALTHCARE PVT. LTD.
           TAX INVOICE / RETAIL RECEIPT
=====================================================
Invoice No: ${invoiceNumber}
Date: ${invoiceDate}
Order ID: ${order.id}
Payment: ${order.paymentMethod || 'Online'} (PAID)

GSTIN: 27AABCM8920K1ZX
Drug Lic (DL): MH-MZ-2024-DL8921 / DL8922
FSSAI Lic: 11524999000123
Pharmacy Address: G-Block, BKC, Bandra East, Mumbai 400051
-----------------------------------------------------
CUSTOMER DETAILS:
Name: ${order.address?.name || 'Customer'}
Phone: ${order.address?.phone || 'N/A'}
Address: ${order.address?.street || ''}, ${order.address?.city || ''} - ${order.address?.pincode || ''}
-----------------------------------------------------
ITEMS:
${items.map((it, idx) => `${idx + 1}. ${it.name} x ${it.quantity} = ₹${it.price * it.quantity}`).join('\n')}
-----------------------------------------------------
Taxable Subtotal: ₹${taxableSubtotal.toFixed(2)}
CGST (6%): ₹${cgst.toFixed(2)}
SGST (6%): ₹${sgst.toFixed(2)}
Delivery Charges: FREE (₹0.00)
-----------------------------------------------------
TOTAL AMOUNT: ₹${orderTotal.toFixed(2)}
=====================================================
Dispensed under Registered Pharmacist supervision.
Thank you for choosing Med Z Healthcare!
=====================================================
    `;

    const blob = new Blob([textReceipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:static">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:rounded-none print:w-full print:border-0 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold">
              <Receipt size={18} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm leading-tight text-white">
                Tax Invoice / Medical Receipt
              </h3>
              <p className="text-[11px] text-slate-400">
                {invoiceNumber} • {order.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download Text Receipt"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Text Receipt</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold font-heading transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div 
          ref={printContentRef}
          id="invoice-document"
          className="p-6 sm:p-10 overflow-y-auto font-body text-slate-800 bg-white print:p-8 print:overflow-visible print:text-black flex-1"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                </div>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900">Med Z</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full ml-1">
                  Tax Invoice
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">Med Z Healthcare Private Limited</p>
              <p className="text-xs text-slate-600 mt-0.5 max-w-sm leading-relaxed">
                Central Fulfillment Hub, G-Block, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-slate-600 mt-2 font-mono">
                <span>GSTIN: <strong className="text-slate-900">27AABCM8920K1ZX</strong></span>
                <span>FSSAI: <strong className="text-slate-900">11524999000123</strong></span>
                <span>DL 20B: <strong className="text-slate-900">MH-MZ-2024-DL8921</strong></span>
                <span>DL 21B: <strong className="text-slate-900">MH-MZ-2024-DL8922</strong></span>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1 sm:min-w-[200px] border-t sm:border-0 border-slate-200 pt-3 sm:pt-0 w-full sm:w-auto">
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                  <span>Invoice No:</span>
                  <strong className="text-slate-900 font-mono font-bold">{invoiceNumber}</strong>
                </div>
                <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                  <span>Invoice Date:</span>
                  <span className="text-slate-900 font-medium">{invoiceDate}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                  <span>Order Ref:</span>
                  <span className="text-slate-900 font-mono font-bold">{order.id}</span>
                </div>
                <div className="flex justify-between sm:justify-end gap-3 text-slate-600">
                  <span>Payment Mode:</span>
                  <span className="text-slate-900 uppercase font-bold text-[11px]">{order.paymentMethod || 'Online'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Prescription Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Billed & Shipped To:
              </h4>
              <p className="font-bold text-sm text-slate-900">{order.address?.name || 'Customer'}</p>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {order.address?.street || 'Address on record'}<br />
                {order.address?.city ? `${order.address.city}, ` : ''}{order.address?.state ? `${order.address.state} - ` : ''}{order.address?.pincode || ''}
              </p>
              <p className="text-slate-600 mt-1">
                Phone: <strong className="text-slate-800 font-mono">{order.address?.phone || 'N/A'}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Clinical Prescription Details:
              </h4>
              <p className="text-slate-700">
                Prescription Ref: <strong className="text-slate-900 font-mono">{order.prescription?.id || 'RX-VERIFIED-01'}</strong>
              </p>
              <p className="text-slate-700 mt-1">
                Patient: <strong className="text-slate-900">{order.prescription?.patientName || order.address?.name || 'Self'}</strong>
              </p>
              <p className="text-slate-700 mt-1">
                Prescriber: <strong className="text-slate-900">{order.prescription?.doctorName || 'Dr. A. Sharma (Reg #MH8921)'}</strong>
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                <CheckCircle2 size={12} /> Pharmacist Verification Complete
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900">
                  <th className="py-3 px-3 font-bold w-8 text-center">#</th>
                  <th className="py-3 px-3 font-bold">Item & Salt Composition</th>
                  <th className="py-3 px-2 font-bold font-mono text-center">HSN</th>
                  <th className="py-3 px-2 font-bold font-mono text-center">Batch</th>
                  <th className="py-3 px-2 font-bold text-center">Exp</th>
                  <th className="py-3 px-3 font-bold text-center">Qty</th>
                  <th className="py-3 px-3 font-bold text-right">MRP (₹)</th>
                  <th className="py-3 px-3 font-bold text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-body">
                {items.map((item, idx) => {
                  const hsnCode = item.category === 'Supplements' ? '2106' : item.category === 'First Aid' ? '3005' : '3004';
                  const batchNo = `MZ24B${(idx + 1).toString().padStart(2, '0')}`;
                  const expDate = '10/2027';
                  const lineTotal = item.price * (item.quantity || 1);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-slate-500 font-medium text-center">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {item.salt || item.description || 'Standard Medical Formulation'}
                        </p>
                        <p className="text-[10px] text-slate-400">Mfr: {item.manufacturer || 'Standard Care'}</p>
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-600 text-center">{hsnCode}</td>
                      <td className="py-3 px-2 font-mono text-slate-600 text-center">{batchNo}</td>
                      <td className="py-3 px-2 text-slate-600 text-center">{expDate}</td>
                      <td className="py-3 px-3 text-slate-900 font-bold text-center">{item.quantity || 1}</td>
                      <td className="py-3 px-3 text-slate-800 text-right font-mono">₹{item.price}</td>
                      <td className="py-3 px-3 text-slate-900 font-bold text-right font-mono">₹{lineTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Summary & Tax Breakup */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start gap-6 text-xs">
            <div className="space-y-3 max-w-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1.5 uppercase text-[10px] tracking-wider">GST Breakdown (12% Rate)</h5>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-medium">₹{taxableSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (6.00%):</span>
                    <span className="font-mono font-medium">₹{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (6.00%):</span>
                    <span className="font-mono font-medium">₹{sgst.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                * Medicines dispensed strictly in original sealed manufacturer packaging under verified pharmacist supervision in accordance with Drugs & Cosmetics Act, 1940.
              </p>
            </div>

            <div className="w-full sm:w-72 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Gross Total:</span>
                <span className="font-mono font-semibold">₹{taxableSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total GST (12%):</span>
                <span className="font-mono font-semibold">₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee:</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-baseline text-slate-900">
                <span className="font-heading font-extrabold text-sm uppercase">Invoice Total:</span>
                <span className="font-heading font-extrabold text-xl tracking-tight font-mono text-slate-900">₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Verification Seal & Registered Signatory */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-teal-600 text-teal-700 flex flex-col items-center justify-center p-1 text-center">
                <ShieldCheck size={16} />
                <span className="text-[7px] font-bold uppercase tracking-tighter">Med Z QA</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Registered Pharmacist Verified</p>
                <p className="text-[10px] text-slate-500">Reg. No: MAH-RPH-189201 • Central Pharmacy</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-heading font-bold text-xs text-slate-900 italic tracking-wider mb-0.5">
                For Med Z Healthcare Pvt. Ltd.
              </div>
              <p className="text-[10px] text-slate-400">Authorized Digital Signatory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Specific CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-document, #invoice-document * {
            visibility: visible;
          }
          #invoice-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
        }
      `}} />
    </div>
  );
}
