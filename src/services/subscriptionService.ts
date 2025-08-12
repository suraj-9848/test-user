// Frontend service for Pro Subscription management with 24-hour early job access

import { loadRazorpayScript } from "../utils/razorpay";
import { attemptRefreshToken, isJWTExpired } from "@/utils/axiosInterceptor";
import { API_ENDPOINTS, buildApiUrl } from "@/config/urls";
import { toast } from "react-hot-toast";

export interface ProPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_months: number;
  features: string[];
  is_active: boolean;
}

export interface ProSubscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "canceled" | "expired" | "pending";
  amount: number;
  currency: string;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order: { id: string; amount: number; currency: string };
  key: string;
  plan: ProPlan;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan_id: string;
}

// Raw subscription shape returned by backend (supports snake_case and camelCase)
type RawProSubscription = {
  id: string;
  userId?: string;
  user_id?: string;
  planId?: string;
  plan_id?: string;
  status: "active" | "canceled" | "expired" | "pending";
  amount: number;
  currency?: string;
  startsAt?: string;
  starts_at?: string;
  startDate?: string;
  expiresAt?: string;
  expires_at?: string;
  expiry?: string;
  expiryDate?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

// Typed response for current subscription/pro status endpoint
interface ProStatusResponse {
  success?: boolean;
  proDetails?: {
    isProUser?: boolean;
    active?: boolean;
    expiresAt?: string | null;
    expiry?: string | null;
    expiryDate?: string | null;
    currentSubscription?: RawProSubscription | null;
  } | null;
  isProUser?: boolean;
  subscription?: RawProSubscription | null;
  currentSubscription?: RawProSubscription | null;
  data?: {
    proDetails?: ProStatusResponse["proDetails"];
    subscription?: RawProSubscription | null;
  } | null;
}

// Normalize proDetails to a single, consistent shape
function normalizeProDetails(pd: ProStatusResponse["proDetails"]): {
  isProUser: boolean;
  active: boolean;
  expiresAt: string | null;
  currentSubscription: RawProSubscription | null;
} {
  const isProUser = pd?.isProUser === true;
  const active = pd?.active === true;
  const expiresAt =
    (pd?.expiresAt || pd?.expiry || pd?.expiryDate || null) ?? null;
  const currentSubscription = pd?.currentSubscription ?? null;
  return { isProUser, active, expiresAt, currentSubscription };
}

// Normalizer to convert RawProSubscription to ProSubscription
function normalizeSubscription(raw: RawProSubscription): ProSubscription {
  return {
    id: raw.id,
    userId: raw.userId || raw.user_id || "",
    planId: raw.planId || raw.plan_id || "",
    status: raw.status,
    amount: raw.amount,
    currency: raw.currency || "INR",
    startsAt: raw.startsAt || raw.starts_at || raw.startDate || "",
    expiresAt:
      raw.expiresAt || raw.expires_at || raw.expiry || raw.expiryDate || "",
    createdAt: raw.createdAt || raw.created_at || "",
    updatedAt: raw.updatedAt || raw.updated_at || "",
  };
}

class SubscriptionService {
  private async getTokenEnsuringFresh(): Promise<string> {
    let token =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

    // Refresh if missing or expired
    if (!token || (token && isJWTExpired(token))) {
      try {
        const refreshed = await attemptRefreshToken();
        if (refreshed) {
          token = refreshed;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!token) {
      throw new Error("TOKEN_MISSING");
    }
    return token;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getTokenEnsuringFresh();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  private async fetchWithAuthRetry(
    url: string,
    options: RequestInit,
  ): Promise<Response> {
    // First attempt
    let headers: HeadersInit = options.headers || (await this.getAuthHeaders());
    let resp = await fetch(url, { ...options, headers });

    if (resp.status === 401) {
      // try refresh once
      const refreshed = await attemptRefreshToken();
      if (refreshed) {
        headers = {
          ...(headers as any),
          Authorization: `Bearer ${refreshed}`,
        };
        resp = await fetch(url, { ...options, headers });
      }
    }

    return resp;
  }

  // Get available pro plans (public endpoint)
  async getAvailablePlans(): Promise<ProPlan[]> {
    try {
      const response = await fetch(
        buildApiUrl(API_ENDPOINTS.PUBLIC.PRO_PLANS),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch plans");
      }

      return data.plans || [];
    } catch (error) {
      console.error("Error fetching pro plans:", error);
      // Return empty array if API fails, let component handle loading state
      return [];
    }
  }

  // Create Razorpay order for subscription
  async createSubscriptionOrder(planId: string): Promise<CreateOrderResponse> {
    try {
      const response = await this.fetchWithAuthRetry(
        buildApiUrl(API_ENDPOINTS.STUDENT.PRO_SUBSCRIPTIONS.CREATE_ORDER),
        {
          method: "POST",
          headers: await this.getAuthHeaders(),
          body: JSON.stringify({ plan_id: planId }),
          credentials: "include",
        },
      );

      const data = await response.json().catch(() => ({}));

      // Log the full response for debugging
      console.log("Create order response:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${data.message || response.statusText}`,
        );
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      return data;
    } catch (error: any) {
      if (error?.message === "TOKEN_MISSING") {
        if (typeof window !== "undefined") {
          toast.error("Please log in to purchase Pro");
        }
        throw new Error("Unauthorized - Token Missing");
      }
      console.error("Error creating subscription order", error);
      if (typeof window !== "undefined") {
        toast.error(error?.message || "Failed to create subscription order");
      }
      throw error;
    }
  }

  // Verify payment and activate subscription
  async verifyPayment(
    paymentData: PaymentVerificationData,
  ): Promise<ProSubscription> {
    try {
      const response = await this.fetchWithAuthRetry(
        buildApiUrl(API_ENDPOINTS.STUDENT.PRO_SUBSCRIPTIONS.VERIFY_PAYMENT),
        {
          method: "POST",
          headers: await this.getAuthHeaders(),
          body: JSON.stringify(paymentData),
          credentials: "include",
        },
      );

      // Surface non-200 errors with details from server if available
      if (!response.ok) {
        let serverMsg = "";
        try {
          const errBody = await response.json();
          serverMsg = errBody?.message || errBody?.error || "";
        } catch (_) {
          // ignore JSON parse errors
        }
        const errText = serverMsg
          ? `HTTP ${response.status}: ${serverMsg}`
          : `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errText);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Payment verification failed");
      }

      return data.subscription;
    } catch (error: any) {
      if (error?.message === "TOKEN_MISSING") {
        if (typeof window !== "undefined") {
          toast.error("Please log in to complete payment");
        }
        throw new Error("Unauthorized - Token Missing");
      }
      console.error("Error verifying payment:", error);
      if (typeof window !== "undefined") {
        toast.error(error?.message || "Payment verification failed");
      }
      throw error;
    }
  }

  // Get current subscription with Pro status
  async getCurrentSubscription(): Promise<{
    subscription: ProSubscription | null;
    isProUser: boolean;
    expiresAt: string | null;
  }> {
    try {
      const response = await this.fetchWithAuthRetry(
        buildApiUrl(API_ENDPOINTS.STUDENT.PRO_SUBSCRIPTIONS.CURRENT),
        {
          method: "GET",
          headers: await this.getAuthHeaders(),
          credentials: "include",
        },
      );

      if (!response.ok) {
        // Let caller decide unknown status
        let serverMsg = "";
        try {
          const errBody = await response.json();
          serverMsg = errBody?.message || errBody?.error || "";
        } catch {}
        throw new Error(serverMsg || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data?.success === false) {
        throw new Error(data.message || "Failed to fetch subscription");
      }

      const resp = data as ProStatusResponse;

      // Standardize proDetails and subscription
      const pd = normalizeProDetails(
        resp.proDetails || resp.data?.proDetails || null,
      );
      const subRaw =
        pd.currentSubscription ??
        resp.subscription ??
        resp.currentSubscription ??
        resp.data?.subscription ??
        null;

      const subscription: ProSubscription | null = subRaw
        ? normalizeSubscription(subRaw)
        : null;

      const now = new Date();
      const subUnexpired = Boolean(
        subscription?.expiresAt ? new Date(subscription.expiresAt) > now : true,
      );

      const isProUser = Boolean(
        pd.isProUser ||
          pd.active ||
          resp?.isProUser === true ||
          (subscription && subscription.status === "active" && subUnexpired),
      );

      const expiresAt: string | null =
        pd.expiresAt ?? subscription?.expiresAt ?? null;

      // Persist locally for quicker UI decisions on reloads
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("isProUser", isProUser ? "1" : "0");
          if (expiresAt) localStorage.setItem("proExpiresAt", expiresAt);
          else localStorage.removeItem("proExpiresAt");
        } catch {}
      }

      return {
        subscription,
        isProUser,
        expiresAt,
      };
    } catch (error: any) {
      if (error?.message === "TOKEN_MISSING") {
        // Do not toast here to avoid noisy toasts on background checks
        throw new Error("Unauthorized - Token Missing");
      }
      console.error("Error fetching current subscription:", error);
      // Do not overwrite local cache on failure
      throw error;
    }
  }

  // Process payment with Razorpay
  async processPayment(plan: ProPlan): Promise<ProSubscription> {
    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create order
      const orderData = await this.createSubscriptionOrder(plan.id);

      return new Promise((resolve, reject) => {
        const options = {
          key: orderData.key,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: "Nirudhyog Pro",
          description: `${plan.name} - 24hr Early Job Access + Premium Features`,
          order_id: orderData.order.id,
          handler: async (response: any) => {
            try {
              const subscription = await this.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: plan.id,
              });
              // Persist Pro status locally on success
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem("isProUser", "1");
                  if (subscription?.expiresAt) {
                    localStorage.setItem(
                      "proExpiresAt",
                      subscription.expiresAt,
                    );
                  }
                } catch {}
              }
              resolve(subscription);
            } catch (error: any) {
              if (typeof window !== "undefined") {
                toast.error(error?.message || "Payment failed");
              }
              reject(error);
            }
          },
          prefill: {
            name: "",
            email: "",
          },
          theme: {
            color: "#3B82F6",
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled by user"));
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      });
    } catch (error: any) {
      if (typeof window !== "undefined") {
        toast.error(error?.message || "Payment failed");
      }
      console.error("Error processing payment:", error);
      throw error;
    }
  }

  // Check if user has active pro subscription
  async checkProStatus(): Promise<boolean> {
    try {
      const { isProUser, expiresAt } = await this.getCurrentSubscription();
      if (!isProUser) return false;
      if (!expiresAt) return true; // lifetime
      return new Date(expiresAt) > new Date();
    } catch (error) {
      console.error("Error checking pro status:", error);
      return false;
    }
  }

  // Get Pro subscription benefits
  getProBenefits(): string[] {
    return [
      "🚀 24-Hour Early Access to Job Postings",
      "👑 Premium Profile Badge",
      "⚡ Priority Customer Support",
      "📊 Advanced Analytics Dashboard",
      "📝 Resume Review by Experts",
      "✨ Enhanced Profile Features",
    ];
  }
}

export const subscriptionService = new SubscriptionService();
