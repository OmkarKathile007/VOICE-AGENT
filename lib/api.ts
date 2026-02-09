// Define the Listing Type matching your Java Backend
export interface Listing {
  id?: string; // Optional because new items don't have an ID yet
  crop: string;
  quantity: string;
  price: string;
  location: string;
  source: 'manual' | 'voice';
  createdAt?: string;
}

const API_URL = 'http://localhost:8080/api/listings';

export const api = {
  // 1. Fetch all listings
  getListings: async (): Promise<Listing[]> => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch listings');
      return await res.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  // 2. Create a new listing
  createListing: async (data: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing | null> => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create listing');
      return await res.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // 3. Delete a listing
  deleteListing: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (error) {
      console.error('API Error:', error);
      return false;
    }
  }
};