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
