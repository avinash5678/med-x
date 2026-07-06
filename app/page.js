"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  MessageCircle, 
  X, 
  Send, 
  CheckCircle, 
  Package,
  Pill,
  HeartPulse,
  Activity,
  ShieldPlus,
  Thermometer,
  Stethoscope,
  Sparkles,
  Info,
  AlertTriangle,
  Droplet,
  Eye,
  Baby,
  Heart,
  PlusSquare,
  Zap,
  Flame,
  Wind,
  Search,
  ArrowLeft,
  User,
  Mail,
  Lock,
  LogOut,
  MapPin,
  CreditCard,
  Truck,
  ChevronDown,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Phone,
  Navigation,
  Clock,
  Store,
  Sun,
  Moon,
} from 'lucide-react';

// View components imports
import LoginView from '@/components/views/LoginView';
import HomeView from '@/components/views/HomeView';
import ShopView from '@/components/views/ShopView';
import CartView from '@/components/views/CartView';
import CheckoutView from '@/components/views/CheckoutView';
import PaymentView from '@/components/views/PaymentView';
import AIConsultView from '@/components/views/AIConsultView';
import TrackingView from '@/components/views/TrackingView';
import ContactView from '@/components/views/ContactView';
import AddressesView from '@/components/views/AddressesView';
import OrdersView, { TransactionsView } from '@/components/views/OrdersView';
import PharmacistChat from '@/components/PharmacistChat';


// --- Categories & Localized Indian Products ---
const CATEGORIES = [
  'All', 'Fever', 'Cold & Cough', 'Pain Relief', 'Immunity', 'Digestion', 
  'First Aid', 'Supplements', 'Skin Care', 'Eye & Ear Care', 'Diabetes', 
  'Heart Care', 'Women Care', 'Baby Care', 'Personal Care'
];


// --- Icon name string → component map (for API-fetched medicines) ---
const ICON_MAP = {
  Thermometer, Pill, HeartPulse, Activity, ShieldPlus,
  Stethoscope, Sparkles, Zap, Wind, Droplet, Baby, PlusSquare,
  Eye, Heart, Flame, Package,
};

const MEDICINES_LIMIT = 20;

