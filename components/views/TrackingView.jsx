'use client';
import React, { useState, useEffect } from 'react';
import { Phone, ArrowLeft, Store, User, Check, Navigation, AlertCircle, ShoppingBag, Receipt } from 'lucide-react';

export default function TrackingView({ order, setCurrentView, onOpenInvoice }) {
  const [status, setStatus] = useState(0); // 0: Placed, 1: Packed, 2: Out for Delivery, 3: Delivered
  const [eta, setEta] = useState('Waiting for confirmation');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [retailerInfo, setRetailerInfo] = useState(null);

  useEffect(() => {
    let interval;
    if (typeof window !== 'undefined' && !window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      document.head.appendChild(script);
    } else if (window.L) {
      setMapLoaded(true);
      initializeMap();
    }

    function initializeMap() {
      const L = window.L;
      if (!L) return;
      
      const mapContainer = document.getElementById('delivery-map');
      if (!mapContainer) return;

      const existingMap = mapContainer._leaflet_id;
      if (existingMap) {
        return; // already initialized
      }

      const map = L.map('delivery-map', { zoomControl: false, attributionControl: false }).setView([28.6139, 77.2090], 13);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Shop Marker
      const shopIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#0058c3;width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 12px rgba(0,88,195,0.3);border:2.5px solid white;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
      const shopMarker = L.marker([28.6200, 77.2100], { icon: shopIcon }).addTo(map);

      // Customer Marker
      const customerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#006b5c;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 12px rgba(0,107,92,0.3);border:2.5px solid white;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });
      const customerMarker = L.marker([28.6000, 77.2200], { icon: customerIcon }).addTo(map);

      // Delivery Agent Marker
      const deliveryIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#65fade;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(101,250,222,0.5);border:3px solid white;z-index:1000;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00201b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      let agentLat = 28.6180;
      let agentLng = 77.2110;
      const deliveryMarker = L.marker([agentLat, agentLng], { icon: deliveryIcon, zIndexOffset: 1000 }).addTo(map);

      const targetLat = 28.6010;
      const targetLng = 77.2190;
      const steps = 600; 
      let currentStep = 0;
      const latStep = (targetLat - agentLat) / steps;
      const lngStep = (targetLng - agentLng) / steps;

      interval = setInterval(() => {
        if (currentStep < steps) {
          agentLat += latStep;
          agentLng += lngStep;
          deliveryMarker.setLatLng([agentLat, agentLng]);
          currentStep++;
        }
      }, 1000);

      const group = new L.featureGroup([shopMarker, customerMarker, deliveryMarker]);
      map.fitBounds(group.getBounds().pad(0.3));
    }

    let simActive = false;
    let simInterval;

    const runLocalSimulation = () => {
      if (simActive) return;
      simActive = true;
      
      setRetailerInfo(prev => prev || {
        shop_name: "Med Z Central BKC Hub",
        address: "G-Block, BKC, Mumbai 400051",
        phone: "+91 9876543210"
      });

      // Start at preparing
      setStatus(1);
      setEta('Preparing');

      simInterval = setInterval(() => {
        setStatus(currentStatus => {
          if (currentStatus < 3) {
            const nextStatus = currentStatus + 1;
            if (nextStatus === 3) setEta('Delivered');
            else if (nextStatus === 2) setEta('14 mins');
            else if (nextStatus === 1) setEta('Preparing');
            return nextStatus;
          } else {
            clearInterval(simInterval);
            return currentStatus;
          }
        });
      }, 8000);
    };

    const pollStatus = async () => {
      if (!order?.id) return;
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const data = await res.json();
          let newStatus = 0;
          
          if (data.retailer_status === 'accepted') newStatus = 1;
          if (data.delivery_status === 'packing') newStatus = 1;
          if (data.delivery_status === 'packed') newStatus = 1;
          if (data.delivery_status === 'out_for_delivery') newStatus = 2;
          if (data.delivery_status === 'delivered') newStatus = 3;
          
          setStatus(newStatus);
          
          if (data.retailer_info) {
             setRetailerInfo(data.retailer_info);
          }
          
          if (newStatus === 3) setEta('Delivered');
          else if (newStatus === 2) setEta('14 mins');
          else if (newStatus === 1) setEta('Preparing');
          else setEta('Pending');
        } else {
          runLocalSimulation();
        }
      } catch (err) {
        console.error("Poll error:", err);
        runLocalSimulation();
      }
    };
    
    pollStatus();
    const statusInterval = setInterval(pollStatus, 4000);

    return () => {
      if (interval) clearInterval(interval);
      clearInterval(statusInterval);
      if (simInterval) clearInterval(simInterval);
    };
  }, [order?.id]);

  return (
    <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden bg-[var(--color-background)] h-full animate-fade-in">
      {/* Left Column: Live Map */}
      <div className="relative flex-grow h-full min-h-[400px] bg-[var(--color-surface-container)] z-0">
        {/* Leaflet Map Target */}
        <div id="delivery-map" className="w-full h-full z-0"></div>
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
            <div className="w-10 h-10 border-4 border-[var(--color-outline-variant)] border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        )}

        {/* Floating Glassmorphic ETA Bubble */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[90%] max-w-[280px]">
          <div className="glass-panel px-6 py-4 rounded-[24px] shadow-2xl flex flex-col items-center text-center bg-white/70 backdrop-blur-md border border-white/30">
            <span className="font-heading font-bold text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1">Estimated Arrival</span>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-extrabold text-3xl text-[var(--color-primary)]">
                {status === 3 ? 'Delivered' : status === 0 ? 'Pending' : eta}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${status === 3 ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-secondary-container)] animate-pulse'}`}></span>
              <span className="font-heading font-semibold text-xs text-[var(--color-on-surface-variant)]">
                {status === 3 ? 'Package arrived safely' : status === 2 ? 'Out for delivery' : 'Processing package'}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Back Button */}
        <button 
          onClick={() => setCurrentView('home')}
          className="absolute top-6 left-6 z-30 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-all hover:scale-105 active:scale-90 bg-white/70 border border-white/30 shadow-md cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Right Sidebar: Tracking Info */}
      <aside className="w-full lg:w-[420px] h-full bg-[var(--color-surface-container-lowest)] border-t lg:border-t-0 lg:border-l border-[var(--color-outline-variant)]/40 z-30 overflow-y-auto flex-shrink-0">
        <div className="p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-[var(--color-on-surface)]">Track Order</h2>
            <p className="font-heading font-semibold text-sm text-[var(--color-on-surface-variant)] mt-1">Order #{order?.id || 'ORD-1234'}</p>
          </div>

          {/* Status Timeline */}
          <section className="space-y-4">
            <h3 className="font-heading font-bold text-xs text-[var(--color-on-surface-variant)] uppercase tracking-widest">Delivery Status</h3>
            <div className="relative space-y-6 pl-8">
              {/* Timeline Connector Line */}
              <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-[var(--color-surface-container-highest)]">
                <div 
                  className="absolute top-0 left-0 w-full bg-[var(--color-primary)] transition-all duration-1000 ease-out" 
                  style={{ height: `${(status / 3) * 100}%` }}
                />
              </div>

              {/* Step 1: Placed */}
              <div className="relative flex items-start gap-4">
                <div className={`absolute -left-8 flex items-center justify-center w-6.5 h-6.5 rounded-full ${
                  status >= 0 ? 'bg-[var(--color-primary)] text-white shadow-md' : 'bg-[var(--color-surface-container-highest)] text-[var(--color-outline)]'
                }`}>
                  {status > 0 ? <Check size={12} strokeWidth={3} /> : <ShoppingBag size={10} />}
                </div>
                <div>
                  <p className={`font-heading font-bold text-sm ${status >= 0 ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-outline)]'}`}>Order Confirmed</p>
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">{order?.date || 'Today'}</p>
                </div>
              </div>

              {/* Step 2: Packed */}
              <div className="relative flex items-start gap-4">
                <div className={`absolute -left-8 flex items-center justify-center w-6.5 h-6.5 rounded-full ${
                  status >= 1 ? 'bg-[var(--color-primary)] text-white shadow-md' : 'bg-[var(--color-surface-container-highest)] text-[var(--color-outline)]'
                }`}>
                  {status > 1 ? <Check size={12} strokeWidth={3} /> : <span className="material-symbols-outlined text-[12px]">package</span>}
                </div>
                <div>
                  <p className={`font-heading font-bold text-sm ${status >= 1 ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-outline)]'}`}>Package Prepared</p>
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">{status >= 1 ? 'Packed & verified' : 'Pending packaging'}</p>
                </div>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className="relative flex items-start gap-4">
                <div className={`absolute -left-8 flex items-center justify-center w-6.5 h-6.5 rounded-full ${
                  status >= 2 
                    ? 'bg-[var(--color-primary)] text-white shadow-md pulse-active' 
                    : 'bg-[var(--color-surface-container-highest)] text-[var(--color-outline)]'
                }`}>
                  {status > 2 ? <Check size={12} strokeWidth={3} /> : <Navigation size={10} className="rotate-45" />}
                </div>
                <div>
                  <p className={`font-heading font-bold text-sm ${status >= 2 ? 'text-[var(--color-primary)] font-extrabold' : 'text-[var(--color-outline)]'}`}>On the way</p>
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">{status >= 2 ? 'Partner is in transit' : 'Waiting for dispatch'}</p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className={`relative flex items-start gap-4 ${status < 3 ? 'opacity-40' : ''}`}>
                <div className={`absolute -left-8 flex items-center justify-center w-6.5 h-6.5 rounded-full ${
                  status === 3 ? 'bg-[var(--color-secondary)] text-white shadow-md' : 'bg-[var(--color-surface-container-highest)] text-[var(--color-outline)]'
                }`}>
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                </div>
                <div>
                  <p className={`font-heading font-bold text-sm ${status === 3 ? 'text-[var(--color-secondary)] font-extrabold' : 'text-[var(--color-on-surface)]'}`}>Delivered</p>
                  <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-0.5">{status === 3 ? 'Handed to customer' : 'Expected soon'}</p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-[var(--color-outline-variant)]/30" />

          {/* Delivery Partner Details */}
          <section className="space-y-4">
            <h3 className="font-heading font-bold text-xs text-[var(--color-on-surface-variant)] uppercase tracking-widest">Delivery Partner</h3>
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-2xl flex items-center justify-between border border-[var(--color-outline-variant)]/20 hover:border-[var(--color-primary)]/30 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-[var(--color-outline)]">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-[var(--color-on-surface)]">
                    {status >= 2 ? 'Rahul Sharma' : 'Assigning partner...'}
                  </p>
                  <div className="flex items-center gap-1 text-[var(--color-secondary)] mt-0.5">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-heading font-bold text-[10px]">4.9</span>
                    <span className="text-[10px] text-[var(--color-on-surface-variant)]">(1.2k reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href="tel:+919876543210"
                  className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-[var(--color-outline-variant)]/40 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Phone size={14} />
                </a>
              </div>
            </div>
          </section>

          {/* Store Info */}
          <section className="space-y-4">
            <h3 className="font-heading font-bold text-xs text-[var(--color-on-surface-variant)] uppercase tracking-widest">Fulfillment Pharmacy</h3>
            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-2xl border border-[var(--color-outline-variant)]/20 flex flex-col gap-3 shadow-sm">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                  <Store size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-bold text-sm text-[var(--color-on-surface)] truncate">
                    {retailerInfo ? retailerInfo.shop_name : 'Med Z Central BKC Hub'}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] leading-normal mt-0.5 truncate">
                    {retailerInfo ? retailerInfo.address : 'G-Block, BKC, Mumbai 400051'}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-3 border-t border-[var(--color-outline-variant)]/20 flex justify-between items-center text-xs">
                <span className="text-[var(--color-on-surface-variant)] font-semibold">Order Price</span>
                <span className="font-heading font-extrabold text-sm text-[var(--color-on-surface)]">₹{order?.total || 0}</span>
              </div>
            </div>
          </section>

          {/* Prescription Status if attached */}
          {order?.prescription && (
            <section className="space-y-2">
              <h3 className="font-heading font-bold text-xs text-[var(--color-on-surface-variant)] uppercase tracking-widest">Prescription Status</h3>
              <div className="bg-[var(--color-surface-container-low)] p-3.5 rounded-2xl border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">verified</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-[var(--color-on-surface)]">
                      {order.prescription.type === 'doctor_call' ? 'Doctor E-Consult Verified' : 'Prescription Verified'}
                    </p>
                    <p className="text-[11px] text-[var(--color-outline)]">
                      Dispensed by Med Z Licensed Pharmacist
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Download Invoice Button */}
          {onOpenInvoice && order && (
            <button
              type="button"
              onClick={() => onOpenInvoice(order)}
              className="w-full py-3 px-4 rounded-xl bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] font-heading font-bold text-xs flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] transition-all shadow-sm cursor-pointer active:scale-98"
            >
              <Receipt size={15} className="text-[var(--color-primary)]" />
              <span>Download Official GST Tax Invoice</span>
            </button>
          )}

          {/* Support Line */}
          <button 
            onClick={() => {
              alert("Connecting you to Med Z customer support... Please feel free to also reach out via our Contact form.");
              setCurrentView('contact');
            }}
            className="w-full py-3 text-center text-[var(--color-primary)] hover:text-[var(--color-primary-container)] font-heading font-semibold text-xs transition-colors cursor-pointer bg-transparent border-0 outline-none"
          >
            Need help with your delivery?
          </button>
        </div>
      </aside>
    </div>
  );
}
