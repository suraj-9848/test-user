"use client";

import React, { useEffect, useRef, useState } from "react";
import CollegesSection from "./TrustedBy";

/* ──────────────── helpers ──────────────── */

const useInViewOnce = (threshold = 0.3) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (!ref.current || hasBeenInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenInView(true);
          observer.disconnect(); // stop observing - ensures it fires only once
        }
      },
      { threshold },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasBeenInView, threshold]);

  return { ref, hasBeenInView };
};

const useCountUp = (end: number, run: boolean, duration = 3) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!run) return;

    let current = 0;
    const inc = end / (duration * 60); // assume 60 fps
    let frame: number;

    const animate = () => {
      current += inc;
      if (current < end) {
        setCount(Math.floor(current));
        frame = requestAnimationFrame(animate);
      } else {
        setCount(end);
        cancelAnimationFrame(frame);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [run, end, duration]);

  return count.toLocaleString();
};

/* ──────────────── components ──────────────── */

interface StatItemProps {
  label: string;
  count: number;
}

const StatItem: React.FC<StatItemProps> = ({ label, count }) => {
  const { ref, hasBeenInView } = useInViewOnce();
  const animatedCount = useCountUp(count, hasBeenInView);

  return (
    <div
      ref={ref}
      className="flex flex-col md:flex-row items-center justify-center min-w-[150px] gap-2 mb-4"
    >
      <p className="text-red-600 font-semibold text-[22px] sm:text-[24px] md:text-[40px]">
        {label}
      </p>
      <p className="font-bold text-[26px] sm:text-[30px] md:text-[40px]">
        {animatedCount}+
      </p>
    </div>
  );
};

const CountSection: React.FC = () => (
  <section className="py-8 px-4 md:py-16 md:px-12">
    <h2 className="text-center text-[24px] sm:text-[30px] md:text-[36px] font-bold">
      Proving Potential, Placing Pride
    </h2>
    <p className="text-center text-[18px] sm:text-[22px] md:text-[26px] font-medium text-black/50 mt-2">
      Nirudyog graduates now building at
    </p>

    <div className="mt-8 md:mt-12 grid grid-cols-2 md:flex gap-4 md:justify-around items-center w-full md:w-4/5 mx-auto">
      <div className="col-span-2 md:col-auto">
        <StatItem label="Trained" count={17_000} />
      </div>
      <StatItem label="Placed" count={13_600} />
      <StatItem label="Companies" count={120} />
    </div>
    <CollegesSection />
  </section>
);

export default CountSection;
