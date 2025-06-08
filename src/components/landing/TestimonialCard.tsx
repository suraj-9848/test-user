// components/TestimonialCard.tsx
"use client";

import Image from "next/image";
import { FC } from "react";
import { Testimonial } from "../../../types";

type TestimonialCardProps = Testimonial;

const TestimonialCard: FC<TestimonialCardProps> = ({
  logo,
  name,
  username,
  rating,
  color,
  college,
  experience,
}) => {
  return (
    <div className="group perspective">
      <div
        className={`transform transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-[1.02]  rounded-xl p-5 shadow-md border bg-white border-gray-200 max-w-sm w-full`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 relative">
            <Image
              src={logo}
              alt={`${college} logo`}
              fill
              className={`object-contain border-2 border-[${color}] rounded-full`}
            />
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 font-medium">
            {rating.toFixed(1)}{" "}
            <span className="text-green-500 text-lg">★</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4">“{experience}”</p>

        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-500">{username}</div>
        <div className="text-sm text-gray-600 italic mt-1">{college}</div>
      </div>
    </div>
  );
};

export default TestimonialCard;
