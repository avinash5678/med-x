"use client"
import React, { useState, useEffect, useRef } from 'react';
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


// --- Categories & Localized Indian Products ---
const CATEGORIES = [
  'All', 'Fever', 'Cold & Cough', 'Pain Relief', 'Immunity', 'Digestion', 
  'First Aid', 'Supplements', 'Skin Care', 'Eye & Ear Care', 'Diabetes', 
  'Heart Care', 'Women Care', 'Baby Care', 'Personal Care'
];


const BASE_PRODUCTS = [
  { id: 901, name: 'NeuroEase Max', price: 1999, category: 'Pain Relief', description: 'Rapid release formula for neurological comfort and muscle relaxation.', icon: Zap, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUafx17L_BWZG-fshbbdBVoqGk7GEBFv_7fzm7ucgEqLLV0iY1pciuBqCBys2E9vMOxCGzAmWNXg5aNBcHZW0fsqb45IfrPMl3BraSSJVbj58DJR5oWU3zWAnNOO5LEAHUqpbLMQHLSdXmj0IsqVpMkcLlrxZhBDj6i7q_IsI06Iy4jLVBe7Qzns-3OuEaWjbv6iSSygLoyhYPpcizlonZItTP6L42c4QCIRdzQgOtIfKJnnT8e6lPzRrPcEC4qS7w2PLaVy_Pjig' },
  { id: 902, name: 'GlucoControl X', price: 3399, category: 'Diabetes', description: 'Daily maintenance supplement for stable metabolic health and sugar levels.', icon: Activity, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcdxdTinU_JYCYFnk1AEOsAVe_Xm2kJR9G16o1BIcGC5EQNpetXr1Tfo0h7pKMcMKwx0nzpcnAHfWoo9BOlNpPnB49L2qy8mts19yMdrtZL0sg2IHp2P8_6bvAJXi4gCgOJfSfJ9pOVhLIFQNtTxpeAA5YvgKcaF1iXMFemfSnzVPKyvZQ3qj2ACo74B9HBuzmyI0yTK6RQI3i3Yyngw0W7vNzsNrJJVo0a8NA3-zr6eZ-BaK0kchTRFYlxicwUCb1RpeKmcxDxRg' },
  { id: 903, name: 'DermalRevive Pro', price: 1499, category: 'Skin Care', description: 'Advanced dermatological repair cream with bio-available nutrients.', icon: Sparkles, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoxTl4hspZ_7gM_hXRj4h2Cc5p9rcZJPgDed7ZiBqkeSeck6grwgBh3o2ImXRTSll3_lGKg9g8NGOUkvFkd4xtJpLjHn16kr48tPhtGi0YP-wQH0s8dc_gpphVHCoyEqrY-GTL8FaIm6tE1ekkkLiemw168_Ol3NEJKdY8O7XPKHPKreYUdX30g13N1ma0Btfjo6jNxVaOs4K-2I-s5PlShkxS7_KNisiH6KaIwfUKb0Ospg9op1mYkz5OVcrkFsq5Cb3RHF8wN8g' },
  { id: 904, name: 'Vitality+ Multi', price: 2799, category: 'Supplements', description: 'Comprehensive multivitamin optimized for 21st-century lifestyles.', icon: Zap, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpNCFR0fCwjRMpFSWOr_MenKlR-9RMxlTgOCavPC3OuqhJYg_bMYpsIdayRlA4Uw82Trv4SlsU7BzX_6KwHYs-zc_vX0Y27L7_co40TGJWU4-4bkNrZMATISxKRjGaPb27oW3nUynPEg_sk6Gr9a70zAnX7YXjoBK3ZRXZXjILx1EVsoWjtMZx_VtHwVSh9uC7tKFmSt6lpCR8xHSgZl8BHsbK0UrD3e2cCCFSUoah6cO_QEkyAuKd7rLq2aPYljuXJJWfa4AJUVQ' },
  { id: 1, name: 'Dolo 650', price: 30, category: 'Fever', description: 'Fast relief from fever and pain. 15 tablets.', icon: Thermometer },
  { id: 2, name: 'Crocin Advance', price: 20, category: 'Fever', description: 'Paracetamol fast release tablets.', icon: Thermometer },
  { id: 3, name: 'Calpol 500', price: 15, category: 'Fever', description: 'Effective fever reducer.', icon: Thermometer },
  { id: 4, name: 'Paracip 500', price: 12, category: 'Fever', description: 'Mild pain and fever relief.', icon: Thermometer },
  { id: 5, name: 'Sumo Tablet', price: 45, category: 'Fever', description: 'Nimesulide & Paracetamol for fever.', icon: Thermometer },
  { id: 6, name: 'Fepanil 650', price: 28, category: 'Fever', description: 'High fever relief.', icon: Thermometer },
  { id: 7, name: 'Meftal P', price: 35, category: 'Fever', description: 'Fever and pain relief syrup for children.', icon: Baby },
  { id: 8, name: 'Tylenol 500', price: 90, category: 'Fever', description: 'Imported fever reducer.', icon: Thermometer },
  { id: 9, name: 'Benadryl Syrup', price: 120, category: 'Cold & Cough', description: 'Effective relief from cough and throat irritation. 150ml.', icon: Wind },
  { id: 10, name: 'Vicks Vaporub', price: 85, category: 'Cold & Cough', description: 'Multi-symptom cold relief. 50g pack.', icon: Wind },
  { id: 11, name: 'Honitus Syrup', price: 95, category: 'Cold & Cough', description: 'Dabur herbal cough syrup.', icon: Activity },
  { id: 12, name: 'Ascoril LS', price: 110, category: 'Cold & Cough', description: 'Expectorant for wet cough.', icon: Activity },
  { id: 13, name: 'Corex DX', price: 105, category: 'Cold & Cough', description: 'Dry cough relief.', icon: Activity },
  { id: 14, name: 'Sinarest', price: 65, category: 'Cold & Cough', description: 'Cold and sinus relief tablets.', icon: Pill },
  { id: 15, name: 'Cheston Cold', price: 45, category: 'Cold & Cough', description: 'Anti-allergic and cold relief.', icon: Pill },
  { id: 16, name: 'Otrivin Nasal', price: 80, category: 'Cold & Cough', description: 'Blocked nose relief spray.', icon: Droplet },
  { id: 17, name: 'Vicks Action 500', price: 40, category: 'Cold & Cough', description: 'Headache and cold relief.', icon: Pill },
  { id: 18, name: 'Koflet Lozenge', price: 30, category: 'Cold & Cough', description: 'Himalaya cough drops.', icon: Pill },
  { id: 19, name: 'Volini Spray', price: 150, category: 'Pain Relief', description: 'Instant relief from muscle ache and joint pain. 60g.', icon: Zap },
  { id: 20, name: 'Combiflam', price: 40, category: 'Pain Relief', description: 'Combines Ibuprofen and Paracetamol for strong pain relief. 20 tablets.', icon: Pill },
  { id: 21, name: 'Moov Ointment', price: 140, category: 'Pain Relief', description: 'Back pain relief cream.', icon: Zap },
  { id: 22, name: 'Iodex Balm', price: 50, category: 'Pain Relief', description: 'Multipurpose pain balm.', icon: Zap },
  { id: 23, name: 'Relispray', price: 160, category: 'Pain Relief', description: 'Aerosol spray for sports injuries.', icon: Zap },
  { id: 24, name: 'Zandu Balm', price: 45, category: 'Pain Relief', description: 'Headache and body ache balm.', icon: Zap },
  { id: 25, name: 'Saridon', price: 35, category: 'Pain Relief', description: 'Severe headache relief.', icon: Pill },
  { id: 26, name: 'Disprin', price: 15, category: 'Pain Relief', description: 'Water soluble pain reliever.', icon: Pill },
  { id: 27, name: 'Zerodol SP', price: 95, category: 'Pain Relief', description: 'Muscle pain and swelling relief.', icon: Pill },
  { id: 28, name: 'Voveran Gel', price: 120, category: 'Pain Relief', description: 'Diclofenac gel for joint pain.', icon: Zap },
  { id: 29, name: 'Limcee Vitamin C', price: 60, category: 'Immunity', description: 'Daily immunity booster. Orange flavor, 15 chewable tablets.', icon: ShieldPlus },
  { id: 30, name: 'Zincovit', price: 105, category: 'Immunity', description: 'Multivitamin and multimineral tablets.', icon: ShieldPlus },
  { id: 31, name: 'Chyawanprash', price: 290, category: 'Immunity', description: 'Dabur ayurvedic immunity paste.', icon: ShieldPlus },
  { id: 32, name: 'Giloy Ghanvati', price: 110, category: 'Immunity', description: 'Patanjali natural immunity booster.', icon: ShieldPlus },
  { id: 33, name: 'Septilin', price: 140, category: 'Immunity', description: 'Himalaya tablets for immune support.', icon: ShieldPlus },
  { id: 34, name: 'Amla Juice', price: 180, category: 'Immunity', description: 'Natural vitamin C source.', icon: Droplet },
  { id: 35, name: 'Supradyn', price: 55, category: 'Immunity', description: 'Daily multivitamin.', icon: ShieldPlus },
  { id: 36, name: 'Celin 500', price: 40, category: 'Immunity', description: 'Vitamin C supplement.', icon: ShieldPlus },
  { id: 37, name: 'Electral ORS', price: 45, category: 'Digestion', description: 'WHO based formula for instant hydration & energy.', icon: HeartPulse },
  { id: 38, name: 'Gelusil Liquid', price: 110, category: 'Digestion', description: 'Antacid liquid for acidity and gas relief. 200ml.', icon: Activity },
  { id: 39, name: 'Eno Fruit Salt', price: 55, category: 'Digestion', description: 'Instant acidity relief.', icon: Flame },
  { id: 40, name: 'Pudin Hara', price: 30, category: 'Digestion', description: 'Ayurvedic stomach ache relief.', icon: Pill },
  { id: 41, name: 'Digene Tablets', price: 25, category: 'Digestion', description: 'Chewable antacid.', icon: Pill },
  { id: 42, name: 'Hajmola', price: 40, category: 'Digestion', description: 'Digestive tasty tablets.', icon: Pill },
  { id: 43, name: 'Isabgol', price: 120, category: 'Digestion', description: 'Psyllium husk for constipation.', icon: Package },
  { id: 44, name: 'Omez 20', price: 60, category: 'Digestion', description: 'Acidity and ulcer capsule.', icon: Pill },
  { id: 45, name: 'Pantocid 40', price: 130, category: 'Digestion', description: 'GERD and acidity medicine.', icon: Pill },
  { id: 46, name: 'Cremaffin', price: 210, category: 'Digestion', description: 'Constipation relief syrup.', icon: Droplet },
  { id: 47, name: 'Dettol Liquid', price: 160, category: 'First Aid', description: 'Antiseptic liquid.', icon: PlusSquare },
  { id: 48, name: 'Savlon Liquid', price: 110, category: 'First Aid', description: 'Antiseptic and healing liquid.', icon: PlusSquare },
  { id: 49, name: 'Betadine Ointment', price: 95, category: 'First Aid', description: 'Povidone-iodine for cuts.', icon: PlusSquare },
  { id: 50, name: 'Band-Aid', price: 50, category: 'First Aid', description: 'Pack of 20 waterproof plasters.', icon: PlusSquare },
  { id: 51, name: 'Cotton Roll', price: 40, category: 'First Aid', description: 'Surgical grade cotton.', icon: Package },
  { id: 52, name: 'Crepe Bandage', price: 120, category: 'First Aid', description: 'For sprains and strains.', icon: Package },
  { id: 53, name: 'Burnol', price: 65, category: 'First Aid', description: 'Cream for minor burns.', icon: Flame },
  { id: 54, name: 'Soframycin', price: 55, category: 'First Aid', description: 'Antibacterial skin cream.', icon: PlusSquare },
  { id: 55, name: 'Surgical Tape', price: 30, category: 'First Aid', description: 'Micropore medical tape.', icon: Package },
  { id: 56, name: 'Thermometer', price: 250, category: 'First Aid', description: 'Digital thermometer.', icon: Thermometer },
  { id: 57, name: 'Revital H', price: 250, category: 'Supplements', description: 'Ginseng and multivitamin capsule.', icon: Zap },
  { id: 58, name: 'Neurobion Forte', price: 35, category: 'Supplements', description: 'Vitamin B complex.', icon: Pill },
  { id: 59, name: 'Shelcal 500', price: 110, category: 'Supplements', description: 'Calcium and Vitamin D3.', icon: Pill },
  { id: 60, name: 'Evion 400', price: 40, category: 'Supplements', description: 'Vitamin E capsules for skin and hair.', icon: Pill },
  { id: 61, name: 'Becosules', price: 45, category: 'Supplements', description: 'B-Complex with Vitamin C.', icon: Pill },
  { id: 62, name: 'Fish Oil Omega 3', price: 599, category: 'Supplements', description: 'Heart and brain health.', icon: Heart },
  { id: 63, name: 'Calcium Sandoz', price: 180, category: 'Supplements', description: 'Calcium for bones.', icon: Pill },
  { id: 64, name: 'Maxirich', price: 150, category: 'Supplements', description: 'Daily energy supplement.', icon: Zap },
  { id: 65, name: 'Macfolate', price: 220, category: 'Supplements', description: 'Folic acid supplement.', icon: Pill },
  { id: 66, name: 'Uprise D3', price: 280, category: 'Supplements', description: 'Vitamin D3 weekly capsule.', icon: Pill },
  { id: 67, name: 'Boroline', price: 45, category: 'Skin Care', description: 'Antiseptic ayurvedic cream.', icon: Sparkles },
  { id: 68, name: 'BoroPlus', price: 60, category: 'Skin Care', description: 'Healthy skin cream.', icon: Sparkles },
  { id: 69, name: 'Aloe Vera Gel', price: 120, category: 'Skin Care', description: 'Soothing skin gel.', icon: Sparkles },
  { id: 70, name: 'Candid Dusting', price: 140, category: 'Skin Care', description: 'Anti-fungal powder.', icon: Sparkles },
  { id: 71, name: 'Itch Guard', price: 85, category: 'Skin Care', description: 'Fungal infection relief.', icon: Sparkles },
  { id: 72, name: 'Ring Guard', price: 75, category: 'Skin Care', description: 'Ringworm treatment.', icon: Sparkles },
  { id: 73, name: 'Himalaya Neem Wash', price: 150, category: 'Skin Care', description: 'Pimple clear face wash.', icon: Sparkles },
  { id: 74, name: 'Cetaphil Cleanser', price: 450, category: 'Skin Care', description: 'Gentle skin cleanser.', icon: Droplet },
  { id: 75, name: 'Salicylic Acid', price: 300, category: 'Skin Care', description: 'Acne treatment serum.', icon: Droplet },
  { id: 76, name: 'Lacto Calamine', price: 180, category: 'Skin Care', description: 'Oil balance lotion.', icon: Sparkles },
  { id: 77, name: 'Refresh Tears', price: 150, category: 'Eye & Ear Care', description: 'Lubricating eye drops.', icon: Eye },
  { id: 78, name: 'Ciplox Eye/Ear', price: 20, category: 'Eye & Ear Care', description: 'Antibiotic drops.', icon: Eye },
  { id: 79, name: 'Clearine', price: 65, category: 'Eye & Ear Care', description: 'Redness relief eye drop.', icon: Eye },
  { id: 80, name: 'Itone Eye Drops', price: 55, category: 'Eye & Ear Care', description: 'Ayurvedic eye drops.', icon: Eye },
  { id: 81, name: 'Waxolve Ear Drop', price: 85, category: 'Eye & Ear Care', description: 'Ear wax solvent.', icon: Droplet },
  { id: 82, name: 'Otek AC', price: 110, category: 'Eye & Ear Care', description: 'Ear pain and infection relief.', icon: Droplet },
  { id: 83, name: 'Drishti Eye Drop', price: 45, category: 'Eye & Ear Care', description: 'Patanjali vision drop.', icon: Eye },
  { id: 84, name: 'Sugar Free Gold', price: 150, category: 'Diabetes', description: 'Artificial sweetener pellets.', icon: Activity },
  { id: 85, name: 'Accu-Chek Strips', price: 950, category: 'Diabetes', description: 'Test strips pack of 50.', icon: Activity },
  { id: 86, name: 'Karela Jamun Juice', price: 250, category: 'Diabetes', description: 'Ayurvedic sugar control.', icon: Droplet },
  { id: 87, name: 'Madhunashini', price: 220, category: 'Diabetes', description: 'Patanjali diabetes control.', icon: Pill },
  { id: 88, name: 'Galvus Met', price: 350, category: 'Diabetes', description: 'Prescription diabetes care.', icon: Pill },
  { id: 89, name: 'Arjuna Bark Powder', price: 120, category: 'Heart Care', description: 'Ayurvedic heart tonic.', icon: Heart },
  { id: 90, name: 'BP Monitor', price: 1500, category: 'Heart Care', description: 'Digital blood pressure machine.', icon: HeartPulse },
  { id: 91, name: 'Garlic Pearls', price: 140, category: 'Heart Care', description: 'Cholesterol control capsules.', icon: Heart },
  { id: 92, name: 'Ecosprin 75', price: 10, category: 'Heart Care', description: 'Blood thinner.', icon: Heart },
  { id: 93, name: 'Rosuvas 10', price: 180, category: 'Heart Care', description: 'Cholesterol reducer.', icon: Heart },
  { id: 94, name: 'Whisper Choice', price: 85, category: 'Women Care', description: 'Sanitary pads pack of 6.', icon: Sparkles },
  { id: 95, name: 'V Wash Plus', price: 180, category: 'Women Care', description: 'Intimate hygiene wash.', icon: Droplet },
  { id: 96, name: 'Dexorange', price: 140, category: 'Women Care', description: 'Iron and folic acid syrup.', icon: Droplet },
  { id: 97, name: 'Pregakem', price: 55, category: 'Women Care', description: 'Pregnancy detection kit.', icon: PlusSquare },
  { id: 98, name: 'Meftal Spas', price: 45, category: 'Women Care', description: 'Period pain relief.', icon: Pill },
  { id: 99, name: 'Pampers Diapers', price: 399, category: 'Baby Care', description: 'Medium size, 30 count.', icon: Baby },
  { id: 100, name: 'Himalaya Baby Powder', price: 120, category: 'Baby Care', description: 'Gentle talc for babies.', icon: Baby },
  { id: 101, name: 'Woodwards Gripe Water', price: 70, category: 'Baby Care', description: 'Colic and digestion relief.', icon: Baby },
  { id: 102, name: 'Sebamed Baby Wash', price: 450, category: 'Baby Care', description: 'pH 5.5 extra soft wash.', icon: Baby },
  { id: 103, name: 'Baby Massage Oil', price: 180, category: 'Baby Care', description: 'Dabur Lal Tail.', icon: Baby },
  { id: 104, name: 'Sensodyne Paste', price: 160, category: 'Personal Care', description: 'For sensitive teeth.', icon: Sparkles },
  { id: 105, name: 'Listerine Mouthwash', price: 150, category: 'Personal Care', description: 'Cool mint, 250ml.', icon: Droplet },
  { id: 106, name: 'Gillete Vector', price: 110, category: 'Personal Care', description: 'Twin blade razor.', icon: Sparkles },
  { id: 107, name: 'Nivea Roll On', price: 199, category: 'Personal Care', description: 'Underarm deodorant.', icon: Sparkles },
  { id: 108, name: 'Dettol Soap', price: 120, category: 'Personal Care', description: 'Pack of 3 antibacterial soaps.', icon: PlusSquare }
];

// --- Procedurally Generate 500 More Medicines ---
const extraMedicines = [];
const genericNames = ['Paracetamol', 'Ibuprofen', 'Cetirizine', 'Amoxicillin', 'Azithromycin', 'Omeprazole', 'Pantoprazole', 'Metformin', 'Glimepiride', 'Aspirin', 'Atorvastatin', 'Rosuvastatin', 'Amlodipine', 'Telmisartan', 'Losartan', 'Levocetirizine', 'Montelukast', 'Diclofenac', 'Aceclofenac', 'Rabeprazole'];
const brands = ['Cipla', 'Sun Pharma', 'Lupin', 'Dr.Reddys', 'Mankind', 'Alkem', 'Intas', 'Torrent', 'Zydus', 'Glenmark'];
for(let i = 0; i < 500; i++) {
  const generic = genericNames[i % genericNames.length];
  const brand = brands[i % brands.length];
  const catOptions = CATEGORIES.filter(c => c !== 'All');
  extraMedicines.push({
    id: 200 + i,
    name: `${brand} ${generic} ${Math.floor(Math.random() * 500 + 100)}mg`,
    price: Math.floor(Math.random() * 300) + 15,
    category: catOptions[Math.floor(Math.random() * catOptions.length)],
    description: `Generic ${generic} formulated and manufactured by ${brand}.`,
    icon: Pill
  });
}

const PRODUCTS = [...BASE_PRODUCTS, ...extraMedicines];

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

  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [doctorMessages, setDoctorMessages] = useState([
    { role: 'model', text: 'Hello, I am the Med Z AI Doctor. Please describe your symptoms in detail (duration, severity, and any other context), and I will provide a preliminary triage and home care suggestions.' }
  ]);
  const [doctorInput, setDoctorInput] = useState('');
  const [isDoctorTyping, setIsDoctorTyping] = useState(false);
  const doctorMessagesEndRef = useRef(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Namaste! I am your MedZ virtual pharmacist. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Derived Data ---
  const searchedProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = activeCategory === 'All' 
    ? searchedProducts 
    : searchedProducts.filter(p => p.category === activeCategory);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

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
      setAuthError('Failed to connect to server.');
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
      setAuthError('Failed to connect to server.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setAuthError('');

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
    // DO NOT clear otpCode here, it is needed for the final reset step
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!authForm.password) return;
    setAuthError('');

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
  };

  // --- Verify OTP & Complete Signup ---
  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setAuthError('');

    // Step 1: Verify OTP
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

    // Step 2: Complete signup
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
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authForm),
    });

    const data = await res.json();

    if (!res.ok) {
      setAuthError(data.error);
      return;
    }

    localStorage.setItem('medz_user', JSON.stringify(data));
    setUser(data);
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
    if (paymentMethod === 'razorpay') {
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
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
    if (cart.length === 0) return;

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
    setCheckoutStep(1);
    setActiveDeliveryOrder(newOrder);
    setShowOrderModal(true);
    setTimeout(() => {
      setCurrentView('delivery');
    }, 3000);
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
    
    // 1. First, try to match exact product names
    let matches = PRODUCTS.filter(p => lowerText.includes(p.name.toLowerCase()));

    // 2. If no exact matches, check for symptoms and pull from categories
    if (matches.length === 0) {
      if (lowerText.includes('fever') || lowerText.includes('headache') || lowerText.includes('temperature')) {
        matches = PRODUCTS.filter(p => p.category === 'Fever');
      } else if (lowerText.includes('cold') || lowerText.includes('cough') || lowerText.includes('throat')) {
        matches = PRODUCTS.filter(p => p.category === 'Cold & Cough');
      } else if (lowerText.includes('pain') || lowerText.includes('ache') || lowerText.includes('sprain')) {
        matches = PRODUCTS.filter(p => p.category === 'Pain Relief');
      } else if (lowerText.includes('acidity') || lowerText.includes('gas') || lowerText.includes('stomach')) {
        matches = PRODUCTS.filter(p => p.category === 'Digestion');
      }
    }
    
    // Return only the top 2 matches so we don't spam the chat window
    return matches.slice(0, 2); 
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
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

  const handleDoctorMessage = async (e) => {
    e?.preventDefault();
    if (!doctorInput.trim()) return;

    const userMsg = doctorInput.trim();
    setDoctorMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setDoctorInput('');
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
            filteredProducts={filteredProducts}
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
            doctorInput={doctorInput}
            setDoctorInput={setDoctorInput}
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

            <form onSubmit={handleDoctorMessage} className="p-4 md:px-6 md:py-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3">
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
                  <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span> Online</p>
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

            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about health..."
                className="flex-1 bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 focus:ring-4 focus:ring-slate-900/5 dark:focus:ring-white/5 transition-all"
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