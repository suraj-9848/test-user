import { FAQItem, Testimonial } from "../types";

export const faqs:FAQItem[] = [
  {
    question: "What is an LMS?",
    answer:
      "A Learning Management System (LMS) is a software platform used to deliver, track, and manage training and education. It allows educators to create and distribute content, monitor student participation, and assess performance.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "You can enroll by navigating to the course catalog, selecting the desired course, and clicking the 'Enroll' button. You may need to log in or register first.",
  },
  {
    question: "Can I access the LMS on mobile devices?",
    answer:
      "Yes, our LMS is mobile-friendly and can be accessed through any modern web browser on smartphones and tablets.",
  },
  {
    question: "Will I receive a certificate after completing a course?",
    answer:
      "Yes, most courses offer a certificate of completion, which you can download or share once you've finished all course requirements.",
  },
];

export const testimonials: Testimonial[] = [
  {
    logo: "/logos/vnr.png",
    name: "Rohit Mehra",
    username: "rohit_mehra",
    rating: 4.9,
    color: "#0f766e",
    college: "VNR VJIET",
    experience: "The LMS platform made it easy to manage my courses and assignments. The intuitive dashboard and timely notifications really helped me stay organized."
  },
  {
    logo: "/logos/mrec.png",
    name: "Sneha Ramesh",
    username: "sneha_r",
    rating: 4.7,
    color: "#ea580c",
    college: "Mallareddy Engineering College",
    experience: "Interactive quizzes and video lectures helped reinforce my learning. The support from instructors through the LMS was excellent."
  },
  {
    logo: "/logos/cmr.png",
    name: "Aditya Reddy",
    username: "aditya.v",
    rating: 4.8,
    color: "#1e3a8a",
    college: "CMR College of Engineering",
    experience: "The LMS allowed me to learn at my own pace. I loved how progress tracking kept me motivated throughout the semester."
  },
  {
    logo: "/logos/jntuh.png",
    name: "Priya Deshmukh",
    username: "priyadk",
    rating: 5.0,
    color: "#9333ea",
    college: "JNTU Hyderabad",
    experience: "Certificates and downloadable resources were a great bonus. I now feel more prepared for industry-level exams and interviews."
  },
  {
    logo: "/logos/vnr.png",
    name: "Aman Choudhary",
    username: "aman_ch",
    rating: 4.6,
    color: "#15803d",
    college: "VNR VJIET",
    experience: "Group discussions and peer learning tools in the LMS helped me engage more deeply with the course material."
  },
  {
    logo: "/logos/mrec.png",
    name: "Megha Sharma",
    username: "megha_2025",
    rating: 4.9,
    color: "#facc15",
    college: "Mallareddy Engineering College",
    experience: "This LMS gave me the flexibility to balance academics and internships without compromising on learning quality."
  },
];
