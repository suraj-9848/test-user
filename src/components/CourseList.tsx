"use client";

const courses = [
  {
    title: "Modern Art and Ideas",
    provider: "The Museum of Art",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO3nXC9nuGmnzNFA7MMlhu-csuBcyhXOfKIlF5wISu0MArMVKtSg6F-6KeBNhtT8LMTCDVcZdlvkLCb3lzv_Ahbd_pOfVZXf0afysKMpqlgWbHA3mSzRoZ5RAhuU22kBR07pPO2ZdIcWvvdgk2eo2NyPQIXCpC5D2y1m-T9opIXYbz96iHbawNc-v9qX-tw_E8QLVKeF3Rv7FGtmVVDSwpLKGNau16UrDJDSG4HpU7T7q8uUaQrpnOfbuIcxkBN0isVrJ1sW7HyWX4"
  },
  {
    title: "Fundamentals of Graphic Design",
    provider: "California Institute of the Arts",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfn7cHbE-xzuh6g8c7IamApFg7IMmpZqU60Z_en8ZX3y8s1QHLDjiYF7sw0aJtsP1cbiRpaGFZHFpXwKucqRbGyT4gYIS3jIaBjtgjOeAYBNIiBe01lVfjOFftvauClSJOqSuk7--_KnShe4iQ0mXqAuSjEqnS6mNw6UqqFBXCVb9XE60Li-XdfBL-Ok7BbfSIW6Oz8S9sTMzSVYcI3oyrpoCukOxXpyIG-WB7RrjZUljF3XfHN2kS7sgmzYesZcCjdHi2SKAbiJGU"
  },
  {
    title: "Graphic Design",
    provider: "California Institute of the Arts",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUElZTD9fu1AjXJjdDQHFeaD6lWblhWU62EfgyRU-ifQEanNK_PyVqhl7bvypRt1k0sNh4Jr9JwKa0q0PU59sxqeQ2KrIaY5yd3t7HDsiMmVir99A_8o1GeBMEJv9n18SHvtzB7frh8bd98THJJpK4-8XUSVeBspVfYZ93ynPPqeqX1jTtEeskh1vcEnr81LWEShd3qaOwGvZfYz0sbpPT6J_JvZQHlY2LRsUvJcSemowe8vdN4fYtter2oF_-uJJ0C8JxOF7PotjS"
  },
  {
    title: "UI / UX Design",
    provider: "California Institute of the Arts",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwoond5rz4uYucsKkFeazo5lRsy0KHuw6ey3bVZaM6emYDbnuh30ZCtw6Y0Sv0RsU9W3NQbaFtD9A7Q0syAkQCod1If2tp3DvtNXNT7h9k9-WtxGC_-S2iM3yQeGUlAZb1ei4QXjEzi7Gw8wh8W53NXtKsOdWZRg_WkqmrkYjbe2AThNWzZJCcCvkH9I2uhbaEOMRJ873S4za8XpHtQGkn3OtfW99MRBagNMoHdeexEcD-OoJSZ_UGaKTaMFgzZzTLmMT-PHBl2tMB"
  },
  {
    title: "Creative Writing",
    provider: "Wesleyan University",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq4IRvrbqlSdecMFHXXWIB-pZp49DGnmddHYYAneJOErC8Jvlb7NlmMm6i7F5xkIrC_U5XHT09bQv7R_R8dFVYoMXXXO_ErWx3f8ak8z12nQq0p2kD54_lydkHEwDdhN2ZQZw0TmLqCJqVWRucIxqqP7ER2RnkulLxzR6ZeORm64TCAqJPaXi52YpoAj59LXEYGJ9V5HZf3tMwBVgOmV7kEsWQ1ibOWiPQEVjQ18ZMTq-ej8lydzFOewyJ9VbZ-3jea5hoh09gtEme"
  },
  {
    title: "Fashion as Design",
    provider: "The Museum of Art",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaiMq8xV2LkixLaP8l2B7PMzfwzpw2uJsg-q1-KdRYGQVRyaRwJskZrN9j44Wi75YDu0UhVIdf3BhYwn3ywQ-6gFKB9lqCZggEUGegFNNMUfXyVaISAoX86CXKddX1M1-QHrkeKHA1k7HdEh1-dyX8gK8N_oiN4AmOpHywXobYqNimchWDqdV308JFvUJ1T2Y7YoPH4XIgsiB3e_3_PnZgNWVUHy55G2Xi0OhJd9zVqB8IZKPwD-mvjGQXuCgvXtNTuneuTJ1Fo2_f"
  }
]

const CourseList = () => (
  <div className="w-full lg:w-1/2 lg:pr-6 space-y-4 sm:space-y-6 mb-6 lg:mb-0">
    {courses.map(course => (
      <div key={course.title} className="flex items-center p-3 sm:p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 course-card">
        <img alt={course.title} className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover mr-3 sm:mr-4" src={course.img} />
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{course.title}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{course.provider}</p>
        </div>
      </div>
    ))}
  </div>
)

export default CourseList