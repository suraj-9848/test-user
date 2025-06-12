"use client";

import Link from "next/link";

export default function OurValues() {
  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our curriculum to our student support.",
      color: "blue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Innovation",
      description: "We embrace innovation and continuously evolve our methods to stay ahead in a rapidly changing world.",
      color: "purple",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2 13h-4v-1h4v1zm0-2h-4v-1h4v1zm-1-7H9.5C9.22 6 9 6.22 9 6.5S9.22 7 9.5 7h3c.28 0 .5-.22.5-.5S13.28 6 13 6z"/>
        </svg>
      ),
    },
    {
      title: "Integrity",
      description: "We operate with transparency, honesty, and ethical standards in all our interactions.",
      color: "green",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Community",
      description: "We foster a supportive community where collaboration and mutual growth are encouraged.",
      color: "yellow",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      ),
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'from-blue-50 to-blue-100',
          icon: 'from-blue-600 to-blue-700',
          border: 'border-blue-200',
          decorative: 'bg-blue-200'
        };
      case 'purple':
        return {
          bg: 'from-purple-50 to-purple-100',
          icon: 'from-purple-600 to-purple-700',
          border: 'border-purple-200',
          decorative: 'bg-purple-200'
        };
      case 'green':
        return {
          bg: 'from-green-50 to-green-100',
          icon: 'from-green-600 to-green-700',
          border: 'border-green-200',
          decorative: 'bg-green-200'
        };
      case 'yellow':
        return {
          bg: 'from-yellow-50 to-yellow-100',
          icon: 'from-yellow-500 to-yellow-600',
          border: 'border-yellow-200',
          decorative: 'bg-yellow-200'
        };
      default:
        return {
          bg: 'from-gray-50 to-gray-100',
          icon: 'from-gray-600 to-gray-700',
          border: 'border-gray-200',
          decorative: 'bg-gray-200'
        };
    }
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Large decorative circles like AboutHero */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-purple-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-yellow-100 rounded-full opacity-30"></div>
        <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-green-100 rounded-full opacity-40"></div>
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-base font-semibold tracking-wider text-blue-600 uppercase mb-4">
            Foundation
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Core Values
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700">
            These principles guide everything we do and shape our approach to education and career development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => {
            const colorClasses = getColorClasses(value.color);
            return (
              <div 
                key={index} 
                className={`relative bg-gradient-to-br ${colorClasses.bg} rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${colorClasses.border} overflow-hidden`}
              >
                {/* Decorative circles */}
                <div className={`absolute -top-4 -right-4 w-20 h-20 ${colorClasses.decorative} rounded-full opacity-50`}></div>
                <div className={`absolute -bottom-4 -left-4 w-16 h-16 ${colorClasses.decorative} rounded-full opacity-30`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses.icon} rounded-full flex items-center justify-center shadow-lg`}>
                        {value.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Enhanced Call-to-Action Section */}
        <div className="relative">
          {/* Decorative elements around CTA */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 rounded-full opacity-50"></div>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-10 shadow-lg relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Be Part of Our Community?</h3>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of students and professionals who share our values and are building successful careers together.
                </p>
              </div>
              
              <Link href="https://chat.whatsapp.com/KuaphYb8hwiITWbp1bNtpo" target="_blank" rel="noopener noreferrer">
                <div className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                  Join Our Community
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
