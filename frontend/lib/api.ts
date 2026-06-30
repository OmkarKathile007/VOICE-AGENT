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

  // ── SHG verification workflow ──────────────────────────────────────────────
  verificationStatus?: VerificationStatus;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  verificationRemark?: string;
  rejectionReason?: string;
  verificationHistory?: VerificationEvent[];

  // ── Farmer listing context ─────────────────────────────────────────────────
  farmerId?: string;
  farmerName?: string;
  farmerEmail?: string;
  village?: string;
  fpoId?: string;
  fpoName?: string;
  shgId?: string;
  crop?: string;
  quantity?: string;
  expectedPrice?: string;
  voiceTranscript?: string;
  aiExtractedFields?: Record<string, unknown>;
  qualityScore?: number;
  certifications?: string[];
  images?: string[];
  source?: 'manual' | 'voice';
  createdAt?: string;
}

export type VerificationStatus = 'PENDING_SHG_VERIFICATION' | 'APPROVED' | 'REJECTED';

export interface VerificationEvent {
  action: 'CREATED' | 'APPROVED' | 'REJECTED' | 'RESUBMITTED';
  actorEmail?: string;
  actorName?: string;
  actorRole?: string;
  remark?: string;
  reason?: string;
  at?: string;
}

export interface FarmerListingInput {
  crop: string;
  quantity: string;
  price: string;
  location?: string;
  name?: string;
  category?: string;
  imageUrl?: string;
  images?: string[];
  source?: 'manual' | 'voice';
  voiceTranscript?: string;
  aiExtractedFields?: Record<string, unknown>;
  qualityScore?: number;
  certifications?: string[];
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

  /** Create a farmer listing → saved as PENDING_SHG_VERIFICATION (not yet on market). */
  createFarmerListing: async (input: FarmerListingInput): Promise<Product> => {
    const res = await fetch(`${BACKEND}/api/products/farmer-listing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? err.message ?? 'Failed to create listing');
    }
    return res.json();
  },

  /** The signed-in farmer's own listings with verification status & history. */
  getMyListings: async (): Promise<Product[]> => {
    const res = await fetch(`${BACKEND}/api/products/my-listings`, { headers: authHeaders() });
    if (!res.ok) return [];
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

// ─── SHG Verification API (Spring Boot) ───────────────────────────────────────

export interface ShgDashboard {
  shgName: string;
  pendingVerification: number;
  approvedToday: number;
  rejectedToday: number;
  totalFarmers: number;
  mappedFPOs: number;
  verificationAccuracy: number;
  totalApproved: number;
  totalRejected: number;
  totalListings: number;
}

export interface Shg {
  id: string;
  name: string;
  district?: string;
  taluka?: string;
  village?: string;
  contactPerson?: string;
  phone?: string;
  email: string;
  mappedFPOIds?: string[];
  createdAt?: string;
}

export interface FarmerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  village?: string;
  district?: string;
  taluka?: string;
  fpoId?: string;
  fpoName?: string;
  mappedSHGId?: string;
  landDetails?: string;
  address?: string;
}

export interface FarmerDetail {
  farmer: FarmerUser;
  currentListings: Product[];
  approvedListings: Product[];
  rejectedListings: Product[];
  totalListings: number;
}

export interface ShgAnalytics {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  verificationTrends: { date: string; approved: number; rejected: number; pending: number }[];
  mostActiveFarmers: { label: string; count: number }[];
  mostActiveFPOs: { label: string; count: number }[];
  topVillages: { label: string; count: number }[];
}

export const REJECTION_REASONS = [
  'Poor Product Quality',
  'Incorrect Quantity',
  'Duplicate Listing',
  'Image Not Clear',
  'Invalid Information',
  'Other',
] as const;

async function shgGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND}/api/shg${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? err.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

async function shgPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BACKEND}/api/shg${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? err.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export const shgApi = {
  profile: () => shgGet<Shg>('/profile'),
  dashboard: () => shgGet<ShgDashboard>('/dashboard'),
  farmers: () => shgGet<FarmerUser[]>('/farmers'),
  pendingProducts: () => shgGet<Product[]>('/pending-products'),
  approvedProducts: () => shgGet<Product[]>('/approved-products'),
  rejectedProducts: () => shgGet<Product[]>('/rejected-products'),
  farmer: (id: string) => shgGet<FarmerDetail>(`/farmer/${id}`),
  analytics: () => shgGet<ShgAnalytics>('/analytics'),
  approve: (productId: string, remark?: string) =>
    shgPost<Product>(`/product/${productId}/approve`, { remark }),
  reject: (productId: string, reason: string, remark?: string) =>
    shgPost<Product>(`/product/${productId}/reject`, { reason, remark }),
};
