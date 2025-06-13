"use client";

import { useMemo, useState } from "react";
import BlogCard from "./BlogCard";
import { dummyPosts } from "../../../sample_data/blogs";
/* -------------  dummy data (one tag per card) ------------- */
const tags = [
  "#All",
  "#Alumnistories",
  "#Hiring",
  "#Updates",
  "#Announcements",
  "#Alerts",
] as const;


/* ---------------------  page component  -------------------- */
export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<(typeof tags)[number]>("#All");

  const filteredPosts = useMemo(
    () =>
      activeTag === "#All"
        ? dummyPosts
        : dummyPosts.filter((p) => p.tag === activeTag),
    [activeTag]
  );

  return (
    <section
      className="
        relative isolate overflow-hidden bg-pink-100
        pt-32 min-h-screen px-6 md:px-16 pb-24
      "
    >
      {/* pastel “blob” */}
      <span
        aria-hidden
        className="
          absolute -z-10 left-1/2 top-0 -translate-x-1/2 -translate-y-1/2
          w-[140vw] h-[140vw] rounded-full blur-3xl
          bg-gradient-to-b from-blue-300 via-purple-200 to-pink-400 opacity-40
        "
      />

      {/* heading + tag bar */}
      <div className="relative z-10 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-semibold font-sans text-gray-800">
          Updates, stories, and <br className="hidden md:block" />
          announcements from the Nirudhyog.
        </h1>

        <div className="flex flex-wrap gap-2 mt-6">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1 rounded-full text-md cursor-pointer border transition-all
                ${
                  activeTag === tag
                    ? "bg-pink-500 text-white border-pink-900"
                    : "bg-white text-gray-700 hover:bg-pink-200 border-gray-300"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* grid of cards */}
      <div className="relative z-10 w-full mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length
          ? filteredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))
          : /* show three blurred placeholders if no post for the tag */
            Array.from({ length: 3 }).map((_, i) => (
              <BlogCard key={i} isLoading />
            ))}
      </div>
    </section>
  );
}
