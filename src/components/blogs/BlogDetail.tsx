"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { apiService } from "../../config/api";
import BlogCard from "@/components/blogs/BlogCard";

interface Blog {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  hashtags?: string[];
  createdAt: string;
  updatedAt: string;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Unknown date";
  }
};

const getReadingTime = (content: string) => {
  try {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const words = textContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
    return `${minutes} min read`;
  } catch (error) {
    console.error("Reading time calculation error:", error);
    return "1 min read";
  }
};

const getFirstTag = (hashtags: string[] = []) => {
  if (!hashtags.length) return "Article";
  const tag = hashtags[0];
  return tag.startsWith("#") ? tag.slice(1) : tag;
};

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId) {
      setError("Blog ID is missing from URL");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.getBlogById(String(blogId));

        const blogData =
          response?.success && response.blog
            ? response.blog
            : response?.blog
              ? response.blog
              : (response as any).id
                ? (response as any)
                : (response as any).data?.blog
                  ? (response as any).data.blog
                  : (response as any).data?.id
                    ? (response as any).data
                    : null;

        if (blogData) {
          setBlog(blogData);
        } else {
          throw new Error(
            response?.message || `Blog with ID "${blogId}" not found`,
          );
        }
      } catch (err) {
        let errorMessage = "Failed to load blog post";
        if (err instanceof Error) {
          if (
            err.message.includes("404") ||
            err.message.toLowerCase().includes("not found")
          ) {
            errorMessage = `Blog post with ID "${blogId}" was not found`;
          } else if (err.message.includes("403")) {
            errorMessage = "You do not have permission to view this blog";
          } else if (err.message.includes("500")) {
            errorMessage = "Server error occurred while loading the blog";
          } else if (
            err.message.includes("Network Error") ||
            err.message.includes("fetch")
          ) {
            errorMessage = "Network error - please check your connection";
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, params]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (!blog) return;

      try {
        const response = await apiService.getBlogs();

        let allBlogs: Blog[] = [];
        if (response && Array.isArray(response.blogs)) {
          allBlogs = response.blogs;
        } else if (response && Array.isArray(response)) {
          allBlogs = response;
        }

        if (allBlogs.length > 0 && blog.hashtags && blog.hashtags.length > 0) {
          const relatedByHashtags = allBlogs.filter((b: Blog) => {
            if (b.id === blogId) return false;

            if (!b.hashtags || b.hashtags.length === 0) return false;

            return blog.hashtags?.some((currentTag) =>
              b.hashtags?.some((blogTag) => {
                const cleanCurrentTag = currentTag.startsWith("#")
                  ? currentTag.slice(1)
                  : currentTag;
                const cleanBlogTag = blogTag.startsWith("#")
                  ? blogTag.slice(1)
                  : blogTag;
                return (
                  cleanCurrentTag.toLowerCase() === cleanBlogTag.toLowerCase()
                );
              }),
            );
          });

          if (relatedByHashtags.length > 0) {
            const shuffled = relatedByHashtags.sort(() => 0.5 - Math.random());
            setRelatedBlogs(shuffled.slice(0, 2));
          } else {
            setRelatedBlogs([]);
          }
        } else {
          setRelatedBlogs([]);
        }
      } catch (err) {
        setRelatedBlogs([]);
      }
    };

    if (blog) {
      fetchRelatedBlogs();
    }
  }, [blog, blogId]);

  const retry = () => {
    setError(null);
    setBlog(null);
    setRelatedBlogs([]);
    window.location.reload();
  };

  if (loading) {
    return (
      <section className="relative isolate min-h-screen px-6 py-24 md:px-12 bg-gray-100 overflow-hidden pt-2">
        <span className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full blur-3xl opacity-40 bg-gradient-to-b from-blue-300 via-purple-200 to-gray-300" />
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden animate-pulse">
          <div className="bg-white/70 backdrop-blur-xl shadow-lg rounded-3xl p-8 md:p-12 space-y-8">
            <div className="h-12 bg-gray-200 rounded w-3/4" />
            <div className="h-[2px] bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded-full" />
              <div className="h-8 w-16 bg-gray-200 rounded-full" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!blog || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-gray-50 pt-32">
        <div className="text-6xl mb-4">📭</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Oops! This post went missing.
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {error ||
            "We couldn't find the blog you were looking for. It might have been moved or deleted."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!error?.includes("not found") && (
            <button
              onClick={retry}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          )}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition duration-300 group"
          >
            <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-base">Back to Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = formatDate(blog.createdAt);
  const readingTime = getReadingTime(blog.content);

  return (
    <section className="relative isolate min-h-screen px-4 py-24  bg-gray-50 overflow-hidden">
      <span className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full blur-3xl opacity-40 bg-gradient-to-b from-blue-200 via-purple-100 to-gray-200" />
      <span className="hidden lg:block absolute -z-10 right-10 top-1/3 w-72 h-72 rounded-full bg-purple-200/30 blur-3xl animate-pulse" />
      <span className="hidden lg:block absolute -z-10 -left-20 bottom-10 w-80 h-80 rounded-full bg-blue-200/40 blur-3xl animate-pulse" />

      <div className="relative max-w-4xl mx-auto rounded-3xl animate-[slide-up_0.6s_ease-out]">
        <div className="relative bg-white shadow-xl ring-1 ring-gray-200 rounded-3xl">
          <div className="absolute top-6 left-6 z-10">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition duration-300 group rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-gray-200 hover:border-gray-300"
            >
              <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Blog</span>
            </Link>
          </div>

          <div className="p-8 md:p-12 space-y-8 mt-20">
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              <span className="font-serif">{blog.title}</span>
            </h1>

            <div className="w-full border-t border-gray-400 mt-6 pt-6"></div>

            {blog.hashtags && blog.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.hashtags.map((hashtag, index) => {
                  const cleanTag = hashtag.startsWith("#")
                    ? hashtag.slice(1)
                    : hashtag;
                  return (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-gray-900 text-sm font-normal rounded-full"
                    >
                      #{cleanTag}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time>{publishedDate}</time>
              </span>
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{readingTime}</span>
              </span>
            </div>

            <div className="w-full border-t border-gray-400 mt-6 pt-6"></div>

            <article className="prose prose-lg prose-p:leading-relaxed max-w-none text-gray-700">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </article>

            {relatedBlogs.length > 0 && (
              <div className="border-t border-gray-400 pt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                  You might also like
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <BlogCard
                      key={relatedBlog.id}
                      id={relatedBlog.id}
                      title={relatedBlog.title}
                      coverImage={relatedBlog.coverImage}
                      hashtags={relatedBlog.hashtags}
                      createdAt={relatedBlog.createdAt}
                      updatedAt={relatedBlog.updatedAt}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: blog.content.replace(/<[^>]*>/g, "").substring(0, 160),
            datePublished: blog.createdAt,
            dateModified: blog.updatedAt,
            author: {
              "@type": "Organization",
              name: "Nirudhyog",
            },
            publisher: {
              "@type": "Organization",
              name: "Nirudhyog",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": typeof window !== "undefined" ? window.location.href : "",
            },
            image: blog.coverImage ? [blog.coverImage] : [],
            keywords: blog.hashtags ? blog.hashtags.join(", ") : "",
          }),
        }}
      />
    </section>
  );
}
