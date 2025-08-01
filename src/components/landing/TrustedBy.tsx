"use client";

import React from "react";
import Image from "next/image";

// Define image data with public paths
const images: { src: string; isRaster: boolean }[] = [
  { src: "/images/companies/image 100.svg", isRaster: false },
  { src: "/images/companies/image 89.svg", isRaster: false },
  { src: "/images/companies/image 99.png", isRaster: true },
  { src: "/images/companies/image 98.svg", isRaster: false },
  { src: "/images/companies/image 97.svg", isRaster: false },
  { src: "/images/companies/image 96.svg", isRaster: false },
  { src: "/images/companies/image 95.png", isRaster: true },
  { src: "/images/companies/image 94.svg", isRaster: false },
  { src: "/images/companies/image 93.svg", isRaster: false },
  { src: "/images/companies/image 92.svg", isRaster: false },
  { src: "/images/companies/image 91.svg", isRaster: false },
  { src: "/images/companies/image 90.svg", isRaster: false },
];

const CollegesSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center px-4 py-10">
      <h2 className="text-center text-[24px] sm:text-[30px] md:text-[38px] font-medium mb-12 leading-tight">
        <span className="text-red-600 font-semibold">Trusted</span> by Leading
        Colleges
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 sm:gap-12 w-[95%] max-w-[1280px]">
        {images.map((img, i) => (
          <div
            key={i}
            className="w-[90px] sm:w-[110px] md:w-[130px] lg:w-[150px] mx-auto transition-transform duration-300 hover:scale-110"
          >
            <Image
              src={img.src}
              alt={`College ${i + 1}`}
              width={150}
              height={80}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollegesSection;
