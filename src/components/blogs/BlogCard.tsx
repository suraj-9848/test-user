"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BlogCardProps {
  id?: string | number;
  imageUrl?: string;
  tag?: string;
  postedOn?: string; // e.g. '5 Jun'
  title?: string;
  isLoading?: boolean;
}

export default function BlogCard({
  id,
  imageUrl,
  tag,
  postedOn,
  title,
  isLoading = false,
}: BlogCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  // Safety check
  if (!isLoading && (!imageUrl || !tag || !postedOn || !title || !id)) {
    throw new Error("BlogCard requires full data when not loading");
  }

  /** ••• SKELETON ••• */
  if (isLoading) {
    return (
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden
                   bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100
                   animate-pulse"
      >
        <div className="h-56" />
        <div className="p-6 space-y-3">
          <div className="h-6 w-20 rounded-full bg-white/60" />
          <div className="h-6 w-5/6 rounded bg-white/60" />
          <div className="h-4 w-1/3 rounded bg-white/40" />
        </div>
      </div>
    );
  }

  /** ••• REAL CARD ••• */
  return (
    <Link
      href={`/blogs/${id}`}
      className="w-full max-w-md rounded-2xl overflow-hidden
                 shadow-md hover:shadow-lg transition-shadow bg-white"
    >
      {/* COVER */}
      <div className="relative h-56">
        <div
          className="absolute inset-0
                     bg-gradient-to-br from-pink-300/80 via-pink-200/70 to-yellow-200/60"
        />
        <Image
          src={imageUrl!}
          alt={title!}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className={`object-cover transition-all duration-700
                      ${imgLoaded ? "opacity-100" : "opacity-0 blur-md scale-105"}`}
          onLoad={() => setImgLoaded(true)}
          priority={false}
        />
      </div>

      {/* META + TITLE */}
      <div className="p-6 space-y-4 bg-gradient-to-br from-white via-white to-blue-50/30">
        <div className="flex items-center justify-between text-sm">
          <span className="px-3 py-1 rounded-full bg-pink-200 text-gray-800">
            {tag}
          </span>
          <time className="text-gray-500">{postedOn}</time>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
    </Link>
  );
}
