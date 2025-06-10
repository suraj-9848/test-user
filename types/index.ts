export type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

export interface TestimonialCardProps {
  logo: string;
  name: string;
  username: string;
  rating: number;
  color: string;
}
export type Testimonial = {
  logo: string;      // Path to logo image
  name: string;
  username: string;
  rating: number;
  color: string;     // Tailwind-compatible color
  college: string;   // New field
  experience: string
};


export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  duration: string; 
  image: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  rating: number;
  reviews: number;
  tags: string[];
  syllabus: {
    module: string;
    topics: string[];
  }[];
  prerequisites: string[];
  outcomes: string[];
  price: number;
  isFree: boolean;
  enrollmentCount: number;
  lastUpdated: string;
}
