"use client";

const categories = [
  "Arts & Humanities",
  "Business",
  "Computer Science",
  "Data Science",
  "Information Technology",
  "Health",
  "Math & Logic",
  "Personal Development"
]

const CourseSidebar = () => (
  <aside className="w-full md:w-1/3 lg:w-1/4 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-gray-200">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Explore</h2>
    <nav className="space-y-2 sm:space-y-3">
      {categories.map(cat => (
        <a
          key={cat}
          className="block py-1.5 sm:py-2 px-2 sm:px-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-150 text-sm sm:text-base"
          href="#"
        >
          {cat}
        </a>
      ))}
      <a className="block py-1.5 sm:py-2 px-2 sm:px-3 active-link mt-2 sm:mt-4" href="#">Explore All</a>
    </nav>
    <div className="mt-6 sm:mt-10 p-4 sm:p-5 bg-purple-50 rounded-xl relative overflow-hidden">
      <img
        alt="Abstract circles and shapes for design course"
        className="absolute -bottom-8 -left-8 w-20 sm:w-32 h-20 sm:h-32 opacity-30 transform rotate-12"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNVvdtcU32KGTEY5HIyQz4z7WB_wTBKP0f149Yu7Oo0aeKCNKz-EH_XdW4LCFDI8gMGMX-8H8qTAtiuxS-bKH46WK3Sdqov1hGSrB3w5FbFeP5nsSsXkwL6sRjlOjrsFldOjgpU_Wnw2RgUeie9IMw7QOcR2BLZ07v8-_Rl0aZReLti147CQ9o9ZBQicnMcOEggJiQ3Ab0qhQ3GtMvZUCMijJwTJRT_q5MzyM7ZMSCIeYiUZP2mzccFsZPsKPcUXoVwtlWnuKVz9i_"
      />
      <h3 className="text-base sm:text-lg font-semibold text-purple-700 mb-1 sm:mb-2 relative z-10">Fundamentals of graphic design</h3>
      <button className="bg-purple-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-700 transition duration-150 relative z-10">
        Learn More
      </button>
    </div>
  </aside>
)

export default CourseSidebar