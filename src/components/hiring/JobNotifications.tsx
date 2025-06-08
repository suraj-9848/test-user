"use client";

import { useState, useEffect } from "react";
import { JobNotification } from "../../../types/hiring";
import { jobNotifications } from "../../../sample_data/hiring";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Calendar,
  Bell,
  ExternalLink,
} from "lucide-react";

export default function JobNotifications() {
  const [filteredJobs, setFilteredJobs] =
    useState<JobNotification[]>(jobNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [notifications, setNotifications] = useState<string[]>([]);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobNotifications;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((job) => job.type === selectedType);
    }

    if (selectedExperience !== "all") {
      filtered = filtered.filter((job) =>
        job.experience.includes(selectedExperience),
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedType, selectedExperience]);

  const toggleNotification = (jobId: string) => {
    setNotifications((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-purple-100 text-purple-800";
      case "internship":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getDaysLeft = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 my-16">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>

              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="2-4">2-4 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">
              {filteredJobs.length}
            </div>
            <div className="text-gray-600">Available Jobs</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-green-600">
              {
                filteredJobs.filter(
                  (job) =>
                    job.company === "Microsoft" ||
                    job.company === "Google" ||
                    job.company === "Amazon",
                ).length
              }
            </div>
            <div className="text-gray-600">FAANG Companies</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">
              {filteredJobs.filter((job) => job.type === "internship").length}
            </div>
            <div className="text-gray-600">Internships</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl font-bold text-orange-600">
              {notifications.length}
            </div>
            <div className="text-gray-600">Notifications Set</div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredJobs.map((job) => {
            const daysLeft = getDaysLeft(job.deadline);
            const isUrgent = daysLeft <= 3;
            const isNotified = notifications.includes(job.id);

            return (
              <div
                key={job.id}
                className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isUrgent ? "border-red-200 bg-red-50/30" : "border-gray-100"
                }`}
              >
                <div className="p-6">
                  {/* notify button absolute */}
                  <button
                    onClick={() => toggleNotification(job.id)}
                    className={`absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                      isNotified
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              <span className="font-semibold">
                                {job.company}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                                job.type,
                              )}`}
                            >
                              {job.type.charAt(0).toUpperCase() +
                                job.type.slice(1)}
                            </span>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{job.experience}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {job.salary}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Required Skills:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.slice(0, 5).map((req, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                            >
                              {req}
                            </span>
                          ))}
                          {job.requirements.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                              +{job.requirements.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Posted date */}
                      <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Posted: {formatDate(job.postedDate)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:min-w-[200px]">
                      <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold">
                        Apply Now
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </button>
                      {job.isExternal && (
                        <div className="text-center text-xs text-gray-500">
                          External posting
                        </div>
                      )}
                    </div>
                  </div>

                  {/* deadline badge absolute bottom-right */}
                  <div
                    className={`absolute bottom-4 right-4 flex items-center gap-1 text-sm ${
                      isUrgent ? "text-red-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {daysLeft > 0
                        ? `${daysLeft} days left to apply`
                        : "Application deadline passed"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Don&apos;t see the perfect job yet?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Set up job alerts and get notified instantly when new opportunities
            matching your profile are posted. Our AI will match you with the
            best opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 font-semibold">
              Set Job Alerts
            </button>
            <button className="border border-white/30 text-white px-8 py-3 rounded-xl hover:bg-white/10 transition-colors duration-200 font-semibold">
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
