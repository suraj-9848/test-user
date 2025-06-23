// src/components/courses/EnrollmentModal.tsx
"use client";
import React, { useState } from "react";
import {
  X,
  Star,
  Clock,
  Award,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building,
} from "lucide-react";
import Image from "next/image";
import { Course, EnrollmentData } from "../../types/index";

interface EnrollmentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollmentModal({
  course,
  isOpen,
  onClose,
}: EnrollmentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EnrollmentData>({
    courseId: course.id,
    studentName: "",
    email: "",
    phone: "",
    experience: "",
    motivation: "",
    paymentMethod: "upi",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsEnrolled(true);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isEnrolled) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Enrollment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Welcome to <strong>{course.title}</strong>! You&apos;ll receive a
            confirmation email shortly with your course access details.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Enroll in Course
            </h2>
            <p className="text-gray-600">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Course Summary (Left Side) */}
          <div className="lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
            <div className="relative h-40 rounded-lg overflow-hidden mb-4">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="font-bold text-lg mb-2 line-clamp-2">
              {course.title}
            </h3>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src={course.instructorImage}
                  alt={course.instructor}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {course.rating} ({course.studentsEnrolled.toLocaleString()}{" "}
                  students)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              {course.certificateProvided && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Certificate included</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(course.price)}
                </span>
              </div>
              {course.originalPrice && (
                <div className="text-right">
                  <span className="text-gray-400 line-through text-sm">
                    {formatPrice(course.originalPrice)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form Content (Right Side) */}
          <div className="lg:w-2/3 p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your experience level</option>
                      <option value="complete-beginner">
                        Complete Beginner
                      </option>
                      <option value="some-knowledge">Some Knowledge</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Course Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Tell us about yourself
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What motivates you to take this course?
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your goals and what you hope to achieve..."
                    />
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      What you&apos;ll get:
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Payment Method
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <Smartphone className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-gray-500">
                          Pay using PhonePe, GPay, Paytm
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">
                          Visa, Mastercard, RuPay
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="netbanking"
                        checked={formData.paymentMethod === "netbanking"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <Building className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">Net Banking</div>
                        <div className="text-sm text-gray-500">
                          All major banks supported
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Secure Payment
                    </h4>
                    <p className="text-sm text-green-800">
                      Your payment is protected by 256-bit SSL encryption. We
                      never store your payment details.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Processing..."
                      : `Pay ${formatPrice(course.price)}`}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
