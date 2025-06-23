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

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorImage: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  rating: number;
  studentsEnrolled: number;
  image: string;
  features: string[];
  curriculum: string[];
  prerequisites: string[];
  certificateProvided: boolean;
  language: string;
  lastUpdated: string;
  tags: string[];
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
