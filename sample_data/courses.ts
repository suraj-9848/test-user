import { Course } from "../types";


export const courses: Course[] = [
  {
    id: "course-1",
    title: "Data Structures & Algorithms",
    slug: "data-structures-algorithms",
    description:
      "Master the fundamentals of data structures and algorithms to ace technical interviews and build efficient software.",
    category: "Computer Science",
    level: "Intermediate",
    language: "English",
    duration: "8 weeks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO3nXC9nuGmnzNFA7MMlhu-csuBcyhXOfKIlF5wISu0MArMVKtSg6F-6KeBNhtT8LMTCDVcZdlvkLCb3lzv_Ahbd_pOfVZXf0afysKMpqlgWbHA3mSzRoZ5RAhuU22kBR07pPO2ZdIcWvvdgk2eo2NyPQIXCpC5D2y1m-T9opIXYbz96iHbawNc-v9qX-tw_E8QLVKeF3Rv7FGtmVVDSwpLKGNau16UrDJDSG4HpU7T7q8uUaQrpnOfbuIcxkBN0isVrJ1sW7HyWX4",
    instructor: {
      name: "Dr. Anil Kumar",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq4IRvrbqlSdecMFHXXWIB-pZp49DGnmddHYYAneJOErC8Jvlb7NlmMm6i7F5xkIrC_U5XHT09bQv7R_R8dFVYoMXXXO_ErWx3f8ak8z12nQq0p2kD54_lydkHEwDdhN2ZQZw0TmLqCJqVWRucIxqqP7ER2RnkulLxzR6ZeORm64TCAqJPaXi52YpoAj59LXEYGJ9V5HZf3tMwBVgOmV7kEsWQ1ibOWiPQEVjQ18ZMTq-ej8lydzFOewyJ9VbZ-3jea5hoh09gtEme",
      bio: "PhD in Computer Science, 10+ years teaching experience, ex-Google engineer.",
    },
    rating: 4.8,
    reviews: 120,
    tags: ["DSA", "Coding", "Interview Prep", "Algorithms"],
    syllabus: [
      {
        module: "Introduction",
        topics: [
          "Course Overview",
          "Why Data Structures?",
          "Algorithm Analysis Basics",
        ],
      },
      {
        module: "Arrays & Strings",
        topics: [
          "Array Operations",
          "String Manipulation",
          "Two Pointer Technique",
        ],
      },
      {
        module: "Linked Lists",
        topics: [
          "Singly Linked List",
          "Doubly Linked List",
          "Linked List Problems",
        ],
      },
      {
        module: "Stacks & Queues",
        topics: [
          "Stack Implementation",
          "Queue Implementation",
          "Applications",
        ],
      },
      {
        module: "Trees & Graphs",
        topics: [
          "Binary Trees",
          "Tree Traversals",
          "Graph Representations",
          "BFS & DFS",
        ],
      },
      {
        module: "Sorting & Searching",
        topics: [
          "Bubble, Merge, Quick Sort",
          "Binary Search",
          "Sorting Problems",
        ],
      },
      {
        module: "Dynamic Programming",
        topics: ["DP Basics", "Memoization", "Classic DP Problems"],
      },
      {
        module: "Interview Preparation",
        topics: [
          "Mock Interviews",
          "Problem Solving Strategies",
          "Resume Tips",
        ],
      },
    ],
    prerequisites: [
      "Basic programming knowledge (any language)",
      "Logical reasoning skills",
    ],
    outcomes: [
      "Understand and implement core data structures",
      "Analyze algorithm complexity",
      "Solve common coding interview problems",
      "Build a strong foundation for advanced CS topics",
    ],
    price: 0,
    isFree: true,
    enrollmentCount: 350,
    lastUpdated: "2024-06-01",
  },
  {
    id: "course-2",
    title: "Fundamentals of Graphic Design",
    slug: "fundamentals-graphic-design",
    description:
      "Learn the basics of graphic design, including typography, color theory, and composition, to create visually stunning projects.",
    category: "Arts & Humanities",
    level: "Beginner",
    language: "English",
    duration: "6 weeks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfn7cHbE-xzuh6g8c7IamApFg7IMmpZqU60Z_en8ZX3y8s1QHLDjiYF7sw0aJtsP1cbiRpaGFZHFpXwKucqRbGyT4gYIS3jIaBjtgjOeAYBNIiBe01lVfjOFftvauClSJOqSuk7--_KnShe4iQ0mXqAuSjEqnS6mNw6UqqFBXCVb9XE60Li-XdfBL-Ok7BbfSIW6Oz8S9sTMzSVYcI3oyrpoCukOxXpyIG-WB7RrjZUljF3XfHN2kS7sgmzYesZcCjdHi2SKAbiJGU",
    instructor: {
      name: "Prof. Lisa Brown",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaiMq8xV2LkixLaP8l2B7PMzfwzpw2uJsg-q1-KdRYGQVRyaRwJskZrN9j44Wi75YDu0UhVIdf3BhYwn3ywQ-6gFKB9lqCZggEUGegFNNMUfXyVaISAoX86CXKddX1M1-QHrkeKHA1k7HdEh1-dyX8gK8N_oiN4AmOpHywXobYqNimchWDqdV308JFvUJ1T2Y7YoPH4XIgsiB3e_3_PnZgNWVUHy55G2Xi0OhJd9zVqB8IZKPwD-mvjGQXuCgvXtNTuneuTJ1Fo2_f",
      bio: "Award-winning designer and educator with 15+ years of experience.",
    },
    rating: 4.7,
    reviews: 98,
    tags: ["Design", "Creativity", "Typography", "Color Theory"],
    syllabus: [
      {
        module: "Introduction to Graphic Design",
        topics: [
          "What is Graphic Design?",
          "History of Design",
          "Design Principles",
        ],
      },
      {
        module: "Typography",
        topics: [
          "Typefaces & Fonts",
          "Hierarchy",
          "Readability",
        ],
      },
      {
        module: "Color Theory",
        topics: [
          "Color Wheel",
          "Color Harmony",
          "Using Color in Design",
        ],
      },
      {
        module: "Layout & Composition",
        topics: [
          "Balance & Alignment",
          "White Space",
          "Visual Hierarchy",
        ],
      },
      {
        module: "Practical Projects",
        topics: [
          "Poster Design",
          "Logo Creation",
          "Portfolio Building",
        ],
      },
    ],
    prerequisites: [],
    outcomes: [
      "Understand design principles",
      "Create basic graphic design projects",
      "Build a beginner portfolio",
    ],
    price: 0,
    isFree: true,
    enrollmentCount: 210,
    lastUpdated: "2024-05-15",
  },
  {
    id: "course-3",
    title: "UI / UX Design",
    slug: "ui-ux-design",
    description:
      "Master the essentials of user interface and user experience design to create intuitive and engaging digital products.",
    category: "Information Technology",
    level: "Intermediate",
    language: "English",
    duration: "10 weeks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwoond5rz4uYucsKkFeazo5lRsy0KHuw6ey3bVZaM6emYDbnuh30ZCtw6Y0Sv0RsU9W3NQbaFtD9A7Q0syAkQCod1If2tp3DvtNXNT7h9k9-WtxGC_-S2iM3yQeGUlAZb1ei4QXjEzi7Gw8wh8W53NXtKsOdWZRg_WkqmrkYjbe2AThNWzZJCcCvkH9I2uhbaEOMRJ873S4za8XpHtQGkn3OtfW99MRBagNMoHdeexEcD-OoJSZ_UGaKTaMFgzZzTLmMT-PHBl2tMB",
    instructor: {
      name: "Ms. Priya Sharma",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUElZTD9fu1AjXJjdDQHFeaD6lWblhWU62EfgyRU-ifQEanNK_PyVqhl7bvypRt1k0sNh4Jr9JwKa0q0PU59sxqeQ2KrIaY5yd3t7HDsiMmVir99A_8o1GeBMEJv9n18SHvtzB7frh8bd98THJJpK4-8XUSVeBspVfYZ93ynPPqeqX1jTtEeskh1vcEnr81LWEShd3qaOwGvZfYz0sbpPT6J_JvZQHlY2LRsUvJcSemowe8vdN4fYtter2oF_-uJJ0C8JxOF7PotjS",
      bio: "UX specialist, speaker, and mentor with a passion for digital products.",
    },
    rating: 4.9,
    reviews: 150,
    tags: ["UI", "UX", "Design", "Prototyping"],
    syllabus: [
      {
        module: "UI/UX Fundamentals",
        topics: [
          "What is UI/UX?",
          "Design Thinking",
          "User Research",
        ],
      },
      {
        module: "Wireframing & Prototyping",
        topics: [
          "Wireframe Tools",
          "Low/High Fidelity Prototypes",
          "User Testing",
        ],
      },
      {
        module: "Visual Design",
        topics: [
          "Color & Typography",
          "Layout Principles",
          "Accessibility",
        ],
      },
      {
        module: "Interaction Design",
        topics: [
          "Microinteractions",
          "Animation",
          "Responsive Design",
        ],
      },
      {
        module: "Portfolio Project",
        topics: [
          "Case Study Creation",
          "Presenting Your Work",
        ],
      },
    ],
    prerequisites: ["Basic graphic design knowledge"],
    outcomes: [
      "Design user-friendly interfaces",
      "Conduct user research and testing",
      "Build a UI/UX portfolio",
    ],
    price: 49,
    isFree: false,
    enrollmentCount: 180,
    lastUpdated: "2024-05-20",
  },
  {
    id: "course-4",
    title: "Creative Writing",
    slug: "creative-writing",
    description:
      "Unlock your creativity and learn the art of storytelling, poetry, and narrative writing with expert guidance.",
    category: "Personal Development",
    level: "Beginner",
    language: "English",
    duration: "5 weeks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq4IRvrbqlSdecMFHXXWIB-pZp49DGnmddHYYAneJOErC8Jvlb7NlmMm6i7F5xkIrC_U5XHT09bQv7R_R8dFVYoMXXXO_ErWx3f8ak8z12nQq0p2kD54_lydkHEwDdhN2ZQZw0TmLqCJqVWRucIxqqP7ER2RnkulLxzR6ZeORm64TCAqJPaXi52YpoAj59LXEYGJ9V5HZf3tMwBVgOmV7kEsWQ1ibOWiPQEVjQ18ZMTq-ej8lydzFOewyJ9VbZ-3jea5hoh09gtEme",
    instructor: {
      name: "Mr. John Smith",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaiMq8xV2LkixLaP8l2B7PMzfwzpw2uJsg-q1-KdRYGQVRyaRwJskZrN9j44Wi75YDu0UhVIdf3BhYwn3ywQ-6gFKB9lqCZggEUGegFNNMUfXyVaISAoX86CXKddX1M1-QHrkeKHA1k7HdEh1-dyX8gK8N_oiN4AmOpHywXobYqNimchWDqdV308JFvUJ1T2Y7YoPH4XIgsiB3e_3_PnZgNWVUHy55G2Xi0OhJd9zVqB8IZKPwD-mvjGQXuCgvXtNTuneuTJ1Fo2_f",
      bio: "Published author and creative writing coach.",
    },
    rating: 4.6,
    reviews: 75,
    tags: ["Writing", "Storytelling", "Poetry", "Creativity"],
    syllabus: [
      {
        module: "Introduction to Creative Writing",
        topics: [
          "What is Creative Writing?",
          "Genres of Writing",
          "Finding Inspiration",
        ],
      },
      {
        module: "Storytelling",
        topics: [
          "Plot Structure",
          "Character Development",
          "Dialogue",
        ],
      },
      {
        module: "Poetry",
        topics: [
          "Forms of Poetry",
          "Imagery & Metaphor",
          "Writing Your First Poem",
        ],
      },
      {
        module: "Editing & Publishing",
        topics: [
          "Self-Editing Techniques",
          "Getting Published",
          "Building a Writing Routine",
        ],
      },
    ],
    prerequisites: [],
    outcomes: [
      "Write compelling stories and poems",
      "Edit and improve your writing",
      "Understand the publishing process",
    ],
    price: 0,
    isFree: true,
    enrollmentCount: 95,
    lastUpdated: "2024-04-30",
  },
  {
    id: "course-5",
    title: "Fashion as Design",
    slug: "fashion-as-design",
    description:
      "Explore the history, culture, and business of fashion design with insights from top designers and museums.",
    category: "Arts & Humanities",
    level: "Beginner",
    language: "English",
    duration: "7 weeks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaiMq8xV2LkixLaP8l2B7PMzfwzpw2uJsg-q1-KdRYGQVRyaRwJskZrN9j44Wi75YDu0UhVIdf3BhYwn3ywQ-6gFKB9lqCZggEUGegFNNMUfXyVaISAoX86CXKddX1M1-QHrkeKHA1k7HdEh1-dyX8gK8N_oiN4AmOpHywXobYqNimchWDqdV308JFvUJ1T2Y7YoPH4XIgsiB3e_3_PnZgNWVUHy55G2Xi0OhJd9zVqB8IZKPwD-mvjGQXuCgvXtNTuneuTJ1Fo2_f",
    instructor: {
      name: "Ms. Emily Chen",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO3nXC9nuGmnzNFA7MMlhu-csuBcyhXOfKIlF5wISu0MArMVKtSg6F-6KeBNhtT8LMTCDVcZdlvkLCb3lzv_Ahbd_pOfVZXf0afysKMpqlgWbHA3mSzRoZ5RAhuU22kBR07pPO2ZdIcWvvdgk2eo2NyPQIXCpC5D2y1m-T9opIXYbz96iHbawNc-v9qX-tw_E8QLVKeF3Rv7FGtmVVDSwpLKGNau16UrDJDSG4HpU7T7q8uUaQrpnOfbuIcxkBN0isVrJ1sW7HyWX4",
      bio: "Fashion historian and curator at The Museum of Art.",
    },
    rating: 4.5,
    reviews: 60,
    tags: ["Fashion", "Design", "Culture", "History"],
    syllabus: [
      {
        module: "Fashion History",
        topics: [
          "Origins of Fashion",
          "Fashion Icons",
          "Cultural Impact",
        ],
      },
      {
        module: "Design Process",
        topics: [
          "Sketching",
          "Material Selection",
          "From Concept to Runway",
        ],
      },
      {
        module: "Fashion Business",
        topics: [
          "Branding",
          "Marketing",
          "Sustainability",
        ],
      },
      {
        module: "Final Project",
        topics: [
          "Design Your Own Collection",
          "Portfolio Review",
        ],
      },
    ],
    prerequisites: [],
    outcomes: [
      "Understand fashion history and culture",
      "Design basic fashion pieces",
      "Build a fashion portfolio",
    ],
    price: 0,
    isFree: true,
    enrollmentCount: 80,
    lastUpdated: "2024-05-10",
  },
];