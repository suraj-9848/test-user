import React from 'react'

const paths = [
  {
    title: "Become a Graphic Designer",
    desc: "Master the art of visual communication with courses from California Institute of the Arts.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfn7cHbE-xzuh6g8c7IamApFg7IMmpZqU60Z_en8ZX3y8s1QHLDjiYF7sw0aJtsP1cbiRpaGFZHFpXwKucqRbGyT4gYIS3jIaBjtgjOeAYBNIiBe01lVfjOFftvauClSJOqSuk7--_KnShe4iQ0mXqAuSjEqnS6mNw6UqqFBXCVb9XE60Li-XdfBL-Ok7BbfSIW6Oz8S9sTMzSVYcI3oyrpoCukOxXpyIG-WB7RrjZUljF3XfHN2kS7sgmzYesZcCjdHi2SKAbiJGU",
    meta: "4 courses • 6 months"
  },
  {
    title: "Master UI/UX Design",
    desc: "Create user-centered designs with expert-led courses from top institutions.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwoond5rz4uYucsKkFeazo5lRsy0KHuw6ey3bVZaM6emYDbnuh30ZCtw6Y0Sv0RsU9W3NQbaFtD9A7Q0syAkQCod1If2tp3DvtNXNT7h9k9-WtxGC_-S2iM3yQeGUlAZb1ei4QXjEzi7Gw8wh8W53NXtKsOdWZRg_WkqmrkYjbe2AThNWzZJCcCvkH9I2uhbaEOMRJ873S4za8XpHtQGkn3OtfW99MRBagNMoHdeexEcD-OoJSZ_UGaKTaMFgzZzTLmMT-PHBl2tMB",
    meta: "5 courses • 8 months"
  },
  {
    title: "Become a Creative Writer",
    desc: "Hone your storytelling skills with Wesleyan University's expert instructors.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq4IRvrbqlSdecMFHXXWIB-pZp49DGnmddHYYAneJOErC8Jvlb7NlmMm6i7F5xkIrC_U5XHT09bQv7R_R8dFVYoMXXXO_ErWx3f8ak8z12nQq0p2kD54_lydkHEwDdhN2ZQZw0TmLqCJqVWRucIxqqP7ER2RnkulLxzR6ZeORm64TCAqJPaXi52YpoAj59LXEYGJ9V5HZf3tMwBVgOmV7kEsWQ1ibOWiPQEVjQ18ZMTq-ej8lydzFOewyJ9VbZ-3jea5hoh09gtEme",
    meta: "3 courses • 4 months"
  },
  {
    title: "Explore Art History",
    desc: "Dive into the world of art with courses from The Museum of Art.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO3nXC9nuGmnzNFA7MMlhu-csuBcyhXOfKIlF5wISu0MArMVKtSg6F-6KeBNhtT8LMTCDVcZdlvkLCb3lzv_Ahbd_pOfVZXf0afysKMpqlgWbHA3mSzRoZ5RAhuU22kBR07pPO2ZdIcWvvdgk2eo2NyPQIXCpC5D2y1m-T9opIXYbz96iHbawNc-v9qX-tw_E8QLVKeF3Rv7FGtmVVDSwpLKGNau16UrDJDSG4HpU7T7q8uUaQrpnOfbuIcxkBN0isVrJ1sW7HyWX4",
    meta: "4 courses • 5 months"
  }
]

const LearningPathsSection = () => (
  <section className="p-4 sm:p-6 md:p-10 bg-gray-50">
    <div className="container mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 text-center">Discover Your Learning Path</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {paths.map(path => (
          <a className="block group" href="#" key={path.title}>
            <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 path-card">
              <img alt={path.title} className="w-full h-32 sm:h-48 object-cover transform group-hover:scale-105 transition-transform duration-300" src={path.img} />
              <div className="p-3 sm:p-4 bg-white">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{path.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{path.desc}</p>
                <p className="text-xs text-blue-600 mt-1 sm:mt-2">{path.meta}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="text-center mt-6 sm:mt-10">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
          View All Learning Paths
        </button>
      </div>
    </div>
  </section>
)

export default LearningPathsSection