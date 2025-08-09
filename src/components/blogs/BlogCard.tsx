"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BlogCardProps {
  id?: string;
  title?: string;
  coverImage?: string;
  hashtags?: string[];
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  isLoading?: boolean;
}

const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Unknown";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "Unknown";
  }
};

const getFirstTag = (hashtags: string[] = []) => {
  if (!hashtags.length) return "Article";
  const tag = hashtags[0];
  return tag.startsWith("#") ? tag.slice(1) : tag;
};

export default function BlogCard({
  id,
  title,
  coverImage,
  hashtags,
  author,
  createdAt,
  updatedAt,
  isLoading = false,
}: BlogCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!isLoading && (!title || !id)) return null;

  /** ••• SKELETON ••• */
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 animate-pulse w-full max-w-sm">
        <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300" />
        <div className="p-4 space-y-3">
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-slate-200 rounded-full" />
            <div className="h-3 bg-slate-200 rounded w-20" />
          </div>
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <div className="h-2.5 bg-slate-200 rounded w-12" />
              <div className="h-2.5 bg-slate-200 rounded w-24" />
            </div>
            <div className="flex justify-between">
              <div className="h-2.5 bg-slate-200 rounded w-12" />
              <div className="h-2.5 bg-slate-200 rounded w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tag = getFirstTag(hashtags);
  const createdDate = createdAt ? formatDateTime(createdAt) : "Unknown";
  const modifiedDate = updatedAt ? formatDateTime(updatedAt) : "Unknown";

  /** ••• REAL CARD ••• */
  return (
    <Link href={`/blogs/${id}`} className="group block w-full max-w-sm">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200 transition-all duration-300 group-hover:scale-[1.02]">
        {/* COVER IMAGE */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          {coverImage && !imgError ? (
            <>
              <Image
                src={coverImage}
                alt={title || "Blog post cover"}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className={`object-cover transition-transform duration-500 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                priority={false}
              />
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
              )}
            </>
          ) : (
            <div className="h-full bg-gradient-to-br from-amber-50 via-lime-50 to-emerald-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-white rounded-xl flex items-center justify-center shadow-md border border-lime-200">
                  <svg
                    className="w-8 h-8 text-lime-700"
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
                <p className="text-sm font-normal text-lime-700">{tag}</p>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="p-5">
          {/* Category Tag */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1.5 text-xs font-normal text-gray-800 bg-gray-100 rounded-full border border-gray-300">
              {tag}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-normal text-gray-900 mb-3 group-hover:font-semibold transition-all duration-200 line-clamp-2 leading-tight">
            {title}
          </h3>

          {/* Author */}
          {author && (
            <div className="mb-5 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-2.5 shadow-sm">
                <span className="text-white text-xs font-normal">
                  {author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-normal text-gray-900 text-sm">
                  {author}
                </span>
                <p className="text-gray-500 text-xs">Author</p>
              </div>
            </div>
          )}

          {/* Dates Section */}
          <div className="space-y-2 text-xs border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-normal">Created:</span>
              <span className="font-normal text-gray-800">{createdDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-normal">Updated:</span>
              <span className="font-normal text-gray-800">{modifiedDate}</span>
            </div>
          </div>

          {/* Read More Indicator */}
          <div className="mt-4 flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors duration-200">
            <span className="text-xs">Read more</span>
            <svg
              className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
