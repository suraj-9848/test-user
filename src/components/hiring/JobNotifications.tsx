"use client";

import { useState, useEffect } from "react";
import { JobNotification } from "@/types/hiring";
import { subscriptionService } from "@/services/subscriptionService";
import { API_ENDPOINTS, buildApiUrl } from "@/config/urls";
import {
  Bell,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Calendar,
  Crown,
  Zap,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePro } from "@/context/usePro";
import { attemptRefreshToken, isJWTExpired } from "@/utils/axiosInterceptor";

// Frontend-only helper for matching top companies (case-insensitive, with aliases)
const TOP_COMPANY_ALIASES = [
  "meta",
  "facebook",
  "amazon",
  "apple",
  "netflix",
  "google",
  "alphabet",
  "microsoft",
];
const isTopCompany = (name?: string) => {
  if (!name) return false;
  const n = name.toLowerCase();
  return TOP_COMPANY_ALIASES.some((alias) => n.includes(alias));
};

interface JobWithEarlyAccess extends JobNotification {
  earlyAccess?: {
    isInEarlyAccessPeriod: boolean;
    earlyAccessUntil: string | null;
    userHasAccess: boolean;
  };
}

interface JobsResponse {
  success: boolean;
  count: number;
  jobs: JobWithEarlyAccess[];
  earlyAccessInfo?: {
    hiddenJobsCount: number;
    message: string;
    upgradeUrl: string;
  };
}

