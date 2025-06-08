"use client";

import { useState } from "react";
import { hiringServices } from "../../../sample_data/hiring";
import {
  Star,
  Check,
  Users,
  Award,
  Target,
  Zap,
  Shield,
  ArrowRight,
  MessageCircle,
  Phone,
} from "lucide-react";

export default function HiringServices() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case "Premium Career Coaching":
        return <Target className="w-8 h-8" />;
      case "Job Placement Guarantee":
        return <Shield className="w-8 h-8" />;
      case "Executive Search":
        return <Award className="w-8 h-8" />;
      case "Quick Hire Support":
        return <Zap className="w-8 h-8" />;
      default:
        return <Users className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 my-16">
      <div className="max-w-7xl mx-auto">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {hiringServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-xl border border-gray-100 shadow transition hover:shadow-lg transform hover:-translate-y-1 ${
                selectedService === service.id
                  ? "border-indigo-500 ring-1 ring-indigo-200"
                  : ""
              } p-6`}
            >
              {/* Header: icon, title, price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    {getServiceIcon(service.name)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {service.name}
                  </h3>
                </div>
                <div className="text-xl font-bold text-indigo-600">
                  {service.pricing}
                </div>
              </div>
              {/* Rating row */}
              <div className="flex items-center gap-1 mt-2 text-gray-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(service.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm">({service.reviews})</span>
              </div>
              {/* Description */}
              <p className="text-gray-700 text-sm mt-4">
                {service.description}
              </p>
              {/* Features list */}
              <div className="mt-4 space-y-1">
                {service.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-600 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setSelectedService(service.id)}
                  className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-700 transition"
                >
                  Select Plan
                  <ArrowRight className="w-4 h-4 inline-block ml-1" />
                </button>
                <button className="bg-gray-100 p-2 rounded hover:bg-gray-200 transition">
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                1. Consultation
              </h3>
              <p className="text-gray-600">
                Free initial consultation to understand your career goals and
                requirements
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                2. Strategy
              </h3>
              <p className="text-gray-600">
                Personalized job search strategy and profile optimization
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                3. Execution
              </h3>
              <p className="text-gray-600">
                Active job applications, interview preparation, and skill
                enhancement
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                4. Success
              </h3>
              <p className="text-gray-600">
                Job offer negotiation and onboarding support
              </p>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Success Stories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">AK</span>
                </div>
                <div>
                  <div className="font-semibold">Arjun Kumar</div>
                  <div className="text-sm text-gray-300">SDE at Google</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                &ldquo;Premium Career Coaching helped me transition from a service
                company to Google. The mock interviews were game-changing!&rdquo;
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">PS</span>
                </div>
                <div>
                  <div className="font-semibold">Priya Sharma</div>
                  <div className="text-sm text-gray-300">PM at Microsoft</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                &ldquo;Job Placement Guarantee gave me confidence. Within 3 months, I
                had 4 offers including Microsoft PM role!&rdquo;
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">RG</span>
                </div>
                <div>
                  <div className="font-semibold">Rahul Gupta</div>
                  <div className="text-sm text-gray-300">
                    Director at Amazon
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                &ldquo;Executive Search connected me with exclusive opportunities I
                never knew existed. Now leading a team of 50+ at Amazon.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Book a free consultation with our career experts. Let&apos;s discuss your
            goals and create a personalized strategy to land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors duration-200 font-semibold flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Book Free Consultation
            </button>
            <button className="border border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors duration-200 font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat with Expert
            </button>
          </div>

          <div className="mt-6 text-indigo-200">
            <p className="text-sm">
              💬 WhatsApp: +91 81213 98942 | 📧 career@nirudhyog.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
