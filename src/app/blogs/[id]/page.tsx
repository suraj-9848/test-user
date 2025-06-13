"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { dummyPosts } from "../../../../sample_data/blogs";
import BlogCard from "@/components/blogs/BlogCard";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

const Page = () => {
  const params = useParams();
  const postId = Number(params?.id);
  const post = dummyPosts.find((p) => p.id === postId);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => setImgLoaded(false), [postId]);

  const relatedRandom = useMemo(() => {
    if (!post) return [];
    const pool = dummyPosts.filter(
      (p) => p.tag === post.tag && p.id !== post.id
    );
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 2);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-br from-pink-300 via-purple-200 to-blue-200">
        <div className="text-6xl mb-4">📭</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Oops! This post went missing.
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We couldn’t find the blog you were looking for. It might have been
          moved or deleted.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-4 py-2 text-pink-600 hover:text-pink-800 font-medium transition duration-300 group"
        >
          <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-base">Back to Blogs</span>
        </Link>
      </div>
    );
  }

  return (
    <section className="relative isolate min-h-screen px-6 py-24 md:px-12 bg-pink-100 overflow-hidden">
      {/* big background blob */}
      <span className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full blur-3xl opacity-40 bg-gradient-to-b from-blue-300 via-purple-200 to-pink-300" />

      {/* floating accent blobs */}
      <span className="hidden lg:block absolute -z-10 right-10 top-1/3 w-72 h-72 rounded-full bg-purple-200/30 blur-3xl animate-pulse" />
      <span className="hidden lg:block absolute -z-10 -left-20 bottom-10 w-80 h-80 rounded-full bg-yellow-200/40 blur-3xl animate-pulse" />

      {/* glass wrapper with glow */}
      <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden animate-[slide-up_0.6s_ease-out]">
        <div className="absolute -inset-0.5 rounded-[inherit] bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 blur-lg opacity-50" />
        <div className="relative bg-white/70 backdrop-blur-xl shadow-lg rounded-[inherit]">
          {/* image cover */}
          <div className="relative h-72 sm:h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/70 via-yellow-100 to-purple-100" />
            {!imgLoaded && (
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            )}
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className={`object-cover transition-all duration-700 ${
                imgLoaded ? "opacity-100" : "opacity-0 blur-md scale-105"
              }`}
              onLoad={() => setImgLoaded(true)}
              priority={false}
            />
          </div>

          {/* text content */}
          <div className="p-8 md:p-12 space-y-8 bg-gradient-to-br from-white via-white to-blue-50/20">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
              {post.title}
            </h1>

            <div className="h-[2px] w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-[pulse_8s_linear_infinite]" />

            <div className="flex flex-wrap gap-2 text-sm font-medium text-gray-600">
              <span className="bg-pink-200 text-gray-800 px-3 py-1 rounded-full">
                {post.tag}
              </span>
              <time className="bg-pink-200 text-gray-800 px-3 py-1 rounded-full">
                {post.postedOn}
              </time>
            </div>

            <article className="prose prose-lg prose-p:leading-relaxed max-w-none text-gray-700">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                vitae sapien at quam gravida fringilla...
              </p>
              <p>
                Cras nec lorem purus. Proin ut felis ut elit malesuada tincidunt...
              </p>
              <blockquote>
                “Learning never exhausts the mind — it only gives it room to grow.”
              </blockquote>
              <p>
                Aliquam erat volutpat. Aenean ullamcorper libero in cursus...
              </p>
            </article>
          </div>
        </div>
      </div>

      {/* Continue Reading */}
      {relatedRandom.length > 0 && (
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
            Continue Reading
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {relatedRandom.map((p) => (
              <BlogCard
                key={p.id}
                id={p.id}
                imageUrl={p.imageUrl}
                tag={p.tag}
                postedOn={p.postedOn}
                title={p.title}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
