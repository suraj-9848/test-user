// sample_data/courses.ts
import { Course } from "../types/index";

export const courses: Course[] = [
  {
    id: "1",
    uuid: "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
    overview: `FSRNL-Live is an intensive, 6-week practical training program for job-ready full stack development using the MERN stack. Build and deploy a real e-commerce app, guided by expert instructors.`,
    trainer: {
      name: "Rajesh Kumar",
      bio: `Senior MERN Stack Developer, 12+ years experience, 2000+ students mentored. Expert in project-based learning and production-ready apps.`,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      linkedin: "https://www.linkedin.com/in/rajeshkumar-dev/",
    },
    title: "Full Stack Web Development with MERN (FSRNL-Live)",
    description:
      "A 6-week, live, project-based MERN stack bootcamp. Build, deploy, and launch your full stack career.",
    // instructor and instructorImage removed
    price: 12999,
    duration: "6 weeks",
    // category removed
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    features: [
      "Live, project-based sessions",
      "End-to-end MERN stack integration",
      "Production-ready e-commerce capstone",
      "Cloud deployment (Vercel, Render)",
      "100+ hours of recorded content",
      "Hands-on assignments & MCQs",
      "Full stack interview prep",
      "24/7 community support",
    ],
    curriculum: [
      "React.js Essentials & Modern Frontend Development",
      "Node.js, Express & RESTful API Development",
      "MongoDB & Database Modeling",
      "Authentication, JWT & Secure Routing",
      "State Management & Real-time Data",
      "Capstone: E-commerce App (Frontend + Backend)",
      "Deployment & Cloud Platforms",
      "Version Control & Collaboration",
      "Bonus: Interview Prep & Assignments",
    ],
    prerequisites: [
      "Basic programming knowledge",
      "Computer with internet access",
      "Willingness to learn and build real projects",
    ],
    // certificateProvided removed
    // language removed
    lastUpdated: "2024-12-01",
    tags: [
      "React",
      "Node.js",
      "MongoDB",
      "JavaScript",
      "Full Stack",
      "MERN",
      "Live",
    ],
    startDate: "2025-08-01",
    endDate: "2025-09-12",
    mode: "online",
    whatYouWillLearn: [
      "Build modern UIs with React.js",
      "Develop RESTful APIs with Node.js & Express",
      "Model databases with MongoDB",
      "Implement authentication with JWT",
      "Deploy full-stack apps to cloud",
      "Master Git & collaboration workflows",
    ],
  },
  {
    id: "2",
    uuid: "d2e3f4g5-h6i7-8901-jklm-nop234567890",
    overview:
      "Master Python, statistics, machine learning, and real-world data science projects. Includes hands-on labs and a capstone project.",
    trainer: {
      name: "Dr. Priya Sharma",
      bio: "PhD in Data Science, 10+ years in analytics and machine learning, published author.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
      linkedin: "https://www.linkedin.com/in/drpriyasharma/",
    },
    title: "Data Science & Machine Learning",
    description:
      "Comprehensive course covering Python, statistics, machine learning algorithms, and real-world data science projects.",
    // instructor and instructorImage removed
    price: 15999,
    duration: "20 weeks",
    // category removed
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    features: [
      "Hands-on Python labs",
      "Machine learning projects",
      "Capstone project",
      "Industry expert trainer",
      "24/7 support",
      "Certificate of completion",
    ],
    curriculum: [
      "Python Programming & Data Analysis",
      "Statistics & Probability",
      "Machine Learning Algorithms",
      "Data Visualization & Storytelling",
      "Capstone: Real-world Data Science Project",
    ],
    prerequisites: [
      "Basic programming",
      "Math fundamentals",
      "Interest in data",
    ],
    // certificateProvided removed
    // language removed
    lastUpdated: "2024-11-28",
    tags: ["Python", "Machine Learning", "Data Science", "AI", "Analytics"],
    startDate: "2025-09-10",
    endDate: "2026-01-30",
    mode: "offline",
    whatYouWillLearn: [
      "Write Python for data analysis",
      "Apply ML algorithms",
      "Visualize and interpret data",
      "Build and deploy ML models",
    ],
  },
  {
    id: "3",
    uuid: "e3f4g5h6-i7j8-9012-klmn-opq345678901",
    overview:
      "Build cross-platform mobile apps for iOS and Android using React Native and JavaScript. Learn to deploy and optimize apps for real users.",
    trainer: {
      name: "Arjun Patel",
      bio: "Mobile App Specialist, 8+ years in React Native, built 20+ published apps.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      linkedin: "https://www.linkedin.com/in/arjunpatel-dev/",
    },
    title: "Mobile App Development with React Native",
    description:
      "Build cross-platform mobile applications for iOS and Android using React Native and JavaScript.",
    // instructor and instructorImage removed
    price: 10999,
    duration: "12 weeks",
    // category removed
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    features: [
      "Cross-platform development",
      "Real device testing",
      "App store deployment",
      "Performance optimization",
      "Push notifications",
      "Industry expert trainer",
    ],
    curriculum: [
      "Module 1: React Native Fundamentals\n- Setting up development environment\n- JSX and component structure\n- Styling and layout basics",
      "Module 2: Navigation & Routing\n- React Navigation setup\n- Stack, Tab, Drawer navigation\n- Deep linking",
      "Module 3: State Management\n- Using Context API\n- Redux basics\n- Managing global state",
      "Module 4: Native Modules\n- Integrating device features\n- Using third-party native modules\n- Permissions and platform APIs",
      "Module 5: API Integration\n- Fetching data from REST APIs\n- Handling async operations\n- Error handling and loading states",
      "Module 6: Testing & Debugging\n- Debugging tools\n- Unit and integration testing\n- Performance profiling",
      "Module 7: App Store Submission\n- Preparing builds for iOS/Android\n- App store requirements\n- Release and update process",
      "Module 8: Performance Optimization\n- Optimizing rendering\n- Reducing bundle size\n- Best practices for fast apps",
    ],
    prerequisites: ["JavaScript knowledge", "Basic React understanding"],
    // certificateProvided removed
    // language removed
    lastUpdated: "2024-11-25",
    tags: ["React Native", "Mobile", "iOS", "Android", "JavaScript"],
    startDate: "2025-10-05",
    endDate: "2026-01-05",
    mode: "online",
    whatYouWillLearn: [
      "Build mobile apps with React Native",
      "Integrate APIs and native modules",
      "Deploy apps to app stores",
      "Optimize app performance",
    ],
  },
  {
    id: "4",
    uuid: "f4g5h6i7-j8k9-0123-lmno-pqr456789012",
    overview:
      "Learn UI/UX design principles with hands-on projects using Figma and Adobe XD. Build a professional design portfolio.",
    trainer: {
      name: "Sneha Reddy",
      bio: "UI/UX Designer, 7+ years in digital product design, Figma and Adobe XD expert.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      linkedin: "https://www.linkedin.com/in/sneha-reddy/",
    },
    title: "UI/UX Design Masterclass",
    description:
      "Learn user interface and user experience design principles with hands-on projects using Figma and Adobe XD.",
    // instructor and instructorImage removed
    price: 8999,
    duration: "10 weeks",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    features: [
      "Design thinking process",
      "Prototyping tools",
      "User research methods",
      "Portfolio development",
      "Industry projects",
      "Expert mentorship",
    ],
    curriculum: [
      "Design Fundamentals",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Visual Design",
      "Usability Testing",
      "Design Systems",
      "Portfolio Creation",
    ],
    prerequisites: ["Creative mindset", "No prior design experience needed"],
    // certificateProvided removed
    // language removed
    lastUpdated: "2024-11-30",
    tags: ["UI Design", "UX Design", "Figma", "Adobe XD", "Prototyping"],
    startDate: "2025-08-15",
    endDate: "2025-10-25",
    mode: "offline",
    whatYouWillLearn: [
      "Apply design thinking",
      "Create wireframes and prototypes",
      "Conduct user research",
      "Build a professional portfolio",
    ],
  },
  {
    id: "5",
    uuid: "g5h6i7j8-k9l0-1234-mnop-qrs567890123",
    overview:
      "Master AWS and cloud computing concepts with hands-on labs and real-world scenarios. Prepare for AWS certification.",
    trainer: {
      name: "Vikram Singh",
      bio: "Cloud Solutions Architect, AWS Certified, 10+ years in cloud infrastructure.",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      linkedin: "https://www.linkedin.com/in/vikram-singh-cloud/",
    },
    title: "Cloud Computing with AWS",
    description:
      "Master Amazon Web Services and cloud computing concepts with hands-on labs and real-world scenarios.",
    // instructor and instructorImage removed
    price: 13999,
    duration: "14 weeks",
    // category removed
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    features: [
      "AWS certification prep",
      "Hands-on labs",
      "Real-world projects",
      "Industry best practices",
      "Career support",
      "Expert mentorship",
    ],
    curriculum: [
      "Cloud Computing Basics",
      "AWS Core Services",
      "EC2 & VPC",
      "Storage Solutions",
      "Database Services",
      "Security & IAM",
      "Monitoring & Logging",
      "Certification Preparation",
    ],
    prerequisites: ["Basic networking knowledge", "Linux fundamentals"],
    // certificateProvided removed
    // language removed
    lastUpdated: "2024-12-02",
    tags: [
      "AWS",
      "Cloud Computing",
      "DevOps",
      "Infrastructure",
      "Certification",
    ],
    startDate: "2025-09-01",
    endDate: "2025-12-10",
    mode: "online",
    whatYouWillLearn: [
      "Deploy and manage AWS services",
      "Design cloud architectures",
      "Implement security best practices",
      "Prepare for AWS certification",
    ],
  },
  {
    id: "6",
    uuid: "h6i7j8k9-l0m1-2345-nopq-rst678901234",
    overview:
      "Learn essential cybersecurity concepts, tools, and techniques to protect digital assets and networks. Includes ethical hacking and certification prep.",
    trainer: {
      name: "Colonel Rahul Mehta",
      bio: "Ex-Army Cybersecurity Lead, 15+ years in security, expert in ethical hacking.",
      avatar:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop&crop=face",
      linkedin: "https://www.linkedin.com/in/colonelrahulmehta/",
    },
    title: "Cybersecurity Fundamentals",
    description:
      "Learn essential cybersecurity concepts, tools, and techniques to protect digital assets and networks.",
    // instructor and instructorImage removed
    price: 11999,
    duration: "12 weeks",
    // category removed
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    features: [
      "Ethical hacking",
      "Security tools & risk assessment",
      "Incident response",
      "Industry certification prep",
      "Expert trainer",
      "Career guidance",
    ],
    curriculum: [
      "Cybersecurity Basics",
      "Network Security",
      "Ethical Hacking",
      "Vulnerability Assessment",
      "Incident Response",
      "Cryptography",
      "Compliance & Governance",
      "Career Guidance",
    ],
    prerequisites: ["Basic computer knowledge", "Networking fundamentals"],
    // certificateProvided removed
    // language removed
    lastUpdated: "2024-11-29",
    tags: [
      "Cybersecurity",
      "Ethical Hacking",
      "Network Security",
      "Privacy",
      "Compliance",
    ],
    startDate: "2025-11-01",
    endDate: "2026-01-20",
    mode: "offline",
    whatYouWillLearn: [
      "Protect digital assets & networks",
      "Perform ethical hacking",
      "Respond to security incidents",
      "Prepare for industry certifications",
    ],
  },
];

export const categories = [
  "All Categories",
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Design",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "Artificial Intelligence",
];
