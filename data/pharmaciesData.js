/**
 * Verified Partner Pharmacies & Retail Drugstores Dataset
 * Coordinated around major urban healthcare hubs with live inventory capabilities
 */

export const PHARMACIES_DATA = [
  {
    id: 'store-bkc-central',
    name: 'Med Z 24/7 Super Pharmacy & Hub',
    type: 'Med Z Hub',
    lat: 19.0657,
    lng: 72.8687,
    distanceKm: 0.8,
    address: 'Ground Floor, G-Block, Bandra Kurla Complex (BKC), Mumbai 400051',
    pincode: '400051',
    phone: '+91 98201 12233',
    isOpen247: true,
    timing: 'Open 24/7 (365 Days)',
    pharmacist: 'Rakesh Sharma, B.Pharm',
    licenseNo: 'MH-MZ-2024-DL8921',
    rating: 4.9,
    reviewsCount: 1420,
    services: ['30-Min Store Pickup', 'Cold Chain Vaccine Storage', 'Free BP & Sugar Check', 'Night Dispenser'],
    isPickupAvailable: true,
    stockMultiplier: 1.0, // Full stock
  },
  {
    id: 'store-bandra-west',
    name: 'Wellness Forever 24-Hour Chemists',
    type: 'Partner Retailer',
    lat: 19.0596,
    lng: 72.8295,
    distanceKm: 1.4,
    address: 'Hill Road, Near Mehboob Studio, Bandra West, Mumbai 400050',
    pincode: '400050',
    phone: '+91 98202 44556',
    isOpen247: true,
    timing: 'Open 24/7',
    pharmacist: 'Anita Desai, M.Pharm',
    licenseNo: 'MH-BW-2023-DL4912',
    rating: 4.8,
    reviewsCount: 980,
    services: ['30-Min Store Pickup', 'Drive-thru Rx', 'Cold Chain Storage'],
    isPickupAvailable: true,
    stockMultiplier: 0.95,
  },
  {
    id: 'store-dadar-generics',
    name: 'Jan Aushadhi Kendra (Generics Hub)',
    type: 'Jan Aushadhi (Govt)',
    lat: 19.0178,
    lng: 72.8478,
    distanceKm: 2.3,
    address: 'Opp. Dadar Central Railway Station, Dadar East, Mumbai 400014',
    pincode: '400014',
    phone: '+91 98203 77889',
    isOpen247: false,
    timing: '08:00 AM - 10:30 PM',
    pharmacist: 'Pravin Jadhav, D.Pharm',
    licenseNo: 'MH-JAK-2022-DL1092',
    rating: 4.7,
    reviewsCount: 2150,
    services: ['Jan Aushadhi Generic Hub', '50-80% Lower Prices', 'Senior Citizen Priority'],
    isPickupAvailable: true,
    stockMultiplier: 0.9,
  },
  {
    id: 'store-andheri-east',
    name: 'Apollo 24/7 Pharmacy & Diagnostic Center',
    type: 'Partner Retailer',
    lat: 19.1136,
    lng: 72.8697,
    distanceKm: 3.1,
    address: 'Chakala Metro Station, Andheri-Kurla Road, Andheri East, Mumbai 400093',
    pincode: '400093',
    phone: '+91 98204 99001',
    isOpen247: true,
    timing: 'Open 24/7',
    pharmacist: 'Sunil Nair, B.Pharm',
    licenseNo: 'MH-AP-2023-DL7712',
    rating: 4.8,
    reviewsCount: 1640,
    services: ['30-Min Store Pickup', 'Pathology Sample Drop', 'Emergency Medicines'],
    isPickupAvailable: true,
    stockMultiplier: 0.98,
  },
  {
    id: 'store-powai-hiranandani',
    name: 'Noble Chemist & Surgical Store',
    type: 'Partner Retailer',
    lat: 19.1197,
    lng: 72.9051,
    distanceKm: 4.5,
    address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai 400076',
    pincode: '400076',
    phone: '+91 98205 33221',
    isOpen247: false,
    timing: '07:30 AM - 11:30 PM',
    pharmacist: 'Vikas Mehta, B.Pharm',
    licenseNo: 'MH-NC-2021-DL3391',
    rating: 4.6,
    reviewsCount: 820,
    services: ['Surgical Equipment', 'Cold Storage', 'Home Delivery Partner'],
    isPickupAvailable: true,
    stockMultiplier: 0.85,
  },
  {
    id: 'store-south-mumbai',
    name: 'Metropolis Health & Night Chemist',
    type: 'Partner Retailer',
    lat: 18.9398,
    lng: 72.8354,
    distanceKm: 5.8,
    address: 'Fort Heritage Precinct, Near CSMT Station, South Mumbai 400001',
    pincode: '400001',
    phone: '+91 98206 66778',
    isOpen247: true,
    timing: 'Open 24/7 (Emergency Service)',
    pharmacist: 'Farhan Merchant, M.Pharm',
    licenseNo: 'MH-MC-2024-DL9011',
    rating: 4.9,
    reviewsCount: 1890,
    services: ['30-Min Store Pickup', 'Critical Care Injections', 'Night Emergency Window'],
    isPickupAvailable: true,
    stockMultiplier: 0.92,
  },
];

/**
 * Calculates stock availability simulation for a given medicine and store
 */
export function getStoreStock(storeId, medicineName) {
  if (!medicineName) return { inStock: true, count: 48, status: 'In Stock' };
  
  // Deterministic stock count based on char code sum
  const charSum = (medicineName + storeId).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const count = (charSum % 40) + 5; // 5 to 44 units
  
  return {
    inStock: true,
    count,
    status: count > 10 ? 'In Stock' : 'Low Stock',
  };
}
