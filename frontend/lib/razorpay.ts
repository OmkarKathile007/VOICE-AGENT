// Thin wrapper around Razorpay's hosted Checkout script.
// The script is loaded on demand so it doesn't affect the rest of the app.

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;                 // public key id
  amount: number;              // in paise
  currency: string;
  name: string;                // business/store name shown in the modal
  description?: string;
  order_id: string;            // Razorpay order id from the backend
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (response: unknown) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/** Injects the Checkout script once; resolves true when it's ready to use. */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/** Opens the Razorpay Checkout modal. Call loadRazorpayScript() first. */
export function openRazorpayCheckout(options: RazorpayCheckoutOptions): void {
  if (!window.Razorpay) throw new Error('Razorpay SDK failed to load');
  const rzp = new window.Razorpay(options);
  rzp.open();
}
