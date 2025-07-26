import Link from "next/link";
import React from "react";
import { alumni } from "../../../sample_data";
import { UsersRound } from "lucide-react";

/* ─────────────────────────  Card  ───────────────────────── */
const AlumniCard = ({
  name,
  company,
  message,
  index,
}: {
  name: string;
  company: string;
  message: string;
  index: number;
}) => (
  <div
    className={`bg-[#1D1616] border text-white hover:text-black hover:bg-[#FFFDF0] hover:scale-105 duration-300 ease-in  border-gray-700/70 rounded-xl p-4 shadow-sm
    transform transition
    ${index % 2 === 0 ? " sm:-translate-y-4" : "sm:translate-y-4"}`}
  >
    <div className="flex flex-col gap-2 min-h-[140px]">
      <UsersRound className="bg-white text-black rounded-full p-1 w-8 h-8" />

      <h3 className=" font-semibold">{name}</h3>
      <h5 className="text-sm">{company}</h5>

      <p className="text-sm line-clamp-5 min-h-[4.5rem]">
        {message || "No message provided."}
      </p>
    </div>
  </div>
);

/* ────────────────────────  Section  ─────────────────────── */
export default function AlumniSection() {
  return (
    <section className="min-h-screen bg-[#FEF3E2] text-[#075B5E] px-6 py-16 flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Copy & CTA */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-light leading-tight">
            Our alumni cracked the code to <br />
            top tech careers
            <br />
            <span className="italic font-semibold text-black">
              from Microsoft to Google
            </span>
          </h1>

          <p className="text-gray-700 max-w-md">
            Learners from Nirudhyog have landed roles at world-class companies
            like{" "}
            <strong className="text-[#1A1A1D]">Microsoft, Amazon, Uber</strong>{" "}
            and <strong className="text-[#1A1A1D]">Google</strong>. Their
            journeys prove what the right mentorship, structure, and dedication
            can achieve.
          </p>
        </div>

        {/* Right — Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {alumni.map((person, idx) => (
            <AlumniCard
              key={idx}
              name={person.name}
              company={person.company}
              message={person.message}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