export default function App() {
  // --- Auth State ---
  const [user, setUser] = useState(undefined);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authStep, setAuthStep] = useState('form'); // 'form', 'otp', 'reset-otp', 'new-password'
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0); 
  
  useEffect(() => {
    const savedUser = localStorage.getItem("medz_user");
    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, []);

  // --- View State ---
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'cart', 'checkout', 'orders', 'transactions', 'addresses'

  useEffect(() => {
    // Sync React state with the class set on the HTML element by the layout head script
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // --- Cart State ---
  const [cart, setCart] = useState([]);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // --- Contact Us State ---
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, error: '', success: '' });

  // --- Checkout State ---
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [activeDeliveryOrder, setActiveDeliveryOrder] = useState(null);

  // --- AI State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [explainerModal, setExplainerModal] = useState({ isOpen: false, product: null, text: '', isLoading: false });
  const [interactionModal, setInteractionModal] = useState({ isOpen: false, text: '', isLoading: false });

  // --- Medicines API State ---
  const [medicines, setMedicines] = useState([]);
  const [medicinesTotal, setMedicinesTotal] = useState(0);
  const [medicinesPage, setMedicinesPage] = useState(1);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input by 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setMedicinesPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when category changes
  useEffect(() => {
    setMedicinesPage(1);
  }, [activeCategory]);

  // Fetch medicines from backend API
  useEffect(() => {
    const fetchMedicines = async () => {
      setMedicinesLoading(true);
      try {
        const params = new URLSearchParams({
          search: debouncedSearch,
          category: activeCategory,
          page: medicinesPage.toString(),
          limit: MEDICINES_LIMIT.toString(),
        });
        const res = await fetch(`/api/medicines?${params}`);
        if (!res.ok) throw new Error('Failed to fetch medicines');
        const data = await res.json();
        setMedicines(data.medicines || []);
        setMedicinesTotal(data.total || 0);
      } catch (err) {
        console.error('Error fetching medicines:', err);
        setMedicines([]);
        setMedicinesTotal(0);
      } finally {
        setMedicinesLoading(false);
      }
    };
    fetchMedicines();
  }, [debouncedSearch, activeCategory, medicinesPage]);

  const totalPages = Math.ceil(medicinesTotal / MEDICINES_LIMIT);

  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [doctorMessages, setDoctorMessages] = useState([
    { role: 'model', text: 'Hello, I am the Med Z AI Doctor. Please describe your symptoms in detail (duration, severity, and any other context), and I will provide a preliminary triage and home care suggestions.' }
  ]);
  const [isDoctorTyping, setIsDoctorTyping] = useState(false);
  const doctorMessagesEndRef = useRef(null);
  const [doctorInput, setDoctorInput] = useState('');

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Namaste! I am your MedZ virtual pharmacist. How can I assist you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // --- OTP Countdown Timer ---
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // --- Pincode Validation ---
  useEffect(() => {
    if (addressForm.pincode.length === 6) {
      const fetchPincode = async () => {
        setPincodeLoading(true);
        setPincodeError('');
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${addressForm.pincode}`);
          const data = await res.json();
          if (data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            setAddressForm(prev => ({
              ...prev,
              city: postOffice.District,
              state: postOffice.State
            }));
          } else {
            setPincodeError('Invalid Indian PIN Code');
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
  }, [addressForm.pincode]);

  // --- Send OTP ---
  const handleSendOtp = async () => {
    if (!authForm.email) return;
    setAuthError('');
    setOtpSending(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error);
        setOtpSending(false);
        return;
      }

      setAuthStep('otp');
      setOtpCountdown(60);
    } catch (err) {
      console.warn('Send OTP failed, using local simulation:', err);
      setAuthStep('otp');
      setOtpCountdown(60);
      setOtpCode('123456');
      setAuthSuccessMsg('Simulated OTP: 123456 sent (locally bypassed)');
    } finally {
      setOtpSending(false);
    }
  };

  // --- Forgot Password Flow ---
  const handleSendResetOtp = async () => {
    if (!authForm.email) return;
    setAuthError('');
    setAuthSuccessMsg('');
    setOtpSending(true);

    try {
      const res = await fetch('/api/auth/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error);
        setOtpSending(false);
        return;
      }

      setAuthStep('reset-otp');
      setOtpCountdown(60);
    } catch (err) {
      console.warn('Send Reset OTP failed, using local simulation:', err);
      setAuthStep('reset-otp');
      setOtpCountdown(60);
      setOtpCode('123456');
      setAuthSuccessMsg('Simulated Reset Code: 123456 sent (locally bypassed)');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setAuthError('');

    try {
      const verifyRes = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, otp: otpCode }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setAuthError(verifyData.error);
        return;
      }

      setAuthStep('new-password');
    } catch (err) {
      console.warn('Verify reset OTP failed, using local simulation:', err);
      if (otpCode !== '123456') {
        setAuthError('Invalid code. Please use 123456.');
        return;
      }
      setAuthStep('new-password');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!authForm.password) return;
    setAuthError('');

    try {
      const resetRes = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: authForm.email, 
          otp: otpCode, 
          new_password: authForm.password 
        }),
      });
      const resetData = await resetRes.json();

      if (!resetRes.ok) {
        setAuthError(resetData.error);
        return;
      }

      setAuthSuccessMsg('Password successfully reset! Please sign in.');
      setAuthMode('login');
      setAuthStep('form');
      setAuthForm({ ...authForm, password: '' });
      setOtpCode('');
    } catch (err) {
      console.warn('Reset password failed, using local simulation:', err);
      const usersKey = 'mock_users';
      const users = JSON.parse(localStorage.getItem(usersKey)) || [];
      const updated = users.map(u => u.email.toLowerCase() === authForm.email.toLowerCase() ? { ...u, password: authForm.password } : u);
      localStorage.setItem(usersKey, JSON.stringify(updated));

      setAuthSuccessMsg('Simulated Reset Successful! Please sign in with your new password.');
      setAuthMode('login');
      setAuthStep('form');
      setAuthForm({ ...authForm, password: '' });
      setOtpCode('');
    }
  };

  // --- Verify OTP & Complete Signup ---
  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setAuthError('');

    try {
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, otp: otpCode }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setAuthError(verifyData.error);
        return;
      }

      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        setAuthError(signupData.error);
        return;
      }

      const safeUser = { name: authForm.name, email: authForm.email };
      localStorage.setItem('medz_user', JSON.stringify(safeUser));
      setUser(safeUser);
    } catch (err) {
      console.warn('Signup failed, using local simulation:', err);
      if (otpCode !== '123456') {
        setAuthError('Invalid code. Please use 123456.');
        return;
      }
      const safeUser = { name: authForm.name, email: authForm.email };
      const usersKey = 'mock_users';
      const users = JSON.parse(localStorage.getItem(usersKey)) || [];
      users.push({ ...safeUser, password: authForm.password });
      localStorage.setItem(usersKey, JSON.stringify(users));

      localStorage.setItem('medz_user', JSON.stringify(safeUser));
      setUser(safeUser);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (!authForm.email || !authForm.password) return;

    setAuthError('');

    // 🔵 SIGNUP — send OTP first
    if (authMode === 'signup') {
      await handleSendOtp();
      return;
    }

    // 🟢 LOGIN
    if (authMode === 'login') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authForm),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('medz_user', JSON.stringify(data));
          setUser(data);
          return;
        } else {
          if (res.status === 401) {
            setAuthError(data.error || 'Invalid credentials');
            return;
          }
        }
      } catch (err) {
        console.warn('Login proxy failed, using local simulation:', err);
      }

      const usersKey = 'mock_users';
      const users = JSON.parse(localStorage.getItem(usersKey)) || [];
      const matched = users.find(u => u.email.toLowerCase() === authForm.email.toLowerCase());
      if (matched) {
        const userObj = { name: matched.name, email: matched.email };
        localStorage.setItem('medz_user', JSON.stringify(userObj));
        setUser(userObj);
      } else {
        const namePart = authForm.email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const userObj = { name: formattedName, email: authForm.email };
        localStorage.setItem('medz_user', JSON.stringify(userObj));
        setUser(userObj);
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("medz_user");
    setUser(null);
    setAuthMode('login');
    setAuthStep('form');
    setAuthForm({ name: '', email: '', password: '' });
    setOtpCode('');
    setAuthError('');
    setAuthSuccessMsg('');
  };

  // --- Contact Submit ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true, error: '', success: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      
      setContactStatus({ loading: false, error: '', success: 'Message sent successfully! We will get back to you soon.' });
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      setContactStatus({ loading: false, error: err.message, success: '' });
    }
  };

  // --- Cart & Checkout Logic ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) return;
    setCurrentView('checkout');
    setCheckoutStep(1);
    setIsMobileSidebarOpen(false);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (pincodeError || addressForm.pincode.length !== 6) {
      setPincodeError('Please enter a valid 6-digit Indian PIN Code');
      return;
    }
    setCheckoutStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);
    if (paymentMethod === 'razorpay') {
      setTimeout(() => {
        executeOrder();
      }, 2500); // Simulate Razorpay loading
    } else {
      executeOrder();
    }
  };
const placeOrder = async () => {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user?.email,
        items: cart,
        total: cartTotal,
        address: addressForm
      })
    });
    const data = await res.json();
    return data.order_id || `ORD-${Math.floor(Math.random() * 10000)}`;
  } catch (err) {
    console.error('Order error:', err);
    return `ORD-${Math.floor(Math.random() * 10000)}`;
  }
};
  // --- Pure LocalStorage Order Processing ---
  const executeOrder = async () => {
    if (cart.length === 0) {
      setIsProcessingPayment(false);
      return;
    }

    try {
      const realOrderId = await placeOrder();

      const newOrder = {
        id: realOrderId,
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: cart,
        total: cartTotal,
        paymentMethod: paymentMethod,
        address: addressForm,
        status: 'Processing'
      };

      // 1. Save order scoped to specific user email
      const userOrdersKey = `orders_${user.email}`;
      const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
      localStorage.setItem(userOrdersKey, JSON.stringify([...existingOrders, newOrder]));

      // 2. Automatically save the address to the user's specific address book
      const userAddressKey = `addresses_${user.email}`;
      const existingAddresses = JSON.parse(localStorage.getItem(userAddressKey)) || [];
      if (!existingAddresses.some(a => a.street === addressForm.street)) {
        localStorage.setItem(userAddressKey, JSON.stringify([...existingAddresses, addressForm]));
      }

      setCart([]);
      setActiveDeliveryOrder(newOrder);
      setShowOrderModal(true);
      setTimeout(() => {
        setCheckoutStep(1);
        setIsProcessingPayment(false);
        setCurrentView('delivery');
      }, 3000);
    } catch (err) {
      console.error('Execute order error:', err);
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (showOrderModal) {
      const timer = setTimeout(() => setShowOrderModal(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showOrderModal]);

  // Fetch scoped data when navigating to history views
  useEffect(() => {
    if (user && (currentView === 'orders' || currentView === 'transactions')) {
      const savedOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrdersHistory(savedOrders.reverse());
    }
    if (user && currentView === 'addresses') {
      const addrs = JSON.parse(localStorage.getItem(`addresses_${user.email}`)) || [];
      setSavedAddresses(addrs);
    }
  }, [currentView, user]);

  // --- Chatbot Logic ---


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [isChatOpen, messages]);

  useEffect(() => {
    if (isDoctorOpen) {
      doctorMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [doctorMessages, isDoctorOpen, isDoctorTyping]);


  // --- Smart Medicine Matcher ---
  const findRelatedProducts = (text) => {
    const lowerText = text.toLowerCase();
    
    // 1. First, try to match exact product names from currently loaded medicines
    let matches = medicines.filter(p => lowerText.includes(p.name.toLowerCase()));

    // 2. If no exact matches, check for symptoms and pull from categories
    if (matches.length === 0) {
      if (lowerText.includes('fever') || lowerText.includes('headache') || lowerText.includes('temperature')) {
        matches = medicines.filter(p => p.category === 'Fever');
      } else if (lowerText.includes('cold') || lowerText.includes('cough') || lowerText.includes('throat')) {
        matches = medicines.filter(p => p.category === 'Cold & Cough');
      } else if (lowerText.includes('pain') || lowerText.includes('ache') || lowerText.includes('sprain')) {
        matches = medicines.filter(p => p.category === 'Pain Relief');
      } else if (lowerText.includes('acidity') || lowerText.includes('gas') || lowerText.includes('stomach')) {
        matches = medicines.filter(p => p.category === 'Digestion');
      }
    }
    
    // Return only the top 2 matches so we don't spam the chat window
    return matches.slice(0, 2); 
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText || !messageText.trim()) return;

    const userMsg = messageText.trim();
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const sysPrompt = "You are a professional, clean, and helpful AI pharmacist for Med Z, an online Indian pharmacy. Give concise, safe answers about health and our products. Always advise seeing a doctor for serious conditions. Keep responses brief (1-3 sentences).";
      const reply = await callGeminiAPI(userMsg, sysPrompt, false);

      // Analyze what the user asked and what the AI replied to find products
      const suggestedProducts = findRelatedProducts(userMsg + " " + reply);

      // Add AI reply to UI WITH the suggested products attached
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: reply,
        products: suggestedProducts
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Sorry, I am having trouble connecting right now. Please try again later.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    if (!doctorInput.trim()) return;
    handleDoctorMessage(doctorInput.trim());
    setDoctorInput('');
  };

  const handleDoctorMessage = async (messageText) => {
    if (!messageText || !messageText.trim()) return;

    const userMsg = messageText.trim();
    setDoctorMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsDoctorTyping(true);

    try {
      const sysPrompt = "You are the AI Doctor for Med Z. Analyze the user's symptoms and provide a preliminary clinical triage. Format your response into: 1. Possible Causes 2. Recommended Home Care (suggesting OTC categories if appropriate) 3. When to see a human doctor. Be clinical, compassionate, and clear. IMPORTANT: Do NOT use markdown asterisks/bolding. Just use plain text, numbers, and line breaks. End with a disclaimer that you are an AI.";
      const reply = await callGeminiAPI(userMsg, sysPrompt, false);
      setDoctorMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      setDoctorMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Sorry, I am having trouble connecting to the medical database right now. Please try again later.' 
      }]);
    } finally {
      setIsDoctorTyping(false);
    }
  };

  // --- New AI Functions ---
  const handleAiExplain = async (product) => {
    setExplainerModal({ isOpen: true, product, text: '', isLoading: true });
    try {
      const sysPrompt = "You are a helpful pharmacist. Explain what this medicine is used for and how it works in 2 very simple, comforting sentences for a non-medical person.";
      const reply = await callGeminiAPI(`Explain: ${product.name} - ${product.description}`, sysPrompt, false);
      setExplainerModal(prev => ({ ...prev, text: reply, isLoading: false }));
    } catch (error) {
      setExplainerModal(prev => ({ ...prev, text: 'Failed to generate explanation.', isLoading: false }));
    }
  };

  const handleCheckInteractions = async () => {
    if (cart.length < 2) return;
    setInteractionModal({ isOpen: true, text: '', isLoading: true });
    try {
      const itemNames = cart.map(item => item.name).join(', ');
      const sysPrompt = "You are a clinical pharmacist. The user is planning to buy these over-the-counter medicines together. Briefly check for any potential drug interactions between them. Keep it simple, safe, and comforting (2-3 sentences max). Always end by advising them to consult a doctor if unsure.";
      const reply = await callGeminiAPI(`Check interactions for: ${itemNames}`, sysPrompt, false);
      setInteractionModal(prev => ({ ...prev, text: reply, isLoading: false }));
    } catch (error) {
      setInteractionModal(prev => ({ ...prev, text: 'Failed to check interactions.', isLoading: false }));
    }
  };

  // --- API Integration (server-side proxy) ---
  const callGeminiAPI = async (userQuery, sysInstruction, expectJson = false) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery, systemInstruction: sysInstruction, expectJson })
      });
      const data = await response.json();
      if (!response.ok) {
        return `Error: ${data.error || 'Unknown error'}`;
      }
      return data.reply || "I couldn't process that request.";
    } catch (error) {
      return `Connection error. Please try again later.`;
    }
  };

  // --- Render Auth Screen if not logged in ---
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginView
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        authError={authError}
        setAuthError={setAuthError}
        authStep={authStep}
        setAuthStep={setAuthStep}
        authSuccessMsg={authSuccessMsg}
        setAuthSuccessMsg={setAuthSuccessMsg}
        otpCode={otpCode}
        setOtpCode={setOtpCode}
        otpSending={otpSending}
        otpCountdown={otpCountdown}
        handleAuthSubmit={handleAuthSubmit}
        handleSendOtp={handleSendOtp}
        handleVerifyAndSignup={handleVerifyAndSignup}
        handleSendResetOtp={handleSendResetOtp}
        handleVerifyResetOtp={handleVerifyResetOtp}
        handleResetPassword={handleResetPassword}
      />
    );
  }

  // --- Main App Views ---
  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 opacity-[0.02]">
        <div className="flex flex-col items-center transform -rotate-6 opacity-30">
          <Image src="/logo.png" alt="Med Z Logo Watermark" width={300} height={300} priority />
          <span className="text-[12rem] font-bold leading-none tracking-tighter mt-6">Med Z</span>
        </div>
      </div>

      <header className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-800/40 shadow-sm px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3 md:gap-12 cursor-pointer group">
          <div className="flex items-center gap-3" onClick={() => setCurrentView('home')}>
            <span className="text-xl font-black text-teal-600 tracking-tight">Med Z Pharmacy</span>
          </div>
          <div className="hidden md:flex gap-8">
            <button 
              onClick={() => setCurrentView('medicines')} 
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
            >
              Medicines
            </button>
            <button onClick={() => setIsDoctorOpen(true)} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Consultations</button>
            <button onClick={() => setCurrentView('contact')} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">Contact Us</button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-all font-semibold text-xs active:scale-95 border border-teal-100/50 dark:border-teal-900/30 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Ask AI</span>
          </button>

          <button 
            className="relative px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all duration-200 flex items-center gap-2.5 font-medium text-sm shadow-[0_2px_8px_rgb(0,0,0,0.02)] cursor-pointer"
            onClick={() => setCurrentView('cart')}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white dark:ring-slate-950">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-all duration-200 flex items-center justify-center shadow-[0_2px_8px_rgb(0,0,0,0.02)] cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center text-xs font-semibold uppercase border border-slate-200/60 dark:border-slate-700">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">{user?.name}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button 
                      onClick={() => { setCurrentView('orders'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <Package size={16} /> Order History
                    </button>
                    <button 
                      onClick={() => { setCurrentView('transactions'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <Receipt size={16} /> Transaction History
                    </button>
                    <button 
                      onClick={() => { setCurrentView('addresses'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <MapPin size={16} /> Saved Addresses
                    </button>
                    <button 
                      onClick={() => { setCurrentView('contact'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <Mail size={16} /> Contact Us
                    </button>
                  </div>
                  <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {currentView === 'home' ? (
          <HomeView
            setCurrentView={setCurrentView}
            setIsDoctorOpen={setIsDoctorOpen}
            setIsChatOpen={setIsChatOpen}
          />
        ) : currentView === 'medicines' ? (
          <ShopView
            filteredProducts={medicines}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            CATEGORIES={CATEGORIES}
            addToCart={addToCart}
            handleAiExplain={handleAiExplain}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cartCount={cartCount}
            cartTotal={cartTotal}
            cart={cart}
            setCurrentView={setCurrentView}
            setIsDoctorOpen={setIsDoctorOpen}
            setIsChatOpen={setIsChatOpen}
            handleLogout={handleLogout}
            user={user}
            loading={medicinesLoading}
            total={medicinesTotal}
            page={medicinesPage}
            setPage={setMedicinesPage}
            totalPages={totalPages}
            ICON_MAP={ICON_MAP}
          />
        ) : currentView === 'contact' ? (
          <ContactView
            contactForm={contactForm}
            setContactForm={setContactForm}
            contactStatus={contactStatus}
            handleContactSubmit={handleContactSubmit}
            setCurrentView={setCurrentView}
          />
        ) : currentView === 'cart' ? (
          <CartView
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            proceedToCheckout={proceedToCheckout}
            handleCheckInteractions={handleCheckInteractions}
            setCurrentView={setCurrentView}
          />
        ) : currentView === 'checkout' ? (
          checkoutStep === 1 ? (
            <CheckoutView
              cart={cart}
              cartCount={cartCount}
              cartTotal={cartTotal}
              checkoutStep={checkoutStep}
              setCheckoutStep={setCheckoutStep}
              addressForm={addressForm}
              setAddressForm={setAddressForm}
              handleAddressSubmit={handleAddressSubmit}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              handlePaymentSubmit={handlePaymentSubmit}
              pincodeLoading={pincodeLoading}
              pincodeError={pincodeError}
              setCurrentView={setCurrentView}
              savedAddresses={savedAddresses}
              selectSavedAddress={(addr) => {
                setAddressForm({
                  name: addr.name || '',
                  phone: addr.phone || '',
                  street: addr.street || '',
                  city: addr.city || '',
                  state: addr.state || '',
                  pincode: addr.pincode || '',
                });
              }}
            />
          ) : (
            <PaymentView
              cart={cart}
              cartCount={cartCount}
              cartTotal={cartTotal}
              setCheckoutStep={setCheckoutStep}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              handlePaymentSubmit={handlePaymentSubmit}
              setCurrentView={setCurrentView}
              isProcessingPayment={isProcessingPayment}
            />
          )
        ) : currentView === 'orders' ? (
          <OrdersView
            ordersHistory={ordersHistory}
            setCurrentView={setCurrentView}
            setActiveDeliveryOrder={setActiveDeliveryOrder}
          />
        ) : currentView === 'transactions' ? (
          <TransactionsView
            ordersHistory={ordersHistory}
            setCurrentView={setCurrentView}
          />
        ) : currentView === 'addresses' ? (
          <AddressesView
            savedAddresses={savedAddresses}
            setCurrentView={setCurrentView}
          />
        ) : currentView === 'delivery' ? (
          <TrackingView
            order={activeDeliveryOrder}
            setCurrentView={setCurrentView}
          />
        ) : currentView === 'consult' ? (
          <AIConsultView
            doctorMessages={doctorMessages}
            setDoctorMessages={setDoctorMessages}
            handleDoctorMessage={handleDoctorMessage}
            isDoctorTyping={isDoctorTyping}
            setCurrentView={setCurrentView}
            addToCart={addToCart}
          />
        ) : null}
      </div>

      {isProcessingPayment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-850 flex flex-col items-center w-[340px] animate-in zoom-in-95 duration-300">
            <div className="text-slate-900 dark:text-slate-100 mb-8 font-bold text-xl flex items-center gap-2.5">
              <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 p-2 rounded-xl"><Zap size={20} className="fill-current" /></div>
              Secure Checkout
            </div>
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-16 h-16 border-4 border-slate-100 dark:border-slate-800 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin" />
              <ShieldPlus size={18} className="absolute text-slate-900 dark:text-slate-100" />
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-bold text-base mb-1.5">Processing Payment...</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 bg-slate-50 dark:bg-slate-950/60 px-3 py-1 rounded-full">Amount: ₹{cartTotal}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-550 font-medium uppercase tracking-wider">Please do not close window</p>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col items-center max-w-sm w-full mx-4 text-center border border-slate-100/50 dark:border-slate-850 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-3">Order Confirmed</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Your Med Z package is being processed and will be delivered securely to your address.</p>
          </div>
        </div>
      )}

      {explainerModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[28px] shadow-2xl max-w-md w-full relative border border-slate-100/50 dark:border-slate-850 animate-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setExplainerModal({ isOpen: false, product: null, text: '', isLoading: false })}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                <Info size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  {explainerModal.product?.name} <Sparkles size={14} className="text-indigo-500" />
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">AI Explanation</p>
              </div>
            </div>
            
            {explainerModal.isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Generating simple explanation...</p>
              </div>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-inner shadow-slate-100/50 dark:shadow-none">
                {explainerModal.text}
              </p>
            )}
          </div>
        </div>
      )}

      {interactionModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[28px] shadow-2xl max-w-md w-full relative border border-slate-100/50 dark:border-slate-850 animate-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setInteractionModal({ isOpen: false, text: '', isLoading: false })}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl border border-amber-100/50 dark:border-amber-900/30">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  Interaction Check <Sparkles size={14} className="text-amber-500" />
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">Safety Review</p>
              </div>
            </div>
            
            {interactionModal.isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-8 h-8 border-2 border-amber-200 dark:border-amber-800 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Reviewing cart combinations...</p>
              </div>
            ) : (
              <div className="bg-amber-50/50 dark:bg-amber-955/10 p-5 rounded-2xl border border-amber-100/50 dark:border-amber-900/30">
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-4">
                  {interactionModal.text}
                </p>
                <div className="text-[11px] text-amber-700/80 dark:text-amber-400/90 font-semibold bg-amber-100/50 dark:bg-amber-950/45 px-3 py-2 rounded-lg border border-amber-900/10 dark:border-amber-900/25 flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  AI insights do not replace professional medical advice. Consult your doctor if unsure.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isDoctorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm p-4 md:p-6">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl h-[85vh] md:h-[700px] rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden relative border border-slate-200/50 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-5 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
              <div className="flex items-center gap-3.5">
                <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 p-2.5 rounded-xl shadow-sm">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">AI Triage Consult</h3>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Experimental Feature</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDoctorOpen(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:px-8 md:py-6 bg-[#F8FAFC] dark:bg-slate-950/60 space-y-6 scrollbar-hide">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4.5 rounded-2xl text-sm text-slate-600 dark:text-slate-350 mb-2 flex gap-3.5 items-start shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <p className="leading-relaxed pt-0.5">
                  <strong className="text-slate-900 dark:text-slate-100">Medical Disclaimer:</strong> This is an AI assistant, not a human doctor. Responses are for informational triage only. Always consult a qualified healthcare provider for severe, persistent, or worsening symptoms.
                </p>
              </div>
              
              {doctorMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] md:max-w-[75%] p-4.5 rounded-[20px] text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-br-[4px]' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/65 text-slate-800 dark:text-slate-200 rounded-bl-[4px]'}
                  `}>
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              {isDoctorTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 px-5 py-4 rounded-[20px] rounded-bl-[4px] shadow-sm flex items-center gap-1.5 w-fit">
                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={doctorMessagesEndRef} />
            </div>

            <form onSubmit={handleDoctorSubmit} className="p-4 md:px-6 md:py-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <input
                type="text"
                value={doctorInput}
                onChange={(e) => setDoctorInput(e.target.value)}
                placeholder="Describe duration, severity, and symptoms..."
                className="flex-1 bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-550 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all"
              />
              <button 
                type="submit"
                disabled={!doctorInput.trim() || isDoctorTyping}
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-6 py-3.5 rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-200 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-550 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span className="hidden sm:inline">Send</span> <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      <PharmacistChat
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        messages={messages}
        isTyping={isTyping}
        addToCart={addToCart}
        handleSendMessage={handleSendMessage}
      />

      {/* --- Mobile Bottom Navigation --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800 pb-safe">
        <div className="flex justify-around items-center h-[72px] px-2 pb-2">
          <button 
            onClick={() => setCurrentView('home')} 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'home' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350'}`}
          >
            <Stethoscope size={20} className={currentView === 'home' ? 'stroke-[2.5px]' : ''} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button 
            onClick={() => {
              setCurrentView('medicines');
              setIsMobileSidebarOpen(true);
            }} 
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350"
          >
            <Search size={20} />
            <span className="text-[10px] font-semibold">Search</span>
          </button>
          <button 
            onClick={() => setCurrentView('cart')} 
            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'cart' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350'}`}
          >
            <div className="relative">
              <ShoppingCart size={20} className={currentView === 'cart' ? 'stroke-[2.5px]' : ''} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-955 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-950">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Cart</span>
          </button>
          <button 
            onClick={() => {
              setCurrentView('medicines');
              setIsMobileSidebarOpen(true);
            }} 
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350"
          >
            <User size={20} />
            <span className="text-[10px] font-semibold">Account</span>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}