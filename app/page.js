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
  Menu,
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
  Map as MapIcon
} from 'lucide-react';

// --- Categories & Localized Indian Products ---
const CATEGORIES = [
  'All', 'Fever', 'Cold & Cough', 'Pain Relief', 'Immunity', 'Digestion', 
  'First Aid', 'Supplements', 'Skin Care', 'Eye & Ear Care', 'Diabetes', 
  'Heart Care', 'Women Care', 'Baby Care', 'Personal Care'
];

const BASE_PRODUCTS = [
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

const DeliveryTrackingView = ({ order, setCurrentView }) => {
  const [status, setStatus] = useState(2); // 0: Placed, 1: Packed, 2: Out for Delivery, 3: Delivered
  const [eta, setEta] = useState('14 mins');
  const [mapLoaded, setMapLoaded] = useState(false);

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

      // Handle React strict mode hot reloading
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
        html: `<div style="background-color:#0f172a;width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 6px rgba(0,0,0,0.3);border:2px solid white;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      const shopMarker = L.marker([28.6200, 77.2100], { icon: shopIcon }).addTo(map);

      // Customer Marker
      const customerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#3b82f6;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 6px rgba(0,0,0,0.3);border:2px solid white;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      const customerMarker = L.marker([28.6000, 77.2200], { icon: customerIcon }).addTo(map);

      // Delivery Agent Marker
      const deliveryIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#10b981;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(16,185,129,0.4);border:3px solid white;z-index:1000;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      let agentLat = 28.6180;
      let agentLng = 77.2110;
      const deliveryMarker = L.marker([agentLat, agentLng], { icon: deliveryIcon, zIndexOffset: 1000 }).addTo(map);

      // Simple Animation
      const targetLat = 28.6010;
      const targetLng = 77.2190;
      const steps = 600; // 10 minutes at 1 update per second
      let currentStep = 0;

      const latStep = (targetLat - agentLat) / steps;
      const lngStep = (targetLng - agentLng) / steps;

      interval = setInterval(() => {
        if (currentStep < steps) {
          agentLat += latStep;
          agentLng += lngStep;
          deliveryMarker.setLatLng([agentLat, agentLng]);
          
          // Update ETA down
          const remainingMins = Math.max(1, Math.ceil(14 - (14 * (currentStep / steps))));
          setEta(`${remainingMins} mins`);

          currentStep++;
        } else {
          clearInterval(interval);
          setStatus(3);
          setEta('Delivered');
        }
      }, 1000);

      // Fit bounds
      const group = new L.featureGroup([shopMarker, customerMarker, deliveryMarker]);
      map.fitBounds(group.getBounds().pad(0.3));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto min-h-[calc(100vh-80px)] bg-slate-50 pb-20 md:pb-8 md:pt-8 md:px-6">
      {/* Header */}
      <div className="bg-white px-6 py-5 md:rounded-2xl md:mb-6 sticky top-0 md:relative z-50 flex items-center shadow-sm">
        <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors mr-3">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Track Order</h1>
          <p className="text-sm text-slate-500 font-medium">{order?.id || 'ORD-1234'}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-0 md:gap-6">
        {/* Map Section */}
        <div className="relative h-[400px] md:h-[700px] w-full md:w-2/3 bg-slate-200 md:rounded-[32px] overflow-hidden shadow-sm z-0">
          <div id="delivery-map" className="w-full h-full z-0"></div>
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-sm z-10">
              <div className="w-8 h-8 border-4 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* ETA Overlay */}
          <div className="absolute top-6 inset-x-0 flex justify-center z-20 pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-lg flex flex-col items-center pointer-events-auto">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-0.5">Estimated Time</span>
              <span className="text-xl font-bold">{eta}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details Sidebar */}
        <div className="bg-white rounded-t-[32px] md:rounded-[32px] -mt-6 md:mt-0 relative z-30 pt-8 pb-10 px-6 shadow-[0_-10px_40px_rgb(0,0,0,0.08)] md:shadow-md w-full md:w-1/3 flex flex-col h-fit">
          
          {/* Status Timeline */}
          <div className="mb-8">
            <div className="flex justify-between relative">
              <div className="absolute top-4 left-[10%] right-[10%] h-[3px] bg-slate-100 z-0">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000 ease-out z-0" 
                  style={{ width: `${(status / 3) * 100}%` }}
                />
              </div>

              {['Placed', 'Packed', 'On the way', 'Delivered'].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center relative z-10 w-1/4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 mb-2 shadow-sm ${idx <= status ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                    {idx < status ? <CheckCircle2 size={16} /> : 
                     idx === 0 ? <Receipt size={16} /> :
                     idx === 1 ? <Package size={16} /> :
                     idx === 2 ? <Truck size={16} /> : <MapPin size={16} />}
                  </div>
                  <span className={`text-[11px] font-bold text-center ${idx <= status ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Agent Profile */}
          <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-5 mb-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
                  <User size={24} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={10} className="text-white" />
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-base">Rajesh Kumar</p>
                <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                  <Truck size={12} /> Delivery Partner
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  {[1,2,3,4,5].map(star => <svg key={star} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                  <span className="text-[11px] font-bold text-slate-600 ml-1">4.9</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <MessageCircle size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
                <Phone size={18} />
              </button>
            </div>
          </div>

          {/* Shop Info */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white">
                <Store size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Med Z Central Pharmacy</p>
                <p className="text-slate-500 text-xs font-medium mt-0.5">Connaught Place, New Delhi</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-emerald-500 transition-colors">
              <Phone size={18} />
            </button>
          </div>

          {/* Order Details Snippet */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Order Details</h3>
              <span className="text-emerald-600 font-bold text-sm">₹{order?.total || 0}</span>
            </div>
            <div className="space-y-3">
              {order?.items?.slice(0, 2).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">{item.quantity}x {item.name}</span>
                  <span className="text-slate-900 font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              {order?.items?.length > 2 && (
                <div className="text-xs text-slate-400 font-medium pt-1">
                  + {order.items.length - 2} more items
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(null);
    }
  }, []);

  // --- View State ---
  const [currentView, setCurrentView] = useState('home'); // 'home', 'cart', 'checkout', 'orders', 'transactions', 'addresses'
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
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user?.email,
        items: cart,
        total: cartTotal
      })
    });
  } catch (err) {
    console.error('Order error:', err);
  }
};
  // --- Pure LocalStorage Order Processing ---
  const executeOrder = async () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
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


    await placeOrder();
    setCart([]);
    setCheckoutStep(1);
    setActiveDeliveryOrder(newOrder);
    setCurrentView('delivery');
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.02]">
          <div className="flex flex-col items-center transform -rotate-12 opacity-50">
            <Image src="/logo.png" alt="Med Z Logo Watermark" width={400} height={400} priority />
          </div>
        </div>

        <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10 p-10">
          <div className="flex flex-col items-center justify-center mb-8">
            <Image src="/logo.png" alt="Med Z Logo" width={64} height={64} className="mb-5 rounded-2xl shadow-sm" priority />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Med Z</h1>
            <p className="text-slate-500 text-sm mt-1.5">
              {authStep === 'otp' ? 'Verify your email' 
                : authStep === 'reset-otp' ? 'Password Reset Code'
                : authStep === 'new-password' ? 'Create New Password'
                : authMode === 'login' ? 'Sign in to your account' 
                : authMode === 'forgot-password' ? 'Reset your password'
                : 'Create a new account'}
            </p>
          </div>

          {authSuccessMsg && (
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm font-medium text-center border border-emerald-100 mb-4 animate-fade-in">
              {authSuccessMsg}
            </div>
          )}

          {/* --- OTP Verification Step --- */}
          {authStep === 'otp' ? (
            <form onSubmit={handleVerifyAndSignup} className="space-y-4">
              {authError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center border border-red-100">
                  {authError}
                </div>
              )}

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-600">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-bold text-slate-900 mt-1">{authForm.email}</p>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldPlus size={18} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-center tracking-[0.3em] font-bold text-lg"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_12px_rgb(0,0,0,0.1)] active:scale-[0.98] mt-2"
              >
                Verify & Create Account
              </button>

              <div className="text-center pt-2">
                {otpCountdown > 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Resend code in {otpCountdown}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSending}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
                  >
                    {otpSending ? 'Sending...' : 'Resend Code'}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => { setAuthStep('form'); setOtpCode(''); setAuthError(''); }}
                className="w-full text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mt-2"
              >
                ← Back to signup form
              </button>
            </form>
          ) : authStep === 'reset-otp' ? (
            /* --- Password Reset OTP Step --- */
            <form onSubmit={handleVerifyResetOtp} className="space-y-4 animate-fade-in">
              {authError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center border border-red-100">
                  {authError}
                </div>
              )}

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-600">
                  We sent a reset code to
                </p>
                <p className="text-sm font-bold text-slate-900 mt-1">{authForm.email}</p>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldPlus size={18} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-center tracking-[0.3em] font-bold text-lg"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_12px_rgb(0,0,0,0.1)] active:scale-[0.98] mt-2"
              >
                Verify Code
              </button>

              <div className="text-center pt-2">
                {otpCountdown > 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Resend code in {otpCountdown}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendResetOtp}
                    disabled={otpSending}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
                  >
                    {otpSending ? 'Sending...' : 'Resend Code'}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => { setAuthStep('form'); setOtpCode(''); setAuthError(''); }}
                className="w-full text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mt-2"
              >
                ← Back
              </button>
            </form>
          ) : authStep === 'new-password' ? (
            /* --- New Password Step --- */
            <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
              {authError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center border border-red-100">
                  {authError}
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-slate-900">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_12px_rgb(0,0,0,0.1)] active:scale-[0.98] mt-4"
              >
                Save New Password
              </button>
            </form>
          ) : authMode === 'forgot-password' ? (
            /* --- Forgot Password Request Form --- */
            <form onSubmit={(e) => { e.preventDefault(); handleSendResetOtp(); }} className="space-y-4 animate-fade-in">
              {authError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center border border-red-100">
                  {authError}
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-slate-900">
                  <Mail size={18} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={otpSending}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_12px_rgb(0,0,0,0.1)] active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {otpSending ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccessMsg(''); }}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Back to login
                </button>
              </div>
            </form>
          ) : (
            /* --- Login / Signup Form --- */
            <>
              <form onSubmit={handleAuthSubmit} className="space-y-4 animate-fade-in">
                {authError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center border border-red-100">
                    {authError}
                  </div>
                )}
                
                {authMode === 'signup' && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-slate-900">
                      <User size={18} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                    />
                  </div>
                )}
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-slate-900">
                    <Mail size={18} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-slate-900">
                    <Lock size={18} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>

                {authMode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot-password'); setAuthError(''); setAuthSuccessMsg(''); }}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpSending}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_12px_rgb(0,0,0,0.1)] active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {authMode === 'login' ? 'Sign In' : (otpSending ? 'Sending OTP...' : 'Continue')}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setAuthForm({ name: '', email: '', password: '' });
                    setAuthStep('form');
                    setOtpCode('');
                    setAuthError('');
                  }}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- Main App Views ---
  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 opacity-[0.02]">
        <div className="flex flex-col items-center transform -rotate-6 opacity-30">
          <Image src="/logo.png" alt="Med Z Logo Watermark" width={300} height={300} priority />
          <span className="text-[12rem] font-bold leading-none tracking-tighter mt-6">Med Z</span>
        </div>
      </div>

      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setCurrentView('home')}
        >
          <div className="flex items-center justify-center bg-white border border-slate-200/60 p-1 rounded-xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] group-hover:shadow-md transition-all">
            <Image src="/logo.png" alt="Med Z Logo" width={32} height={32} className="rounded-lg" priority />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Med Z</h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">Pharmacy</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <div className="w-7 h-7 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-semibold uppercase border border-slate-200/60">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button 
                      onClick={() => { setCurrentView('orders'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                    >
                      <Package size={16} /> Order History
                    </button>
                    <button 
                      onClick={() => { setCurrentView('transactions'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                    >
                      <Receipt size={16} /> Transaction History
                    </button>
                    <button 
                      onClick={() => { setCurrentView('addresses'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                    >
                      <MapPin size={16} /> Saved Addresses
                    </button>
                    <button 
                      onClick={() => { setCurrentView('contact'); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                    >
                      <Mail size={16} /> Contact Us
                    </button>
                  </div>
                  <div className="p-1.5 border-t border-slate-100">
                    <button 
                      onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            className="relative px-4 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-xl transition-all duration-200 flex items-center gap-2.5 font-medium text-sm shadow-[0_2px_8px_rgb(0,0,0,0.02)]"
            onClick={() => setCurrentView('cart')}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {currentView === 'home' ? (
          <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden">
            <main className="flex-1 p-4 md:p-6 lg:p-8 pb-28 md:pb-6 w-full overflow-y-auto scrollbar-hide">
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">{activeCategory} Medicines</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Showing {filteredProducts.length} results</p>
                </div>
              </div>

              <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`
                        whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                        ${activeCategory === category 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-[0_2px_8px_rgb(0,0,0,0.02)]'}
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-24">
                {filteredProducts.map((product) => {
                  const Icon = product.icon;
                  return (
                    <div 
                      key={product.id} 
                      className="bg-white border border-slate-200/60 rounded-[20px] p-4 md:p-5 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 border border-slate-100/50 text-slate-700 rounded-2xl flex items-center justify-center mb-4 md:mb-5 group-hover:bg-slate-100 transition-colors">
                        <Icon size={20} strokeWidth={2} />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mb-1">{product.name}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 mb-3 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded w-fit border border-slate-100">{product.category}</span>
                      <div className="mb-6 flex-1">
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <button 
                          onClick={() => handleAiExplain(product)}
                          className="text-xs text-indigo-600 font-medium flex items-center gap-1.5 hover:text-indigo-700 transition-colors bg-indigo-50/50 hover:bg-indigo-50 px-3 py-2 rounded-lg w-fit border border-indigo-100/50"
                        >
                          <Sparkles size={14} /> AI Explain
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto border-t border-slate-100/80 pt-4">
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                          ₹{product.price}
                        </span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-[0_2px_10px_rgb(0,0,0,0.08)] active:scale-95 flex items-center gap-1.5"
                        >
                          <Plus size={16} /> Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-32 text-slate-500 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Package size={32} className="text-slate-400" />
                  </div>
                  <p className="text-lg font-bold text-slate-900 mb-1">No products found</p>
                  <p className="text-sm">Try searching for a different medicine or category.</p>
                </div>
              )}
            </main>

            {isMobileSidebarOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/20 z-50 md:hidden backdrop-blur-sm transition-opacity"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}
            
            <aside className={`
              fixed md:static top-0 right-0 z-50 w-full md:w-[340px] h-full bg-white border-l border-slate-200/60 shadow-2xl md:shadow-none flex flex-col transition-transform duration-300 ease-in-out
              ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center md:hidden">
                <h2 className="text-base font-bold text-slate-900">Tools & Search</h2>
                <button 
                  className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-2 border-b border-slate-100 md:hidden flex flex-col gap-1 bg-slate-50/50">
                <div className="flex items-center gap-3 px-4 py-3 mb-1">
                  <div className="w-8 h-8 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center text-xs font-semibold uppercase shadow-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-medium leading-none mb-1 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                  </div>
                </div>
                <button onClick={() => { setCurrentView('orders'); setIsMobileSidebarOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                  <Package size={16} /> Order History
                </button>
                <button onClick={() => { setCurrentView('transactions'); setIsMobileSidebarOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                  <Receipt size={16} /> Transaction History
                </button>
                <button onClick={() => { setCurrentView('addresses'); setIsMobileSidebarOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                  <MapPin size={16} /> Saved Addresses
                </button>
                <button onClick={() => { setCurrentView('contact'); setIsMobileSidebarOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                  <Mail size={16} /> Contact Us
                </button>
                <div className="my-1 border-t border-slate-200/60"></div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                <div>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Search size={14} /> Search Medicines
                  </h2>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search size={16} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or generic..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all bg-slate-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-b from-teal-50/50 to-teal-50/80 border border-teal-100/60 rounded-[20px] p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-600 p-2 rounded-xl text-white shadow-sm shadow-teal-600/20">
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">AI Doctor</h3>
                      <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Free Consult</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">
                    Describe your symptoms for preliminary triage and home care advice.
                  </p>
                  <button
                    onClick={() => { setIsDoctorOpen(true); setIsMobileSidebarOpen(false); }}
                    className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_2px_10px_rgb(20,184,166,0.2)] active:scale-95 flex items-center justify-center gap-2"
                  >
                    Start Consultation <ArrowLeft size={16} className="rotate-135" />
                  </button>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ShoppingCart size={16} className="text-slate-400" /> Quick Cart
                    </h3>
                    {cartCount > 0 && (
                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        {cartCount} Items
                      </span>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-3 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                      <Package size={24} className="text-slate-300" />
                      <p className="text-xs font-medium text-slate-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {cart.slice(0, 3).map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm group">
                            <span className="text-slate-600 truncate pr-2 flex items-center gap-2.5">
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">{item.quantity}x</span> 
                              <span className="group-hover:text-slate-900 transition-colors">{item.name}</span>
                            </span>
                            <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        {cart.length > 3 && (
                          <p className="text-xs text-slate-400 pt-1 font-medium">+{cart.length - 3} more items</p>
                        )}
                      </div>
                      
                      <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                        <span className="font-medium text-slate-500 text-sm">Total</span>
                        <span className="font-bold tracking-tight text-slate-900 text-lg">₹{cartTotal}</span>
                      </div>
                      
                      <button
                        onClick={() => { setCurrentView('cart'); setIsMobileSidebarOpen(false); }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-[0_2px_10px_rgb(0,0,0,0.08)] active:scale-95 flex items-center justify-center gap-2 mt-2"
                      >
                        View Full Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        ) : currentView === 'contact' ? (
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 scrollbar-hide">
            <div className="max-w-2xl mx-auto animate-fade-in">
              <button 
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors w-fit bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm"
              >
                <ArrowLeft size={16} /> Back to Store
              </button>

              <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                <div className="mb-8">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                    <Mail size={24} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Contact Us</h2>
                  <p className="text-slate-500 mt-2 text-sm">Have a question or need help? Send us a message and we&apos;ll get back to you as soon as possible.</p>
                </div>

                {contactStatus.success && (
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-medium mb-6 border border-emerald-100 flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 size={18} />
                    {contactStatus.success}
                  </div>
                )}

                {contactStatus.error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100 flex items-center gap-3 animate-fade-in">
                    <AlertCircle size={18} />
                    {contactStatus.error}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                        <User size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                        <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                      placeholder="How can we help you today?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactStatus.loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_12px_rgb(0,0,0,0.1)] active:scale-[0.98] mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {contactStatus.loading ? 'Sending...' : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : currentView === 'cart' ? (
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 scrollbar-hide">
            <div className="max-w-5xl mx-auto">
              <button 
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors w-fit bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm"
              >
                <ArrowLeft size={16} /> Back to Medicines
              </button>
              
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">Your Cart</h2>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  {cart.length === 0 ? (
                    <div className="bg-white border border-slate-200/60 rounded-[24px] p-16 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                        <ShoppingCart size={32} className="text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Your cart is empty</h3>
                      <p className="text-slate-500 text-sm mb-8">Looks like you haven&apos;t added any medicines yet.</p>
                      <button 
                        onClick={() => setCurrentView('home')}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-[0_4px_14px_rgb(0,0,0,0.1)] active:scale-95"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.id} className="flex flex-col sm:flex-row gap-5 p-5 bg-white border border-slate-200/60 rounded-[20px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] items-start sm:items-center group hover:border-slate-300 transition-colors">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                              <Icon size={24} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0 w-full sm:w-auto">
                              <h4 className="font-bold text-base text-slate-900 truncate">{item.name}</h4>
                              <p className="text-slate-500 text-xs mt-0.5 mb-1.5 uppercase tracking-wider font-medium">{item.category}</p>
                              <p className="text-slate-900 font-bold text-lg">₹{item.price}</p>
                            </div>
                            
                            <div className="flex sm:flex-col flex-row items-center sm:items-end gap-4 justify-between w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-0 border-slate-100 pt-4 sm:pt-0">
                              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
                                  <Minus size={16} />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
                                  <Plus size={16} />
                                </button>
                              </div>
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-xs font-medium bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                              >
                                <Trash2 size={14} /> <span className="sm:hidden">Remove</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="w-full lg:w-[380px] shrink-0">
                    <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 sticky top-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                      <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
                      
                      <div className="space-y-4 mb-6 text-sm">
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal ({cartCount} items)</span>
                          <span className="font-medium text-slate-900">₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Delivery Fee</span>
                          <span className="text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded">Free</span>
                        </div>
                        <div className="border-t border-slate-100 pt-5 mt-5 flex justify-between items-center">
                          <span className="text-base font-bold text-slate-900">Total</span>
                          <span className="text-2xl font-bold tracking-tight text-slate-900">₹{cartTotal}</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {cart.length > 1 && (
                          <button 
                            onClick={handleCheckInteractions}
                            className="w-full bg-indigo-50/50 border border-indigo-200/60 hover:bg-indigo-50 text-indigo-700 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                          >
                            <Sparkles size={16} /> AI Interaction Check
                          </button>
                        )}
                        <button 
                          onClick={proceedToCheckout}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_rgb(0,0,0,0.1)] active:scale-95 flex items-center justify-center gap-2"
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                        <ShieldPlus size={14} /> Safe & Secure Payments
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : currentView === 'checkout' ? (
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 pb-28 md:pb-6 scrollbar-hide">
            <div className="max-w-5xl mx-auto">
              <button 
                onClick={() => setCurrentView('cart')}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors w-fit bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm"
              >
                <ArrowLeft size={16} /> Back to Cart
              </button>
              
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">Checkout</h2>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className={`bg-white border ${checkoutStep === 1 ? 'border-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.06)]' : 'border-slate-200/60 opacity-60 pointer-events-none'} rounded-[24px] p-6 lg:p-8 transition-all duration-300`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${checkoutStep === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>1</div>
                      Delivery Details
                    </h3>
                    <form onSubmit={handleAddressSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                          <input type="text" required value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all bg-white" placeholder="John Doe" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                          <input type="tel" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all bg-white" placeholder="+91 9876543210" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Street Address</label>
                        <textarea required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all bg-white" placeholder="Flat No, Building Name, Street..." rows="2" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">City</label>
                          <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all bg-slate-50" placeholder="Mumbai" readOnly />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                            <span>Pincode</span>
                            {pincodeLoading && <span className="text-indigo-500 animate-pulse">Verifying...</span>}
                          </label>
                          <input type="text" maxLength={6} required value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value.replace(/\\D/g, '').slice(0, 6)})} className={`w-full px-4 py-3 rounded-xl border ${pincodeError ? 'border-red-500' : 'border-slate-200'} text-sm focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all bg-white`} placeholder="400001" />
                          {pincodeError && <p className="text-xs text-red-500 font-medium mt-1">{pincodeError}</p>}
                          {addressForm.state && !pincodeError && !pincodeLoading && (
                            <p className="text-xs text-emerald-600 font-medium mt-1">✓ Verified: {addressForm.state}</p>
                          )}
                        </div>
                      </div>
                      <div className="pt-4 flex justify-end">
                        <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_14px_rgb(0,0,0,0.1)] active:scale-95">
                          Continue to Payment
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className={`bg-white border ${checkoutStep === 2 ? 'border-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.06)]' : 'border-slate-200/60 opacity-60 pointer-events-none'} rounded-[24px] p-6 lg:p-8 transition-all duration-300`}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${checkoutStep === 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>2</div>
                        Payment Method
                      </h3>
                      {checkoutStep === 2 && (
                        <button onClick={() => setCheckoutStep(1)} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Edit Details</button>
                      )}
                    </div>
                    
                    <form onSubmit={handlePaymentSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${paymentMethod === 'razorpay' ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                          onClick={() => setPaymentMethod('razorpay')}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                              {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />}
                            </div>
                            <CreditCard size={20} className={paymentMethod === 'razorpay' ? 'text-slate-900' : 'text-slate-400'} />
                          </div>
                          <h4 className="font-semibold text-slate-900 text-sm">Pay Online</h4>
                          <p className="text-xs text-slate-500 mt-1">Cards, UPI, Netbanking</p>
                        </div>
                        
                        <div 
                          className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${paymentMethod === 'cod' ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                          onClick={() => setPaymentMethod('cod')}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                              {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />}
                            </div>
                            <Truck size={20} className={paymentMethod === 'cod' ? 'text-slate-900' : 'text-slate-400'} />
                          </div>
                          <h4 className="font-semibold text-slate-900 text-sm">Cash on Delivery</h4>
                          <p className="text-xs text-slate-500 mt-1">Pay at your doorstep</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100 mt-6">
                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_rgb(0,0,0,0.1)] active:scale-95 flex items-center justify-center gap-2">
                          {paymentMethod === 'razorpay' ? `Pay ₹${cartTotal} securely` : 'Confirm COD Order'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="w-full lg:w-[380px] shrink-0">
                  <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 sticky top-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <ShoppingCart size={18} className="text-slate-400" /> Order Summary
                    </h3>
                    
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-start text-sm border-b border-slate-50 pb-3">
                          <span className="text-slate-600 pr-2 leading-relaxed">
                            <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-xs mr-2">{item.quantity}x</span> 
                            {item.name}
                          </span>
                          <span className="font-medium text-slate-900 whitespace-nowrap mt-0.5">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 mb-2 text-sm bg-slate-50 p-4 rounded-xl">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Total</span>
                        <span className="font-medium text-slate-900">₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee</span>
                        <span className="text-teal-600 font-semibold">Free</span>
                      </div>
                      <div className="border-t border-slate-200/60 pt-4 mt-2 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">To Pay</span>
                        <span className="text-xl font-bold tracking-tight text-slate-900">₹{cartTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'orders' ? (
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 pb-28 md:pb-6 scrollbar-hide">
            <div className="max-w-4xl mx-auto">
              <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors w-fit bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
                <ArrowLeft size={16} /> Back to Medicines
              </button>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">Order History</h2>

              {ordersHistory.length === 0 ? (
                <div className="bg-white p-12 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-200/60 text-center flex flex-col items-center justify-center">
                  <Package className="text-slate-300 mb-5" size={40} />
                  <p className="text-slate-900 font-bold mb-1">No orders yet</p>
                  <p className="text-slate-500 text-sm">When you place an order, it will appear here.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {ordersHistory.map((order, i) => (
                    <div key={i} className="bg-white border border-slate-200/60 p-6 rounded-[20px] shadow-[0_2px_12px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 pb-5 border-b border-slate-100 gap-3">
                        <div>
                           <p className="font-bold text-slate-900 text-base">{order.id}</p>
                           <p className="text-xs text-slate-500 mt-1 font-medium">{order.date}</p>
                        </div>
                        <div className="flex flex-col sm:items-end">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md mb-2 w-fit">{order.status}</span>
                           <p className="font-bold text-lg text-slate-900">₹{order.total}</p>
                        </div>
                      </div>
                      <ul className="text-sm text-slate-600 space-y-3">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <span className="flex items-center gap-3">
                               <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">{item.quantity}x</span>
                               {item.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : currentView === 'transactions' ? (
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 pb-28 md:pb-6 scrollbar-hide">
            <div className="max-w-5xl mx-auto">
              <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors w-fit bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
                <ArrowLeft size={16} /> Back to Medicines
              </button>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">Transactions</h2>

              {ordersHistory.length === 0 ? (
                <div className="bg-white border border-slate-200/60 rounded-[24px] p-16 text-center flex flex-col items-center shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                  <Receipt size={40} className="text-slate-300 mb-5" />
                  <h3 className="text-base font-bold text-slate-900 mb-1">No transactions yet</h3>
                  <p className="text-sm text-slate-500">Your payment history will appear here.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                        <tr>
                          <th className="p-5 font-bold uppercase tracking-wider text-[11px]">Date</th>
                          <th className="p-5 font-bold uppercase tracking-wider text-[11px]">Order Ref</th>
                          <th className="p-5 font-bold uppercase tracking-wider text-[11px]">Method</th>
                          <th className="p-5 font-bold uppercase tracking-wider text-[11px] text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/80">
                        {ordersHistory.map((order, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-5 text-slate-500 font-medium whitespace-nowrap">{order.date}</td>
                            <td className="p-5 font-semibold text-slate-900">{order.id}</td>
                            <td className="p-5">
                              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${order.paymentMethod === 'razorpay' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50' : 'bg-slate-100 text-slate-700 border border-slate-200/50'}`}>
                                {order.paymentMethod === 'razorpay' ? 'Online' : 'COD'}
                              </span>
                            </td>
                            <td className="p-5 font-bold text-slate-900 text-right">₹{order.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : currentView === 'addresses' ? (
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8 pb-28 md:pb-6 scrollbar-hide">
            <div className="max-w-4xl mx-auto">
              <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors w-fit bg-white px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
                <ArrowLeft size={16} /> Back to Medicines
              </button>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">Saved Addresses</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedAddresses.map((addr, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-[0_2px_12px_rgb(0,0,0,0.02)] flex items-start gap-4 hover:border-slate-300 transition-colors group">
                    <div className="bg-slate-50 border border-slate-100 text-slate-600 p-3 rounded-xl mt-0.5 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base mb-1">{addr.name}</h4>
                      <p className="text-xs font-semibold text-slate-500 mb-3 bg-slate-50 px-2 py-0.5 rounded w-fit">{addr.phone}</p>
                      <p className="text-sm text-slate-600 leading-relaxed mb-1">{addr.street}</p>
                      <p className="text-sm text-slate-600">{addr.city} • {addr.pincode}</p>
                    </div>
                  </div>
                ))}

                {savedAddresses.length === 0 && (
                   <div className="col-span-full bg-white p-12 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-200/60 text-center flex flex-col items-center">
                     <MapPin className="text-slate-300 mb-4" size={40} />
                     <p className="text-slate-900 font-bold mb-1">No saved addresses</p>
                     <p className="text-slate-500 text-sm">Place an order to save your address automatically.</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        ) : currentView === 'delivery' ? (
          <DeliveryTrackingView order={activeDeliveryOrder} setCurrentView={setCurrentView} />
        ) : null}
      </div>

      {isProcessingPayment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="bg-white p-10 rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col items-center w-[340px] animate-in zoom-in-95 duration-300">
            <div className="text-slate-900 mb-8 font-bold text-xl flex items-center gap-2.5">
              <div className="bg-slate-900 text-white p-2 rounded-xl"><Zap size={20} className="fill-current" /></div>
              Secure Checkout
            </div>
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
              <ShieldPlus size={18} className="absolute text-slate-900" />
            </div>
            <p className="text-slate-900 font-bold text-base mb-1.5">Processing Payment...</p>
            <p className="text-slate-500 font-medium text-sm mb-6 bg-slate-50 px-3 py-1 rounded-full">Amount: ₹{cartTotal}</p>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Please do not close window</p>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.15)] flex flex-col items-center max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">Order Confirmed</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Your Med Z package is being processed and will be delivered securely to your address.</p>
          </div>
        </div>
      )}

      {explainerModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[28px] shadow-2xl max-w-md w-full relative animate-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setExplainerModal({ isOpen: false, product: null, text: '', isLoading: false })}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl border border-indigo-100/50">
                <Info size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  {explainerModal.product?.name} <Sparkles size={14} className="text-indigo-500" />
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">AI Explanation</p>
              </div>
            </div>
            
            {explainerModal.isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-500">Generating simple explanation...</p>
              </div>
            ) : (
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner shadow-slate-100/50">
                {explainerModal.text}
              </p>
            )}
          </div>
        </div>
      )}

      {interactionModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[28px] shadow-2xl max-w-md w-full relative animate-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setInteractionModal({ isOpen: false, text: '', isLoading: false })}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl border border-amber-100/50">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Interaction Check <Sparkles size={14} className="text-amber-500" />
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Safety Review</p>
              </div>
            </div>
            
            {interactionModal.isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-500">Reviewing cart combinations...</p>
              </div>
            ) : (
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100/50">
                <p className="text-slate-800 text-sm leading-relaxed mb-4">
                  {interactionModal.text}
                </p>
                <div className="text-[11px] text-amber-700/80 font-semibold bg-amber-100/50 px-3 py-2 rounded-lg flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  AI insights do not replace professional medical advice. Consult your doctor if unsure.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isDoctorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 md:p-6">
          <div className="bg-white w-full max-w-3xl h-[85vh] md:h-[700px] rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.1)] flex flex-col overflow-hidden relative border border-slate-200/50 animate-in zoom-in-95 duration-200">
            <div className="p-5 md:px-8 bg-white border-b border-slate-100 flex justify-between items-center z-10">
              <div className="flex items-center gap-3.5">
                <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-sm">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">AI Triage Consult</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Experimental Feature</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDoctorOpen(false)}
                className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:px-8 md:py-6 bg-[#F8FAFC] space-y-6 scrollbar-hide">
              <div className="bg-white border border-slate-200/60 p-4.5 rounded-2xl text-sm text-slate-600 mb-2 flex gap-3.5 items-start shadow-sm">
                <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <p className="leading-relaxed pt-0.5">
                  <strong className="text-slate-900">Medical Disclaimer:</strong> This is an AI assistant, not a human doctor. Responses are for informational triage only. Always consult a qualified healthcare provider for severe, persistent, or worsening symptoms.
                </p>
              </div>
              
              {doctorMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] md:max-w-[75%] p-4.5 rounded-[20px] text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-br-[4px]' 
                      : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-[4px]'}
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
                  <div className="bg-white border border-slate-200/60 px-5 py-4 rounded-[20px] rounded-bl-[4px] shadow-sm flex items-center gap-1.5 w-fit">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={doctorMessagesEndRef} />
            </div>

            <form onSubmit={handleDoctorMessage} className="p-4 md:px-6 md:py-5 bg-white border-t border-slate-100 flex gap-3">
              <input
                type="text"
                value={doctorInput}
                onChange={(e) => setDoctorInput(e.target.value)}
                placeholder="Describe duration, severity, and symptoms..."
                className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
              />
              <button 
                type="submit"
                disabled={!doctorInput.trim() || isDoctorTyping}
                className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2 shadow-sm"
              >
                <span className="hidden sm:inline">Send</span> <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-[88px] md:bottom-6 right-6 z-40 flex flex-col items-end">
        {isChatOpen && (
          <div className="w-[340px] h-[520px] bg-white rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-slate-200/60 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <div className="px-5 py-4 bg-white border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full text-slate-700">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Pharmacist Chat</h3>
                  <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span> Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-[18px] text-sm shadow-[0_2px_8px_rgb(0,0,0,0.02)] ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-br-[4px]'
                        : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-[4px]'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    {msg.role === "model" && msg.products && msg.products.length > 0 && (
                      <div className="mt-3.5 flex flex-col gap-2 border-t border-slate-100/80 pt-3.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Suggested Items
                        </span>
                        {msg.products.map((product) => (
                          <div 
                            key={product.id} 
                            className="flex justify-between items-center bg-[#F8FAFC] border border-slate-200/60 p-2.5 rounded-xl hover:border-slate-300 hover:bg-white transition-all group"
                          >
                            <div className="flex flex-col overflow-hidden mr-2">
                              <span className="font-semibold text-xs text-slate-900 truncate">{product.name}</span>
                              <span className="text-[11px] font-bold text-slate-500 mt-0.5">₹{product.price}</span>
                            </div>
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-white border border-slate-200 hover:border-slate-900 text-slate-900 w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors shrink-0 shadow-sm"
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
                  <div className="bg-white border border-slate-200/60 px-4 py-3.5 rounded-[18px] rounded-bl-[4px] shadow-[0_2px_8px_rgb(0,0,0,0.02)] flex items-center gap-1.5 w-fit">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about health..."
                className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* --- Mobile Bottom Navigation --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/60 pb-safe">
        <div className="flex justify-around items-center h-[72px] px-2 pb-2">
          <button 
            onClick={() => setCurrentView('home')} 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'home' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Stethoscope size={20} className={currentView === 'home' ? 'stroke-[2.5px]' : ''} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button 
            onClick={() => setIsMobileSidebarOpen(true)} 
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 hover:text-slate-600"
          >
            <Search size={20} />
            <span className="text-[10px] font-semibold">Search</span>
          </button>
          <button 
            onClick={() => setCurrentView('cart')} 
            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'cart' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className="relative">
              <ShoppingCart size={20} className={currentView === 'cart' ? 'stroke-[2.5px]' : ''} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-slate-900 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Cart</span>
          </button>
          <button 
            onClick={() => setIsMobileSidebarOpen(true)} 
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 hover:text-slate-600"
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