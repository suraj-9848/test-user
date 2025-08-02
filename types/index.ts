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
  logo: string; // Path to logo image
  name: string;
  username: string;
  rating: number;
  color: string; // Tailwind-compatible color
  college: string; // New field
  experience: string;
};

declare module "next-auth" {
  interface Session {
    jwt?: any;
  }
}

// src/types/index.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  overview: string;
  trainer: {
    name: string;
    bio: string;
    avatar?: string; // Optional, as trainer_avatar may be empty
    linkedin?: string; // Optional, as linkedin may be missing
  };
  price: number;
  originalPrice?: number;
  duration: string;
  image?: string; // Optional, maps to logo, may be empty
  instructor?: string; // Maps to instructor_name, optional
  instructorImage?: string;
  rating?: number;
  studentsEnrolled?: number;
  certificateProvided?: boolean;
  lastUpdated: string;
  tags: string[];
  startDate: string;
  endDate: string;
  mode: string; // Changed to string to accommodate "hybrid"
  features: string[];
  curriculum: string[];
  prerequisites: string[];
  whatYouWillLearn: string[];
  is_public?: boolean; // Optional, from API
  logo?: string; // Optional, maps to image
}

export interface EnrollmentData {
  courseId: string;
  studentName: string;
  email: string;
  phone: string;
  experience: string;
  motivation: string;
  paymentMethod: "upi" | "card" | "netbanking";
}
