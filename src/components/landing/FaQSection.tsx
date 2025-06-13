"use client";
import { useState } from "react";
import { faqs } from "../../../sample_data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#FAFAFA] text-black py-20 px-8 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-500 text-lg">
          Everything you need to know about navigating and using our learning
          platform.
        </p>

        <div className="mt-6 space-y-4 text-gray-600 text-md leading-relaxed">
          <p>
            Our LMS is designed to help students, instructors, and
            administrators easily manage and participate in online learning
            experiences. Whether you&#39;re enrolling in your first course or
            managing a full curriculum, we&#39;ve got you covered.
          </p>
          <p>
            Browse through common questions on course access, technical issues,
            account management, and certification. If your question isn&#39;t
            listed, feel free to reach out.
          </p>
        </div>

        <div className="mt-4">
          <a
            href="mailto:contact@nirudhrog.com"
            className="inline-block text-black underline hover:text-blue-600 transition-colors text-lg font-medium"
          >
            📧 Contact support
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-black pb-4 transition-all duration-300 ease-in-out"
          >
            <button
              className="w-full flex justify-between items-center text-left focus:outline-none group"
              onClick={() => toggle(index)}
            >
              <span className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                {faq.question}
              </span>
              <span className="text-2xl text-gray-600 group-hover:text-blue-600 transition-colors">
                {openIndex === index ? "×" : "+"}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index
                  ? "max-h-96 opacity-100 mt-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-600 text-md leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
