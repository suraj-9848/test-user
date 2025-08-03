// Frontend service for Pro Subscription management with 24-hour early job access

import { loadRazorpayScript } from "../utils/razorpay";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

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
  order: {
    id: string;
    amount: number;
    currency: string;
  };
  key: string;
  plan: ProPlan;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan_id: string;
}

class SubscriptionService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Try to get JWT token from localStorage (primary method used by the app)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

    if (!token) {
      console.warn("No JWT token found in localStorage");
    }

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get available pro plans (public endpoint)
  async getAvailablePlans(): Promise<ProPlan[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/pro-plans`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
      const response = await fetch(
        `${API_BASE_URL}/student/pro-subscriptions/create-order`,
        {
          method: "POST",
          headers: await this.getAuthHeaders(),
          body: JSON.stringify({ plan_id: planId }),
        },
      );

      const data = await response.json();

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
    } catch (error) {
      console.error("Error creating subscription order:", error);
      throw error;
    }
  }

  // Verify payment and activate subscription
  async verifyPayment(
    paymentData: PaymentVerificationData,
  ): Promise<ProSubscription> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/student/pro-subscriptions/verify-payment`,
        {
          method: "POST",
          headers: await this.getAuthHeaders(),
          body: JSON.stringify(paymentData),
        },
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Payment verification failed");
      }

      return data.subscription;
    } catch (error) {
      console.error("Error verifying payment:", error);
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
      const response = await fetch(
        `${API_BASE_URL}/student/pro-subscriptions/current`,
        {
          method: "GET",
          headers: await this.getAuthHeaders(),
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.warn(`Subscription API not available: ${response.status}`);
        return {
          subscription: null,
          isProUser: false,
          expiresAt: null,
        };
      }

      const data = await response.json();
      if (!data.success) {
        return {
          subscription: null,
          isProUser: false,
          expiresAt: null,
        };
      }

      return {
        subscription: data.proDetails?.currentSubscription || data.subscription,
        isProUser: data.proDetails?.isProUser || false,
        expiresAt: data.proDetails?.expiresAt || null,
      };
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      return {
        subscription: null,
        isProUser: false,
        expiresAt: null,
      };
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
              resolve(subscription);
            } catch (error) {
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
    } catch (error) {
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
