'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, MapPin, Phone, Clock, ShieldCheck, Search, 
  Navigation, CheckCircle2, AlertCircle, ShoppingBag, 
  Sparkles, Filter, ExternalLink, Star, Pill
} from 'lucide-react';
import { PHARMACIES_DATA, getStoreStock } from '@/data/pharmaciesData';

export default function PharmaciesView({
  setCurrentView,
  onSelectPickupStore,
  selectedPickupStore,
  medicines = [],
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineQuery, setMedicineQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | '24_7' | 'pickup' | 'generics'
  const [activeStore, setActiveStore] = useState(PHARMACIES_DATA[0]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.body.appendChild(script);
    } else if (typeof window !== 'undefined' && window.L) {
      setMapLoaded(true);
    }
  }, []);

  const filteredStores = PHARMACIES_DATA.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.pincode.includes(searchQuery);

    if (!matchesSearch) return false;
    if (filterMode === '24_7') return store.isOpen247;
    if (filterMode === 'pickup') return store.isPickupAvailable;
    if (filterMode === 'generics') return store.type.includes('Jan Aushadhi');
    return true;
  });

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || typeof window === 'undefined' || !window.L) return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapRef.current, {
        center: [19.0657, 72.8687], // BKC Mumbai Center
        zoom: 12,
        zoomControl: false,
      });

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      window.L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;

      // Add user current location marker
      const userIcon = window.L.divIcon({
        className: 'custom-user-marker',
        html: `<div class="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg animate-pulse ring-4 ring-blue-400/40"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      window.L.marker([19.0657, 72.8687], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Your Current Location</b><br/>G-Block, BKC, Mumbai');
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add store markers
    filteredStores.forEach((store) => {
      const isSelected = activeStore?.id === store.id;
      const is247 = store.isOpen247;
      const isGenerics = store.type.includes('Jan Aushadhi');

      const markerColor = isGenerics ? 'bg-amber-600' : is247 ? 'bg-emerald-600' : 'bg-teal-600';

      const iconHtml = `
        <div class="p-1.5 rounded-xl ${markerColor} text-white shadow-xl flex items-center justify-center border-2 border-white transition-transform ${isSelected ? 'scale-125 ring-4 ring-teal-400/50' : 'hover:scale-110'}">
          <span class="material-symbols-outlined text-sm font-bold">local_pharmacy</span>
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: 'custom-store-pin',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = window.L.marker([store.lat, store.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <strong style="font-size: 13px; color: #0f172a;">${store.name}</strong><br/>
            <span style="font-size: 11px; color: #0d9488; font-weight: bold;">${store.distanceKm} km away • ${store.timing}</span><br/>
            <p style="font-size: 11px; color: #475569; margin: 4px 0 8px;">${store.address}</p>
            <a href="tel:${store.phone}" style="display: inline-block; padding: 4px 10px; background: #0f766e; color: white; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold;">Call Chemist</a>
          </div>
        `);

      marker.on('click', () => {
        setActiveStore(store);
      });

      markersRef.current.push(marker);
    });

    if (activeStore) {
      map.setView([activeStore.lat, activeStore.lng], 13);
    }
  }, [mapLoaded, filteredStores, activeStore]);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide animate-fade-in">
      <div className="max-w-[1280px] mx-auto">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full">
                Live Store Locator & Inventory
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck size={12} /> Verified Licensed Chemists
              </span>
            </div>
            <h1 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mt-1.5">
              24/7 Nearby Pharmacies
            </h1>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              Find open pharmacies near you, check real-time medicine stock, and order for 30-minute express pickup.
            </p>
          </div>

          {selectedPickupStore && (
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold">
                <ShoppingBag size={16} />
              </div>
              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300">Selected Pickup Store:</span>
                <p className="font-bold text-[var(--color-on-surface)] truncate max-w-[180px]">{selectedPickupStore.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
            <input
              type="text"
              placeholder="Search by locality, area, or PIN code (e.g. BKC, Bandra, 400051)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] outline-none shadow-sm transition-all"
            />
          </div>

          <div className="relative">
            <Pill size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" />
            <input
              type="text"
              placeholder="Check live medicine stock at stores (e.g. Dolo 650, Metformin, Augmentin)..."
              value={medicineQuery}
              onChange={(e) => setMedicineQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] outline-none shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { id: 'all', label: `All Stores (${PHARMACIES_DATA.length})` },
            { id: '24_7', label: '🟢 Open 24/7 Now' },
            { id: 'pickup', label: '⚡ 30-Min Pickup Available' },
            { id: 'generics', label: '🏛️ Jan Aushadhi (Generics)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterMode(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === f.id
                  ? 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)] font-bold border border-[var(--color-primary)] shadow-sm'
                  : 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Split View: Interactive Map & Store List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Column */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="sticky top-28 bg-[var(--color-surface-container-lowest)] rounded-3xl border border-[var(--color-outline-variant)] overflow-hidden shadow-lg h-[460px] lg:h-[600px] flex flex-col">
              <div 
                ref={mapRef} 
                className="w-full h-full z-0" 
                style={{ minHeight: '380px' }} 
              />
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-[var(--color-outline-variant)] flex items-center justify-between text-xs text-[var(--color-outline)] z-10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> 24/7 Open</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span> Standard Chemist</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span> Jan Aushadhi</span>
                </div>
                <span>Map centered at BKC, Mumbai</span>
              </div>
            </div>
          </div>

          {/* Stores Directory List */}
          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            {filteredStores.length === 0 ? (
              <div className="p-12 text-center bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-outline-variant)]">
                <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                  No pharmacies found matching your filters or search terms.
                </p>
              </div>
            ) : (
              filteredStores.map((store) => {
                const stockInfo = getStoreStock(store.id, medicineQuery);
                const isSelectedForPickup = selectedPickupStore?.id === store.id;

                return (
                  <div
                    key={store.id}
                    onClick={() => setActiveStore(store)}
                    className={`bg-[var(--color-surface-container-lowest)] border rounded-2xl p-5 atmospheric-shadow transition-all cursor-pointer ${
                      activeStore?.id === store.id
                        ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-md'
                        : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
                            {store.type}
                          </span>
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                            <Navigation size={11} /> {store.distanceKm} km away
                          </span>
                          {store.isOpen247 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Open 24/7
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)] mt-1.5">
                          {store.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-lg text-xs font-bold shrink-0">
                        <Star size={12} className="fill-amber-400 text-amber-500" />
                        <span>{store.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({store.reviewsCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                      {store.address}
                    </p>

                    <div className="p-3 rounded-xl bg-[var(--color-surface-container-low)] space-y-1 text-[11px] text-[var(--color-outline)] mb-4">
                      <div className="flex justify-between">
                        <span>Attending Pharmacist:</span>
                        <strong className="text-[var(--color-on-surface)]">{store.pharmacist}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Drug License No:</span>
                        <span className="font-mono">{store.licenseNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operating Hours:</span>
                        <span className="text-[var(--color-on-surface)] font-medium">{store.timing}</span>
                      </div>
                    </div>

                    {/* Live Medicine Stock Indicator if searching a medicine */}
                    {medicineQuery && (
                      <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>Stock for <strong>"{medicineQuery}"</strong>:</span>
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">
                          {stockInfo.status} ({stockInfo.count} packs available)
                        </span>
                      </div>
                    )}

                    {/* Services Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {store.services.map((srv, idx) => (
                        <span key={idx} className="text-[10px] font-semibold text-[var(--color-outline)] bg-[var(--color-surface-container)] px-2 py-0.5 rounded-md">
                          {srv}
                        </span>
                      ))}
                    </div>

                    {/* Store Action Triggers */}
                    <div className="pt-3 border-t border-[var(--color-outline-variant)] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${store.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Phone size={13} className="text-[var(--color-primary)]" />
                          <span>Call</span>
                        </a>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink size={13} className="text-[var(--color-primary)]" />
                          <span>Directions</span>
                        </a>
                      </div>

                      {onSelectPickupStore && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPickupStore(store);
                          }}
                          className={`px-4 py-2 rounded-xl font-heading font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                            isSelectedForPickup
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)]'
                          }`}
                        >
                          {isSelectedForPickup ? (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Selected for Pickup</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              <span>Select for 30-Min Pickup</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
