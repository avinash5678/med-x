'use client';
import React from 'react';
import { MapPin } from 'lucide-react';

export default function AddressesView({ savedAddresses, setCurrentView }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide">
      <div className="max-w-[1024px] mx-auto">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>
        <h2 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mb-8">Saved Addresses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedAddresses.map((addr, idx) => (
            <div key={idx} className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl p-6 atmospheric-shadow flex items-start gap-4 hover:border-[var(--color-primary)]/30 transition-colors group">
              <div className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] p-3 rounded-xl mt-0.5 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-[var(--color-on-surface)] text-base mb-1">{addr.name}</h4>
                <p className="text-xs font-semibold text-[var(--color-outline)] mb-3 bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded w-fit">{addr.phone}</p>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-1">{addr.street}</p>
                <p className="text-sm text-[var(--color-on-surface-variant)]">{addr.city} • {addr.pincode}</p>
              </div>
            </div>
          ))}

          {savedAddresses.length === 0 && (
            <div className="col-span-full bg-[var(--color-surface-container-lowest)] p-12 rounded-xl atmospheric-shadow border border-[var(--color-outline-variant)] text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-[var(--color-outline-variant)] mb-4 text-5xl">location_off</span>
              <p className="text-[var(--color-on-surface)] font-heading font-bold mb-1">No saved addresses</p>
              <p className="text-[var(--color-on-surface-variant)] text-sm font-body">Place an order to save your address automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
