"use client";
import React, { useState, useEffect } from "react";
import {
  Crown,
  Clock,
  Shield,
  BarChart3,
  FileCheck,
  Star,
  Check,
  Zap,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useJWT } from "@/context/JWTContext";
import {
  subscriptionService,
  ProPlan,
  ProSubscription,
} from "../../services/subscriptionService";

export default function ProSubscriptionSection() {
  const { jwt } = useJWT();
  const [plans, setPlans] = useState<ProPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<ProSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = !!jwt;

  useEffect(() => {
    loadData();
  }, []);

  // Check for plan selected before login
  useEffect(() => {
    if (jwt && plans.length > 0) {
      const storedPlan = sessionStorage.getItem("selectedPlanAfterLogin");
      if (storedPlan) {
        try {
          const plan = JSON.parse(storedPlan);
          sessionStorage.removeItem("selectedPlanAfterLogin");
          // Small delay to ensure component is ready
          setTimeout(() => {
            setError(null);
            handleSubscribe(plan);
          }, 1000);
        } catch (err) {
          console.error("Error processing stored plan:", err);
        }
      }
    }
  }, [jwt, plans]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always load plans (public endpoint)
      const plansData = await subscriptionService.getAvailablePlans();
      setPlans(plansData);

      // Check if user is logged in and get subscription
      if (jwt) {
        try {
          const subscriptionData =
            await subscriptionService.getCurrentSubscription();
          setCurrentSubscription(subscriptionData.subscription);

          // Update Pro status based on actual subscription data
          if (subscriptionData.isProUser && subscriptionData.expiresAt) {
            const expiryDate = new Date(subscriptionData.expiresAt);
            const now = new Date();
            // Only set as Pro if subscription hasn't expired
            if (expiryDate > now) {
              // Pro is active
            }
          }
        } catch (subscriptionError) {
          // Error getting subscription data
          console.warn("Could not fetch subscription data:", subscriptionError);
          setCurrentSubscription(null);
        }
      } else {
        // User not logged in
        setCurrentSubscription(null);
      }
    } catch (err) {
      console.error("Error loading subscription data:", err);
      setError("Unable to load subscription data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: ProPlan) => {
    // Check if user is logged in first
    if (!isLoggedIn) {
      setError(
        "Please log in to subscribe to Pro plans. You need an account to save your subscription.",
      );
      // Store current plan and redirect to login
      sessionStorage.setItem("selectedPlanAfterLogin", JSON.stringify(plan));
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/sign-in";
      return;
    }

    try {
      setProcessingPlanId(plan.id);
      setError(null);

      const subscription = await subscriptionService.processPayment(plan);
      setCurrentSubscription(subscription);
      alert("Subscription activated successfully! You now have Pro access.");

      // Reload data to get updated subscription status
      await loadData();
    } catch (err) {
      console.error("Subscription error:", err);
      if (err instanceof Error && err.message.includes("401")) {
        setError("Your session has expired. Please log in again to subscribe.");
        // Clear invalid JWT and redirect to login
        localStorage.removeItem("jwt");
        sessionStorage.setItem("selectedPlanAfterLogin", JSON.stringify(plan));
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        setTimeout(() => (window.location.href = "/sign-in"), 2000);
      } else if (err instanceof Error && err.message.includes("HTTP")) {
        setError(`Server error: ${err.message}`);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Payment failed. Please try again.",
        );
      }
    } finally {
      setProcessingPlanId(null);
    }
  };

  const proBenefits = [
    {
      icon: Clock,
      title: "24-Hour Early Job Access",
      description:
        "Get exclusive access to job postings 24 hours before they go public",
      highlight: true,
    },
    {
      icon: Crown,
      title: "Premium Profile Badge",
      description:
        "Stand out to recruiters with a special Pro badge on your profile",
    },
    {
      icon: Shield,
      title: "Priority Support",
      description: "Get faster response times and dedicated customer support",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed insights on your job application performance",
    },
    {
      icon: FileCheck,
      title: "Resume Review",
      description: "Professional resume review and feedback from experts",
    },
    {
      icon: Star,
      title: "Enhanced Profile",
      description: "Premium features and priority placement in search results",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">Nirudhyog Pro</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the competitive edge in your job search with exclusive early
            access and premium features
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pro Subscription Active
                  </h3>
                  <p className="text-sm text-gray-600">
                    Expires on{" "}
                    {new Date(
                      currentSubscription.expiresAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentSubscription.status.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Pro Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {proBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  benefit.highlight
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                    : "bg-white border-gray-200 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center mb-3">
                  <Icon
                    className={`w-6 h-6 mr-3 ${benefit.highlight ? "text-blue-600" : "text-gray-600"}`}
                  />
                  <h3 className="font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
                {benefit.highlight && (
                  <div className="mt-3 inline-flex items-center text-xs font-medium text-blue-600">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular Feature
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Login Required Notice */}
        {!isLoggedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold text-blue-900">
                Login Required for Subscription
              </h3>
            </div>
            <p className="text-blue-700 mb-4">
              To subscribe to Pro plans and save your subscription to your
              account, you need to be logged in.
            </p>
            <button
              onClick={() => {
                // Store current page to redirect back after login
                sessionStorage.setItem(
                  "redirectAfterLogin",
                  window.location.pathname,
                );
                window.location.href = "/sign-in";
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Login to Subscribe
            </button>
          </div>
        )}

        {/* Pricing Plans */}
        {!currentSubscription && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Choose Your Plan
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative bg-white border rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${
                    index === 1
                      ? "border-blue-300 ring-2 ring-blue-100"
                      : "border-gray-200"
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{plan.price}
                      </span>
                      <span className="text-gray-600">
                        /{plan.duration_months} month
                        {plan.duration_months === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-sm"
                      >
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!processingPlanId || !isLoggedIn}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                      !isLoggedIn
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : processingPlanId && processingPlanId !== plan.id
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                          : index === 1
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processingPlanId === plan.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : !isLoggedIn ? (
                      "Login Required"
                    ) : (
                      <>
                        Subscribe Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Early Access Highlight */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-3">
            24-Hour Early Access Advantage
          </h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Be the first to see and apply to new job postings. While others wait
            24 hours, Pro subscribers get immediate access to all job
            opportunities, giving you a significant advantage.
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-1">Regular Users</div>
              <div className="text-blue-100">
                Wait 24 hours after job posting
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold mb-1">Pro Users</div>
              <div className="text-blue-100">Immediate access when posted</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
