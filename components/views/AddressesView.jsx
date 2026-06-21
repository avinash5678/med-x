'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, X, AlertCircle } from 'lucide-react';

export default function AddressesView({ savedAddresses, setCurrentView }) {
  const [localAddresses, setLocalAddresses] = useState(savedAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  useEffect(() => {
    setLocalAddresses(savedAddresses);
  }, [savedAddresses]);

  // Pincode validation & autofill
  useEffect(() => {
    if (newAddress.pincode.length === 6) {
      const fetchPincode = async () => {
        setPincodeLoading(true);
        setPincodeError('');
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${newAddress.pincode}`);
          const data = await res.json();
          if (data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            setNewAddress(prev => ({
              ...prev,
              city: postOffice.District,
              state: postOffice.State
            }));
          } else {
            setPincodeError('Invalid PIN Code');
          }
        } catch (err) {
          setPincodeError('Failed to verify PIN');
        } finally {
          setPincodeLoading(false);
        }
      };
      fetchPincode();
    } else {
      setPincodeError('');
    }
  }, [newAddress.pincode]);

  const handleDelete = (index) => {
    const updated = localAddresses.filter((_, idx) => idx !== index);
    setLocalAddresses(updated);
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("medz_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        localStorage.setItem(`addresses_${user.email}`, JSON.stringify(updated));
      }
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (pincodeError || newAddress.pincode.length !== 6) return;

    const updated = [...localAddresses, newAddress];
    setLocalAddresses(updated);
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("medz_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        localStorage.setItem(`addresses_${user.email}`, JSON.stringify(updated));
      }
    }
    setIsModalOpen(false);
    setNewAddress({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide">
      <div className="max-w-[1024px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <button onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
            <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
          </button>
          
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-container)] font-heading font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
            <Plus size={16} /> Add New Address
          </button>
        </div>
        
        <h2 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mb-8">Saved Addresses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localAddresses.map((addr, idx) => (
            <div key={idx} className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl p-6 atmospheric-shadow flex items-start gap-4 hover:border-[var(--color-primary)]/30 transition-colors group relative">
              <div className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] p-3 rounded-xl mt-0.5 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <MapPin size={20} />
              </div>
              <div className="flex-1 pr-8">
                <h4 className="font-heading font-bold text-[var(--color-on-surface)] text-base mb-1">{addr.name}</h4>
                <p className="text-xs font-semibold text-[var(--color-outline)] mb-3 bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded w-fit">{addr.phone}</p>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-1">{addr.street}</p>
                <p className="text-sm text-[var(--color-on-surface-variant)]">{addr.city} • {addr.pincode}</p>
              </div>
              <button 
                onClick={() => handleDelete(idx)}
                className="absolute top-4 right-4 text-[var(--color-outline-variant)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-container)]/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Delete Address"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {localAddresses.length === 0 && (
            <div className="col-span-full bg-[var(--color-surface-container-lowest)] p-12 rounded-xl atmospheric-shadow border border-[var(--color-outline-variant)] text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-[var(--color-outline-variant)] mb-4 text-5xl">location_off</span>
              <p className="text-[var(--color-on-surface)] font-heading font-bold mb-1">No saved addresses</p>
              <p className="text-[var(--color-on-surface-variant)] text-sm font-body">Add an address using the button above or place an order.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/65 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[28px] shadow-2xl relative border border-slate-100/50 dark:border-slate-800 p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setNewAddress({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[var(--color-primary-fixed)] text-[var(--color-primary)] p-2.5 rounded-xl">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">Add New Address</h3>
                <p className="text-xs text-[var(--color-outline)] mt-0.5">Please provide your delivery destination.</p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider">Full Name</label>
                  <input type="text" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider">Phone Number</label>
                  <input type="tel" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]" placeholder="+91 9876543210" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider">Street Address</label>
                <textarea required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] resize-none" placeholder="Flat No, Building Name, Street..." rows="2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider">City</label>
                  <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] text-sm bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]" placeholder="Autofilled from Pincode" readOnly />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider flex justify-between">
                    <span>Pincode</span>
                    {pincodeLoading && <span className="text-[var(--color-primary)] animate-pulse">Verifying...</span>}
                  </label>
                  <input type="text" maxLength={6} required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    className={`w-full px-4 py-2.5 rounded-xl border ${pincodeError ? 'border-[var(--color-error)]' : 'border-[var(--color-outline-variant)]'} text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]`} placeholder="400001" />
                  {pincodeError && <p className="text-xs text-[var(--color-error)] font-medium mt-1 flex items-center gap-1"><AlertCircle size={12} /> {pincodeError}</p>}
                  {newAddress.state && !pincodeError && !pincodeLoading && (
                    <p className="text-xs text-[var(--color-secondary)] font-medium mt-1">✓ Verified: {newAddress.state}</p>
                  )}
                </div>
              </div>

              <button type="submit" disabled={pincodeLoading || pincodeError || newAddress.pincode.length !== 6}
                className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white py-3 rounded-xl font-heading font-semibold text-sm transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
