"use client";

export default function OurMission() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-50 rounded-full opacity-30 blur-3xl -z-10"></div>
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-yellow-50 rounded-full opacity-30 blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-xl p-8 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Education</h3>
              <p className="text-gray-700">
                Provide industry-relevant, practical education that prepares students for the real challenges they'll face in their careers.
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-8 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bridge the Gap</h3>
              <p className="text-gray-700">
                Connect talented individuals with employment opportunities by fostering direct relationships with hiring partners across industries.
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-8 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                  <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Continuous Innovation</h3>
              <p className="text-gray-700">
                Constantly evolve our methods, curriculum, and platform to adapt to the changing needs of industries and emerging career paths.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-gray-50 rounded-xl p-8 shadow-md">
          <blockquote className="text-center italic text-xl text-gray-700">
            "Our mission is to transform lives by making quality education accessible and bridging the gap between learning and career success."
          </blockquote>
          <p className="text-center mt-4 font-semibold text-gray-900">— Nirudhyog Leadership</p>
        </div>
      </div>
    </section>
  );
}
