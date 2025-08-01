export interface DayContent {
  id: string;
  content: string;
  dayNumber: number;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  days: DayContent[];
  mcqAttempted: boolean;
  mcqAccessible: boolean;
  isLocked?: boolean;
  order?: number;
}

export interface Course {
  id: string;
  title: string;
  instructor?: string;
  instructorImage?: string;
  description: string;
  image?: string;
  logo?: string;
  price?: number;
  originalPrice?: number;
  certificateProvided?: boolean;
  progress: number;
  totalModules: number;
  completedModules: number;
  duration: string;
  level?: string;
  rating?: number;
  studentsEnrolled?: number;
  start_date: string;
  end_date: string;
  nextDeadline?: string;
  status: "active" | "completed" | "not-started";
  category?: string;
  lastAccessed?: string;
  modules: Module[];
}

export interface Question {
  questionId?: string;
  id?: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface MCQ {
  id: string;
  questions: Question[];
  passingScore: number;
}

export interface ModuleResult {
  testScore: number;
  minimumPassMarks: number;
  passed: boolean;
}

export interface Lesson {
  id: number;
  title: string;
  type: "video" | "reading" | "quiz" | "assignment";
  duration: string;
  completed: boolean;
}

export interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: "completed" | "submitted" | "pending";
  score: number | null;
  feedback: string | null;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  content: string;
}
