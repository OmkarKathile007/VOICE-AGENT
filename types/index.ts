export interface Listing {
  id: string;
  crop: string;
  quantity: string;
  price: string;
  location: string;
  source: 'manual' | 'voice';
  createdAt: Date;
}