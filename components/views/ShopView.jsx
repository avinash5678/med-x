'use client';
import React from 'react';
import { Plus, Sparkles, Package, X, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ShopView({
  filteredProducts, activeCategory, setActiveCategory, CATEGORIES,
  addToCart, handleAiExplain, searchQuery, setSearchQuery,
  cart, cartCount, cartTotal, setCurrentView,
  setIsDoctorOpen, setIsChatOpen, setIsMobileSidebarOpen, isMobileSidebarOpen,
  user, handleLogout,
}) {
  return (
    <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden animate-fade-in">
      <main className="flex-1 p-4 md:p-8 lg:p-12 pb-28 md:pb-6 w-full overflow-y-auto scrollbar-hide bg-[var(--color-background)]">
        {/* Category Filter Bar */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)]">{activeCategory} Medicines</h1>
            <span className="font-body text-sm text-[var(--color-outline)]">Showing {filteredProducts.length} products</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(category => (
              <button key={category} onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-heading text-sm font-semibold transition-all duration-200
                  ${activeCategory === category
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'}`}>
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            return (
              <div key={product.id}
                className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl overflow-hidden atmospheric-shadow hover:border-[var(--color-primary)]/30 transition-all group">
                <div className="h-40 bg-[var(--color-surface-container)] overflow-hidden flex items-center justify-center">
                  <Icon size={48} strokeWidth={1.5} className="text-[var(--color-outline)] group-hover:text-[var(--color-primary)] transition-colors group-hover:scale-110 duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-on-secondary-container)] bg-[var(--color-secondary-container)] px-2 py-1 rounded">{product.category}</span>
                    <span className="font-body text-sm font-bold text-[var(--color-primary)]">₹{product.price}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-[var(--color-on-surface)] mb-1 mt-2">{product.name}</h3>
                  <p className="font-body text-sm text-[var(--color-on-surface-variant)] mb-4 line-clamp-2">{product.description}</p>
                  <button onClick={() => handleAiExplain(product)}
                    className="text-xs text-[var(--color-primary)] font-semibold flex items-center gap-1.5 hover:gap-2 transition-all bg-[var(--color-primary-fixed)] px-3 py-2 rounded-lg w-fit mb-4 cursor-pointer">
                    <Sparkles size={14} /> AI Explain
                  </button>
                  <button onClick={() => addToCart(product)}
                    className="w-full py-2.5 bg-[var(--color-primary-container)] text-white font-heading text-sm font-semibold rounded-lg hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span> Add to Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-32 text-[var(--color-on-surface-variant)] flex flex-col items-center">
            <div className="w-20 h-20 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mb-4">
              <Package size={32} className="text-[var(--color-outline)]" />
            </div>
            <p className="text-lg font-heading font-bold text-[var(--color-on-surface)] mb-1">No products found</p>
            <p className="text-sm font-body">Try searching for a different medicine or category.</p>
          </div>
        )}
      </main>

      {/* Sidebar Overlay for Mobile */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-[var(--color-inverse-surface)]/20 z-50 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static top-0 right-0 z-50 w-full md:w-[340px] h-full bg-[var(--color-surface-container-lowest)] dark:bg-[var(--color-surface)] border-l border-[var(--color-outline-variant)] shadow-2xl md:shadow-none flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-[var(--color-outline-variant)] flex justify-between items-center md:hidden">
          <h2 className="text-base font-heading font-bold text-[var(--color-on-surface)]">Tools & Search</h2>
          <button className="p-2 text-[var(--color-outline)] hover:bg-[var(--color-surface-container)] rounded-xl transition-colors" onClick={() => setIsMobileSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Mobile menu items */}
        <div className="p-2 border-b border-[var(--color-outline-variant)] md:hidden flex flex-col gap-1 bg-[var(--color-surface-container-low)]">
          <div className="flex items-center gap-3 px-4 py-3 mb-1">
            <div className="w-8 h-8 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] rounded-full flex items-center justify-center text-xs font-semibold uppercase shadow-sm">{user?.name?.charAt(0)}</div>
            <div>
              <p className="text-[10px] text-[var(--color-outline)] font-medium leading-none mb-1 uppercase tracking-wider">Account</p>
              <p className="text-sm font-heading font-bold text-[var(--color-on-surface)] leading-none">{user?.name}</p>
            </div>
          </div>
          {[
            { label: 'Order History', icon: 'receipt_long', view: 'orders' },
            { label: 'Transaction History', icon: 'payments', view: 'transactions' },
            { label: 'Saved Addresses', icon: 'location_on', view: 'addresses' },
            { label: 'Contact Us', icon: 'mail', view: 'contact' },
          ].map(item => (
            <button key={item.view} onClick={() => { setCurrentView(item.view); setIsMobileSidebarOpen(false); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-lowest)] rounded-xl transition-all">
              <span className="material-symbols-outlined text-lg">{item.icon}</span> {item.label}
            </button>
          ))}
          <div className="my-1 border-t border-[var(--color-outline-variant)]"></div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error-container)]/20 rounded-xl transition-all">
            <span className="material-symbols-outlined text-lg">logout</span> Sign Out
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {/* Search */}
          <div>
            <h2 className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">search</span> Search Medicines
            </h2>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-outline)] group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or generic..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]" />
            </div>
          </div>

          {/* AI Doctor Card */}
          <div className="bg-[#4e5e74] text-white rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined">bolt</span>
                <h2 className="font-heading font-semibold text-lg">Precision AI</h2>
              </div>
              <p className="font-body text-sm text-white/80 mb-4">Have questions about interactions? I can analyze your prescription history in real-time.</p>
              <button onClick={() => { setIsDoctorOpen(true); setIsMobileSidebarOpen(false); }}
                className="w-full py-2.5 bg-white text-[#4e5e74] font-heading text-sm font-semibold rounded-lg hover:bg-[var(--color-surface-bright)] transition-colors cursor-pointer">
                Launch Assistant
              </button>
            </div>
          </div>

          {/* Quick Cart */}
          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl p-5 atmospheric-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-[var(--color-on-surface)]">Quick Cart</h3>
              {cartCount > 0 && (
                <span className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] font-bold px-2 py-1 rounded-full">{cartCount} Items</span>
              )}
            </div>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-[var(--color-outline)] gap-3 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] border-dashed">
                <ShoppingCart size={24} className="text-[var(--color-outline-variant)]" />
                <p className="text-xs font-medium text-[var(--color-outline)]">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {cart.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-[var(--color-outline-variant)]">
                      <div>
                        <p className="font-heading text-sm font-semibold text-[var(--color-on-surface)]">{item.name}</p>
                        <p className="text-xs text-[var(--color-outline)]">{item.quantity} x ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  {cart.length > 3 && <p className="text-xs text-[var(--color-outline)] pt-1 font-medium">+{cart.length - 3} more items</p>}
                </div>
                <div className="flex justify-between font-bold text-[var(--color-on-surface)] pt-2">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button onClick={() => { setCurrentView('cart'); setIsMobileSidebarOpen(false); }}
                  className="w-full py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-heading text-sm font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity cursor-pointer">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
