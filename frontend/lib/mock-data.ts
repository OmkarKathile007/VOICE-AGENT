// lib/mock-data.ts

// Define a base product type
export interface Product {
  id: string;
  name: string;
  category: 'Raw Millets' | 'Processed' | 'Agri-Tech' | 'Combo';
  image: string; // Use a path like /images/ragi.png
  price: number;
  
  // Category-specific fields
  moisture?: string;
  origin?: string;
  isVerifiedFPO?: boolean;
  nutritionHighlights?: string[];
  productVideoUrl?: string;
  rating?: number;
  reviews?: number;
}

// Create your mock product list
export const products: Product[] = [
  {
    id: 'raw-001',
    name: 'Organic Finger Millet (Ragi)',
    category: 'Raw Millets',
    image: '/images/ragi-raw.jpg', // Placeholder - add your images to /public/images/
    price: 45, // Price per kg
    moisture: '11.5%',
    origin: 'Karnataka',
    isVerifiedFPO: true,
  },
  {
    id: 'processed-001',
    name: 'Millet Dosa Mix (Ready-to-Eat)',
    category: 'Processed',
    image: '/images/dosa-mix.jpg',
    price: 120,
    nutritionHighlights: ['High Fiber', 'Gluten-Free', 'High Protein'],
    rating: 4.5,
    reviews: 68,
  },
  {
    id: 'agritech-001',
    name: 'Mini Millet Dehusking Machine',
    category: 'Agri-Tech',
    image: '/images/dehusker.jpg',
    price: 35000,
    productVideoUrl: 'https://www.youtube.com/watch?v=example',
  },
  {
    id: 'combo-001',
    name: '"Shree Anna" Starter Box',
    category: 'Combo',
    image: '/images/combo-box.jpg',
    price: 499,
    nutritionHighlights: ['5 Millet Types', '1kg Each'],
    rating: 5,
    reviews: 112,
  },
  {
    id: 'raw-002',
    name: 'Pearl Millet (Bajra)',
    category: 'Raw Millets',
    image: '/images/bajra-raw.jpg',
    price: 38,
    moisture: '12%',
    origin: 'Rajasthan',
    isVerifiedFPO: false,
  },
  {
    id: 'processed-002',
    name: 'Millet Chocolate Cookies',
    category: 'Processed',
    image: '/images/cookies.jpg',
    price: 90,
    nutritionHighlights: ['No Maida', 'Jaggery Sweetened'],
    rating: 4.2,
    reviews: 45,
  },
];