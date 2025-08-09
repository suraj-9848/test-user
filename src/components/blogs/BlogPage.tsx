"use client";

import { useEffect, useState, useMemo } from "react";
import BlogCard from "./BlogCard";
import { apiService } from "../../config/api";

interface Blog {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  hashtags?: string[];
  author?: string;
  createdAt: string;
  updatedAt: string;
}

const extractTagsFromBlogs = (blogs: Blog[]): string[] => {
  const allTags = new Set<string>();
  blogs.forEach((blog) => {
    if (blog.hashtags) {
      blog.hashtags.forEach((tag) => {
        const cleanTag = tag.startsWith("#") ? tag.slice(1) : tag;
        allTags.add(cleanTag);
      });
    }
  });
  return ["All", ...Array.from(allTags).sort()];
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const availableTags = useMemo(() => extractTagsFromBlogs(blogs), [blogs]);

  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

    // Filter by tag
    if (activeTag !== "All") {
      filtered = filtered.filter((blog) =>
        blog.hashtags?.some((tag) => {
          const cleanTag = tag.startsWith("#") ? tag.slice(1) : tag;
          return cleanTag === activeTag;
        }),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query) ||
          blog.author?.toLowerCase().includes(query) ||
          blog.hashtags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [blogs, activeTag, searchQuery]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.getBlogs();

        let actualBlogs: Blog[] = [];

        if (response && response.success && Array.isArray(response.blogs)) {
          actualBlogs = response.blogs;
        } else if (response && Array.isArray(response.blogs)) {
          actualBlogs = response.blogs;
        } else if (response && Array.isArray(response)) {
          actualBlogs = response;
        } else {
          throw new Error("Invalid response format from server");
        }

        setBlogs(actualBlogs);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load blogs from database";
        setError(errorMessage);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const retryFetch = () => {
    setError(null);
    setBlogs([]);
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await apiService.getBlogs();

        let actualBlogs: Blog[] = [];

        if (response && response.success && Array.isArray(response.blogs)) {
          actualBlogs = response.blogs;
        } else if (response && Array.isArray(response.blogs)) {
          actualBlogs = response.blogs;
        } else if (response && Array.isArray(response)) {
          actualBlogs = response;
        } else {
          throw new Error("Invalid response format from server");
        }

        setBlogs(actualBlogs);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load blogs";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveTag("All");
  };

  // Error state
  if (error && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-red-100 rounded-3xl flex items-center justify-center shadow-lg">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Failed to Load
          </h3>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={retryFetch}
            disabled={loading}
            className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              "Try Again"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200 pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="w-96 h-96 bg-blue-200 rounded-full blur-3xl absolute top-10 left-10 animate-[spin_60s_linear_infinite]" />
          <div className="w-72 h-72 bg-purple-200 rounded-full blur-3xl absolute bottom-10 right-10 animate-[spin_60s_linear_infinite_reverse]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Stories & Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover insights, announcements, and exciting updates from the
            Nirudhyog community.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, content, author, or tags..."
                className="block w-full pl-14 pr-14 py-5 border border-gray-300 rounded-2xl text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 shadow-md hover:shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center"
                >
                  <svg
                    className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Info */}
            {searchQuery && (
              <div className="mt-6 text-center">
                <p className="text-lg text-gray-600 mb-3">
                  {filteredBlogs.length === 0
                    ? `No results found for "${searchQuery}"`
                    : `Found ${filteredBlogs.length} article${filteredBlogs.length === 1 ? "" : "s"} for "${searchQuery}"`}
                </p>
                <button
                  onClick={clearSearch}
                  className="text-base font-medium text-black hover:text-gray-700 transition-colors duration-200"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {availableTags.map((tag) => {
              const count =
                tag === "All"
                  ? blogs.length
                  : blogs.filter((blog) =>
                      blog.hashtags?.some((hashtag) => {
                        const cleanTag = hashtag.startsWith("#")
                          ? hashtag.slice(1)
                          : hashtag;
                        return cleanTag === tag;
                      }),
                    ).length;

              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 ${
                    activeTag === tag
                      ? "bg-black text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  {tag} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCard key={`skeleton-${i}`} isLoading />
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  coverImage={blog.coverImage}
                  hashtags={blog.hashtags}
                  author={blog.author}
                  createdAt={blog.createdAt}
                  updatedAt={blog.updatedAt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-28 h-28 mx-auto mb-10 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-gray-200">
                <svg
                  className="w-14 h-14 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                {searchQuery
                  ? "No articles match your search"
                  : activeTag === "All"
                    ? "No articles found"
                    : `No articles in ${activeTag}`}
              </h3>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                {searchQuery
                  ? "Try adjusting your search terms or browse all articles to discover our latest content."
                  : activeTag === "All"
                    ? "Check back soon for new content and exciting updates from our community."
                    : "Try exploring other categories or check back later for new content in this section."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear Search
                  </button>
                )}
                {activeTag !== "All" && !searchQuery && (
                  <button
                    onClick={() => setActiveTag("All")}
                    className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    View All Articles
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
