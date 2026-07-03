import type { Product } from './api';

/**
 * Demo SHG-verified produce shown when the backend returns no products (backend not
 * running, or an older DB that predates the seeded catalogue). Shared by the Startup
 * Console (`/startup`) and the consumer market (`/products`) so both stay in sync.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'startup-ragi', name: 'Organic Ragi', price: 1, originalPrice: 42, imageUrl: '/ragi.jpg', category: 'Millets',
    origin: 'Mandya', badge: 'Organic', rating: 4.8, reviews: 218, inStock: true,
    farmerName: 'Kaveri SHG Collective', village: 'Hulikere', fpoName: 'Mandya Millet FPO', shgId: 'Kaveri SHG',
    qualityScore: 94, certifications: ['Organic', 'SHG Verified'], quantity: '8.5 MT',
    verificationStatus: 'APPROVED', verifiedByName: 'Kaveri SHG', listedInStore: true,
  },
  {
    id: 'startup-bajra', name: 'Grade-A Bajra', price: 39, imageUrl: '/pearlmillet.jpg', category: 'Millets',
    origin: 'Solapur', badge: 'Grade A', rating: 4.7, reviews: 164, inStock: true,
    farmerName: 'Bhumi Farmers Group', village: 'Barshi', fpoName: 'Solapur Dryland FPO', shgId: 'Annapurna SHG',
    qualityScore: 91, certifications: ['FPO Verified', 'Moisture Tested'], quantity: '12 MT',
    verificationStatus: 'APPROVED', verifiedByName: 'Annapurna SHG', listedInStore: true,
  },
  {
    id: 'startup-jowar', name: 'Premium Jowar', price: 36, imageUrl: '/jowar.jpg', category: 'Millets',
    origin: 'Kalaburagi', badge: 'Trending', rating: 4.6, reviews: 142, inStock: true,
    farmerName: 'Nava Jyoti SHG', village: 'Aland', fpoName: 'Kalaburagi FPO', shgId: 'Nava Jyoti SHG',
    qualityScore: 88, certifications: ['SHG Verified'], quantity: '6.2 MT',
    verificationStatus: 'APPROVED', verifiedByName: 'Nava Jyoti SHG', listedInStore: false,
  },
  {
    id: 'startup-foxtail', name: 'Foxtail Millet', price: 58, imageUrl: '/foxtail1.jpg', category: 'Millets',
    origin: 'Tumakuru', badge: 'New', rating: 4.9, reviews: 96, inStock: true,
    farmerName: 'Siri Farmer Producer Group', village: 'Sira', fpoName: 'Tumakuru Millet FPO', shgId: 'Siri SHG',
    qualityScore: 96, certifications: ['Organic', 'Lab Tested'], quantity: '4.8 MT',
    verificationStatus: 'APPROVED', verifiedByName: 'Siri SHG', listedInStore: false,
  },
  {
    id: 'startup-kodo', name: 'Kodo Millet', price: 52, imageUrl: '/kodo.jpg', category: 'Millets',
    origin: 'Dindori', badge: 'Organic', rating: 4.7, reviews: 74, inStock: true,
    farmerName: 'Adivasi Millet SHG', village: 'Samnapur', fpoName: 'Dindori Tribal FPO', shgId: 'Adivasi SHG',
    qualityScore: 90, certifications: ['SHG Verified'], quantity: '5.5 MT',
    verificationStatus: 'APPROVED', verifiedByName: 'Adivasi SHG', listedInStore: false,
  },
  {
    id: 'startup-groundnut', name: 'Cold-Pressed Groundnut Oil', price: 180, imageUrl: '/groundnut.jpg', category: 'Oils',
    origin: 'Latur', badge: 'Cold Pressed', rating: 4.8, reviews: 133, inStock: true,
    farmerName: 'Marathwada SHG', village: 'Ausa', fpoName: 'Latur Oilseeds FPO', shgId: 'Marathwada SHG',
    qualityScore: 92, certifications: ['APMC Graded'], quantity: '3.0 MT',
    verificationStatus: 'APPROVED', verifiedByName: 'Marathwada SHG', listedInStore: false,
  },
];
