"use client";

import React from "react";
import { TabId } from "@/components/hiring/HiringSidebar";
import {
  TrendingUp,
  Sparkles,
  Zap,
  Award,
  Building2,
  Globe,
  ArrowRight,
  Bell as BellIcon,
  Crown,
} from "lucide-react";

interface HiringOverviewProps {
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
}

export default function HiringOverview({ setActiveTab }: HiringOverviewProps) {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description:
        "Smart algorithms match you with perfect job opportunities based on your skills and preferences",
    },
    {
      icon: Award,
      title: "Verified Companies",
      description:
        "Connect with top-tier companies that have been thoroughly vetted for quality and culture",
    },
    {
      icon: Building2,
      title: "Career Growth",
      description:
        "Access mentoring, skill development, and career advancement programs",
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description:
        "Explore remote and international opportunities with leading companies worldwide",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 flex items-center min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">
                  Trusted by 50,000+ professionals
                </span>
              </div>
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Land Your
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    Dream Job
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-xl leading-relaxed">
                  Connect with top companies, get AI-powered job matches, and
                  accelerate your career with our next-generation hiring
                  platform.
                </p>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setActiveTab("apply")}
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Zap className="w-5 h-5" /> Start Your Application{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="group border-2 border-white/30 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <BellIcon className="w-5 h-5" /> Browse 2,500+ Jobs
                </button>
              </div>
            </div>
            {/* Stats Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Platform Impact</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      label: "Active Jobs",
                      value: "2,500+",
                      color: "from-green-400 to-blue-500",
                    },
                    {
                      label: "Success Rate",
                      value: "94%",
                      color: "from-purple-400 to-pink-500",
                    },
                    {
                      label: "Avg. Salary Hike",
                      value: "75%",
                      color: "from-yellow-400 to-orange-500",
                    },
                    {
                      label: "Partner Companies",
                      value: "500+",
                      color: "from-indigo-400 to-purple-500",
                    },
                  ].map((stat, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div
                        className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </div>
                      <div className="text-slate-300 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce delay-300"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60 animate-bounce delay-700"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose <span className="text-blue-600">Nirudhyog</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with personalized
              service to deliver exceptional career outcomes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Success Stories Section */}
      <section className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Success{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Stories
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Real professionals, real results. See how our platform has
              transformed careers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Kumar",
                role: "Senior Software Engineer",
                company: "Google",
                salary: "₹45 LPA",
                image: "👨‍💻",
                story:
                  "Landed my dream job at Google with 180% salary increase!",
              },
              {
                name: "Priya Sharma",
                role: "Product Manager",
                company: "Microsoft",
                salary: "₹38 LPA",
                image: "👩‍💼",
                story: "Transitioned from developer to PM role seamlessly.",
              },
              {
                name: "Arjun Patel",
                role: "Data Scientist",
                company: "Amazon",
                salary: "₹42 LPA",
                image: "👨‍🔬",
                story: "AI-powered matching found me the perfect ML role.",
              },
            ].map((person, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{person.image}</div>
                  <h3 className="text-xl font-bold text-white">
                    {person.name}
                  </h3>
                  <p className="text-blue-300 font-medium">{person.role}</p>
                  <p className="text-slate-300">{person.company}</p>
                </div>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-green-400">
                    {person.salary}
                  </div>
                </div>
                <p className="text-slate-300 text-center italic">
                  &ldquo;{person.story}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Transform Your{" "}
            <span className="text-yellow-300">Career</span>?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully advanced their
            careers through our platform. Your dream job is just one application
            away.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setActiveTab("apply")}
              className="group bg-white text-blue-600 px-10 py-5 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Zap className="w-6 h-6" /> Get Started Today{" "}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab("pro")}
              className="border-2 border-white/30 backdrop-blur-md text-white px-10 py-5 rounded-2xl hover:bg-white/10 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3"
            >
              <Crown className="w-6 h-6" /> Upgrade to Pro
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
