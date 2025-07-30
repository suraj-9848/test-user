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
  uuid: string;
  id: string;
  title: string;
  description: string;
  overview: string;
  trainer: {
    name: string;
    bio: string;
    avatar: string;
    linkedin: string;
  };
  price: number;
  duration: string;
  image: string;
  lastUpdated: string;
  tags: string[];
  startDate: string;
  endDate: string;
  mode: "online" | "offline";
  features: string[];
  curriculum: string[];
  prerequisites: string[];
  whatYouWillLearn: string[];
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
