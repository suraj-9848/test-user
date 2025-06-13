"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";

// image imports
import image1 from "../../../public/images/companies/image 100.svg";
import image2 from "../../../public/images/companies/image 89.svg";
import image3 from "../../../public/images/companies/image 99.png";
import image4 from "../../../public/images/companies/image 98.svg";
import image5 from "../../../public/images/companies/image 97.svg";
import image6 from "../../../public/images/companies/image 96.svg";
import image7 from "../../../public/images/companies/image 95.png";
import image8 from "../../../public/images/companies/image 94.svg";
import image9 from "../../../public/images/companies/image 93.svg";
import image10 from "../../../public/images/companies/image 92.svg";
import image11 from "../../../public/images/companies/image 91.svg";
import image12 from "../../../public/images/companies/image 90.svg";

// Type helps distinguish raster from SVG
const images: { src: StaticImageData; isRaster: boolean }[] = [
  { src: image1, isRaster: false },
  { src: image2, isRaster: false },
  { src: image3, isRaster: true },
  { src: image4, isRaster: false },
  { src: image5, isRaster: false },
  { src: image6, isRaster: false },
  { src: image7, isRaster: true },
  { src: image8, isRaster: false },
  { src: image9, isRaster: false },
  { src: image10, isRaster: false },
  { src: image11, isRaster: false },
  { src: image12, isRaster: false },
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
              className="w-full h-auto object-contain"
              {...(img.isRaster ? { placeholder: "blur" } : {})}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollegesSection;
