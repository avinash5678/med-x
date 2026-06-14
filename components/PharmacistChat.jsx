'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Plus } from 'lucide-react';

export default function PharmacistChat({
  isChatOpen,
  setIsChatOpen,
  messages,
  isTyping,
  addToCart,
  handleSendMessage,
}) {
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [isChatOpen, messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    handleSendMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="fixed bottom-[88px] md:bottom-6 right-6 z-40 flex flex-col items-end">
      {isChatOpen && (
        <div className="w-[340px] h-[520px] bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-800 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          <div className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-700 dark:text-slate-300">
                <MessageCircle size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Pharmacist Chat</h3>
                <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] dark:bg-slate-955/60 space-y-4 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3.5 rounded-[18px] text-sm shadow-[0_2px_8px_rgb(0,0,0,0.02)] ${
                    msg.role === 'user'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-br-[4px]'
                      : 'bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/65 text-slate-800 dark:text-slate-200 rounded-bl-[4px]'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>

                  {msg.role === "model" && msg.products && msg.products.length > 0 && (
                    <div className="mt-3.5 flex flex-col gap-2 border-t border-slate-100/80 dark:border-slate-700/60 pt-3.5">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Suggested Items
                      </span>
                      {msg.products.map((product) => (
                        <div 
                          key={product.id} 
                          className="flex justify-between items-center bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-850 transition-all group"
                        >
                          <div className="flex flex-col overflow-hidden mr-2">
                            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">{product.name}</span>
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">₹{product.price}</span>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-100 text-slate-900 dark:text-slate-200 w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors shrink-0 shadow-sm cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 px-4 py-3.5 rounded-[18px] rounded-bl-[4px] shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex items-center gap-1.5 w-fit">
                  <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about health..."
              className="flex-1 bg-[#F8FAFC] dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-955 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-300 dark:disabled:text-slate-550 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              <Send size={16} className="-ml-0.5" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-955 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-pulse-soft"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
