# Student Courses Structure

This directory contains the student course management system with a nested structure for modules and MCQ tests.

## Directory Structure

```
src/app/student/courses/
├── README.md                           # This file
├── page.tsx                           # Course listing page
├── [id]/                              # Dynamic course ID route
│   ├── page.tsx                       # Course detail page
│   └── modules/                       # Course modules
│       └── [moduleId]/                # Dynamic module ID route
│           ├── page.tsx               # Module detail page with day content
│           └── mcq/                   # MCQ test section
│               └── page.tsx           # MCQ test page
```

## Page Descriptions

### 1. Course Listing (`/student/courses`)

- **File**: `page.tsx`
- **Purpose**: Displays all available courses for the student
- **Features**:
  - Course cards with progress indicators
  - Search and filtering capabilities
  - Course status (active, completed, not-started)
  - Navigation to individual courses

### 2. Course Detail (`/student/courses/[id]`)

- **File**: `[id]/page.tsx`
- **Purpose**: Shows detailed information about a specific course
- **Features**:
  - Course overview and description
  - Module listing with completion status
  - Progress tracking
  - Navigation to individual modules
  - Assignments and announcements tabs

### 3. Module Detail (`/student/courses/[id]/modules/[moduleId]`)

- **File**: `[id]/modules/[moduleId]/page.tsx`
- **Purpose**: Displays module content organized by days
- **Features**:
  - Day-wise content structure
  - Markdown content rendering
  - Progress tracking per day
  - MCQ test access
  - Test results display
  - Sticky sidebar with progress overview

### 4. MCQ Test (`/student/courses/[id]/modules/[moduleId]/mcq`)

- **File**: `[id]/modules/[moduleId]/mcq/page.tsx`
- **Purpose**: Interactive MCQ test interface
- **Features**:
  - Timer functionality (30 minutes)
  - Question navigation
  - Answer selection and validation
  - Auto-submit on time expiry
  - Results display with score calculation
  - Correct/incorrect answer highlighting

## Data Types

### Course Interface

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  duration: string;
  status: "active" | "completed" | "not-started";
  // ... other properties
}
```

### Module Interface

```typescript
interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  days: DayContent[];
  mcqAttempted: boolean;
  mcqAccessible: boolean;
}
```

### Day Content Interface

```typescript
interface DayContent {
  id: string;
  content: string;
  dayNumber: number;
  completed: boolean;
}
```

### MCQ Interface

```typescript
interface MCQ {
  id: string;
  questions: Question[];
  passingScore: number;
}

interface Question {
  questionId?: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}
```

## Features

### Navigation Flow

1. **Courses List** → Click course → **Course Detail**
2. **Course Detail** → Click "View Module" → **Module Detail**
3. **Module Detail** → Click "Take MCQ Test" → **MCQ Test**
4. **MCQ Test** → Complete test → Results displayed

### Key Functionality

#### Course Management

- Browse available courses
- Track progress across all courses
- Filter courses by status and other criteria

#### Module Learning

- Sequential day-based content delivery
- Markdown content support with code highlighting
- Progress tracking per day
- Visual completion indicators

#### Assessment System

- Timed MCQ tests (30 minutes default)
- Real-time answer validation
- Automatic submission on timeout
- Detailed results with correct answer display
- Pass/fail status based on configurable passing score

### Styling

- Uses Tailwind CSS for consistent styling
- Responsive design for mobile and desktop
- Loading states and error handling
- Smooth transitions and hover effects
- Color-coded status indicators

### State Management

- React hooks for local state management
- URL parameters for navigation state
- Local storage could be added for draft answers
- Mock data currently used (ready for API integration)

## API Integration Notes

Currently using mock data. To integrate with real APIs:

1. Replace mock data in `useEffect` hooks with actual API calls
2. Add proper error handling for network requests
3. Implement authentication headers if required
4. Add loading states during API calls
5. Handle pagination for large datasets

## Future Enhancements

- [ ] Add video content support
- [ ] Implement assignment submission
- [ ] Add discussion forums
- [ ] Include peer review system
- [ ] Add downloadable resources
- [ ] Implement offline content caching
- [ ] Add push notifications for deadlines
- [ ] Include accessibility improvements
