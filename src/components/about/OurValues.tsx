"use client";

import Link from "next/link";

export default function OurValues() {
  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our curriculum to our student support.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-600">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Innovation",
      description: "We embrace innovation and continuously evolve our methods to stay ahead in a rapidly changing world.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-600">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2 13h-4v-1h4v1zm0-2h-4v-1h4v1zm-1-7H9.5C9.22 6 9 6.22 9 6.5S9.22 7 9.5 7h3c.28 0 .5-.22.5-.5S13.28 6 13 6z"/>
        </svg>
      ),
    },
    {
      title: "Integrity",
      description: "We operate with transparency, honesty, and ethical standards in all our interactions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-600">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Community",
      description: "We foster a supportive community where collaboration and mutual growth are encouraged.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-600">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-0 w-72 h-72 bg-yellow-100/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Core Values
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700 mt-4">
            These principles guide everything we do and shape our approach to education and career development.
          </p>
        </div>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-0 w-24 h-24 bg-blue-100 rounded-full opacity-50 -translate-x-1/2"></div>
          <div className="absolute bottom-1/4 right-0 w-32 h-32 bg-yellow-100 rounded-full opacity-50 translate-x-1/2"></div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="relative bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-5">
                    <div className="p-3 bg-blue-50 rounded-full">
                      {value.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link href="https://chat.whatsapp.com/KuaphYb8hwiITWbp1bNtpo" target="_blank" rel="noopener noreferrer">
            <div className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 cursor-pointer">
              Join Our Community
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
