// ─── Base URLs ────────────────────────────────────────────────────────────────
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8080';
const AI_URL   = process.env.NEXT_PUBLIC_AI_URL      ?? 'http://localhost:8000';

// ─── Token helper ─────────────────────────────────────────────────────────────
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('krishi_token');
};

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Listing {
  id?: string;
  crop: string;
  quantity: string;
  price: string;
  location: string;
  source: 'manual' | 'voice';
  imageUrl?: string;
  userId?: string;
  userEmail?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  origin?: string;
  badge?: string;
  rating: number;
  reviews: number;
  description?: string;
  inStock: boolean;
}

export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface VoiceSession {
  id?: string;
  userId?: string;
  userEmail?: string;
  summary: string;
  transcript?: string;
  duration: string;
  actions: string[];
  createdAt?: string;
}

export interface Order {
  id?: string;
  productId: string;
  productName: string;
  cropName?: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount?: number;
  deliveryAddress: string;
  phone: string;
  paymentMethod?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

// ─── Auth API (Spring Boot) ───────────────────────────────────────────────────

export const authApi = {
  register: async (email: string, password: string, name: string, role: string): Promise<AuthResponse> => {
    const res = await fetch(`${BACKEND}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? 'Registration failed');
    }
    return res.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? 'Invalid email or password');
    }
    return res.json();
  },

  me: async (): Promise<AuthResponse> => {
    const res = await fetch(`${BACKEND}/api/auth/me`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },
};

// ─── Products API (Spring Boot) ───────────────────────────────────────────────

export const productsApi = {
  getAll: async (category?: string, search?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'All Products') params.set('category', category);
    if (search) params.set('search', search);
    const res = await fetch(`${BACKEND}/api/products?${params}`);
    if (!res.ok) return [];
    return res.json();
  },

  getById: async (id: string): Promise<Product | null> => {
    const res = await fetch(`${BACKEND}/api/products/${id}`);
    if (!res.ok) return null;
    return res.json();
  },
};

// ─── Orders API (Spring Boot) ─────────────────────────────────────────────────

export const ordersApi = {
  place: async (order: Omit<Order, 'id' | 'totalAmount' | 'status' | 'createdAt'>): Promise<Order> => {
    const res = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(order),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? 'Failed to place order');
    }
    return res.json();
  },

  getMyOrders: async (): Promise<Order[]> => {
    const res = await fetch(`${BACKEND}/api/orders/my`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },
};

// ─── Voice Sessions API (Spring Boot) ────────────────────────────────────────

export const sessionsApi = {
  getMySessions: async (): Promise<VoiceSession[]> => {
    const res = await fetch(`${BACKEND}/api/voice-sessions`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  saveSession: async (session: Omit<VoiceSession, 'id' | 'userId' | 'userEmail' | 'createdAt'>): Promise<VoiceSession | null> => {
    const res = await fetch(`${BACKEND}/api/voice-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(session),
    });
    if (!res.ok) return null;
    return res.json();
  },

  deleteSession: async (id: string): Promise<void> => {
    await fetch(`${BACKEND}/api/voice-sessions/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  },
};

// ─── Listings API (FastAPI — farmer agent) ────────────────────────────────────

const LISTINGS_URL = `${AI_URL}/api/listings`;

export const api = {
  getListings: async (): Promise<Listing[]> => {
    try {
      const res = await fetch(LISTINGS_URL);
      if (!res.ok) throw new Error('Failed to fetch listings');
      return res.json();
    } catch {
      return [];
    }
  },

  createListing: async (data: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing | null> => {
    try {
      const res = await fetch(LISTINGS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create listing');
      return res.json();
    } catch {
      return null;
    }
  },

  deleteListing: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${LISTINGS_URL}/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },
};
