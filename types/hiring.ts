// Types for hiring platform
export interface CandidateData {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;

  // Professional Details
  targetedJob: string;
  experience: number;
  linkedinProfile: string;
  resume: File | null;

  // Education
  graduationYear: number;
  degree: string;
  university: string;

  // Additional
  skills: string[];
  expectedSalary: string;
  availability: string;
}

export interface JobNotification {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  deadline: Date;
  isExternal: boolean;
}

export interface HiringService {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricing: string;
  rating: number;
  reviews: number;
}