export default function JobNotifications() {
  const [filteredJobs, setFilteredJobs] = useState<JobWithEarlyAccess[]>([]);
  const [allJobs, setAllJobs] = useState<JobWithEarlyAccess[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [notifications, setNotifications] = useState<string[]>([]);
  const { isProUser, refresh } = usePro();
  useEffect(() => {
    // Try to refresh pro once when mounting this page
    refresh().catch(() => {});
  }, [refresh]);
  const [earlyAccessInfo, setEarlyAccessInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load jobs from backend
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Include Authorization header so backend can compute early-access with Pro
      let token =
        typeof window !== "undefined"
          ? localStorage.getItem("jwt") || localStorage.getItem("token")
          : null;
      if (!token || (token && isJWTExpired(token))) {
        try {
          const refreshed = await attemptRefreshToken();
          if (refreshed) token = refreshed;
        } catch {}
      }

      const doFetch = async (authToken?: string) => {
        return fetch(buildApiUrl(API_ENDPOINTS.HIRING.JOBS), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });
      };

      let res = await doFetch(token || undefined);
      if (res.status === 401) {
        try {
          const refreshed = await attemptRefreshToken();
          if (refreshed) {
            token = refreshed;
            res = await doFetch(token);
          }
        } catch {}
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: JobsResponse = await res.json();
      setAllJobs(data.jobs || []);
      setEarlyAccessInfo(data.earlyAccessInfo);
    } catch (error) {
      console.error("Error loading jobs:", error);
      setAllJobs([]);
      setEarlyAccessInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = allJobs;

    if (searchTerm) {
      filtered = filtered.filter((job) => {
        const hay = `${job.title} ${job.company} ${job.location}`.toLowerCase();
        return hay.includes(searchTerm.toLowerCase());
      });
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((job) => job.type === selectedType);
    }

    if (selectedExperience !== "all") {
      filtered = filtered.filter((job) =>
        (job as any).experience
          ? (job as any).experience.includes(selectedExperience)
          : false,
      );
    }

    setFilteredJobs(filtered);
  }, [allJobs, searchTerm, selectedType, selectedExperience]);

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

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const getDaysLeft = (deadline?: string | Date | null): number | null => {
    if (!deadline) return null;
    const d = deadline instanceof Date ? deadline : new Date(deadline);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    const diffTime = d.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const goToUpgrade = () => {
    // Always navigate to the in-page Pro tab
    router.push("/hiring?tab=pro");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-6 md:pt-8 pb-28 px-4">
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
                <option value="Fresher">Fresher</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-2 years">1-2 years</option>
                <option value="2-4 years">2-4 years</option>
                <option value="4+ years">4+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pro Status Badge */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Latest Jobs
          </h1>
          {isProUser && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
              <Crown className="w-3 h-3" /> Pro
            </span>
          )}
        </div>

        {/* Pro Status and Early Access Info */}
        {isProUser && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Crown className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Pro Subscriber Active
                </h3>
                <p className="text-sm text-gray-600">
                  You have early access to all job postings!
                </p>
              </div>
            </div>
          </div>
        )}

        {earlyAccessInfo && !isProUser && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-0.5">
                    Missing Out on Early Access!
                  </h3>
                  <p className="text-sm text-gray-700 truncate sm:whitespace-normal">
                    {earlyAccessInfo.message}
                  </p>
                </div>
              </div>
              <button
                onClick={goToUpgrade}
                className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Upgrade to Pro Now
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

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
                filteredJobs.filter((job) =>
                  isTopCompany(
                    (job as any).company ?? (job as any).companyName,
                  ),
                ).length
              }
            </div>
            <div className="text-gray-600">Top Companies</div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 items-stretch content-start">
          {filteredJobs.map((job) => {
            const daysLeft = getDaysLeft((job as any).deadline);
            const isUrgent = daysLeft !== null && daysLeft <= 3;
            const isNotified = notifications.includes(job.id);
            const typeStr = (job as any).type || "other";
            const typeLabel =
              typeof typeStr === "string" && typeStr.length > 0
                ? typeStr.charAt(0).toUpperCase() + typeStr.slice(1)
                : "Job";
            const reqs: string[] = Array.isArray((job as any).requirements)
              ? ((job as any).requirements as string[])
              : [];
            const postedRaw =
              (job as any).postedDate ||
              (job as any).createdAt ||
              (job as any).created_at ||
              null;

            return (
              <div
                key={job.id}
                className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
                  isUrgent ? "border-red-200" : "border-gray-200"
                }`}
              >
                <div className="p-6">
                  {/* Card content as grid: left details, right actions */}
                  <div className="grid gap-4 lg:grid-cols-[1fr,14rem] items-start">
                    {/* Details column */}
                    <div className="min-w-0">
                      <div className="mb-4">
                        <div className="flex items-start gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900 break-words">
                            {job.title}
                          </h3>
                          {job.earlyAccess?.isInEarlyAccessPeriod && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              <Crown className="w-3 h-3" />
                              {isProUser ? "Early Access" : "Pro Only"}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                          <div className="flex items-center gap-1 min-w-0">
                            <Building className="w-4 h-4" />
                            <span className="font-semibold break-words">
                              {(job as any).company ||
                                (job as any).companyName ||
                                "Company"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 min-w-0">
                            <MapPin className="w-4 h-4" />
                            <span className="break-words">
                              {(job as any).location || "Remote"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(typeStr)}`}
                          >
                            {typeLabel}
                          </span>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm break-words">
                              {(job as any).experience || "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm font-medium break-words">
                              {(job as any).salary || "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3 break-words">
                        {(job as any).description || ""}
                      </p>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Required Skills:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {reqs
                            .slice(0, 5)
                            .map((req: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                              >
                                {req}
                              </span>
                            ))}
                          {reqs.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                              +{reqs.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Posted date and deadline */}
                      <div className="mt-4 text-sm text-gray-500 flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted: {formatDate(postedRaw)}
                        </span>
                        {daysLeft !== null && (
                          <span
                            className={`inline-flex items-center gap-1 ${
                              isUrgent
                                ? "text-red-600 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                            {daysLeft > 0
                              ? `${daysLeft} days left to apply`
                              : "Application deadline passed"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions column */}
                    <div className="flex flex-col gap-3 lg:col-start-2">
                      {/* Notify toggle */}
                      <button
                        onClick={() => toggleNotification(job.id)}
                        className={`self-end flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 border ${
                          isNotified
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                        title={isNotified ? "Notifications on" : "Notify me"}
                      >
                        <Bell className="w-5 h-5" />
                      </button>

                      <button className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold">
                        Apply Now
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
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
