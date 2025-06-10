const tags = [
  "#All",
  "#Alumnistories",
  "#Hiring",
  "#Updates",
  "#Announcements",
  "#Alerts",
] as const;

type BlogPost = {
  id: number;
  title: string;
  imageUrl: string;
  postedOn: string;
  tag: (typeof tags)[number];
};

export const dummyPosts: BlogPost[] = [
  // #Updates
  {
    id: 1,
    title: "Nirudhyog monthly: May 2025",
    imageUrl: "https://placehold.co/600x350/png?text=May+2025",
    postedOn: "5 Jun",
    tag: "#Updates",
  },
  {
    id: 2,
    title: "New Course Release: React for Beginners",
    imageUrl: "https://placehold.co/600x350/png?text=React+Course",
    postedOn: "1 Jun",
    tag: "#Updates",
  },
  {
    id: 3,
    title: "Curriculum Update: Advanced Python Modules",
    imageUrl: "https://placehold.co/600x350/png?text=Python+Update",
    postedOn: "25 May",
    tag: "#Updates",
  },

  // #Alumnistories
  {
    id: 4,
    title: "Meet our alumni founders",
    imageUrl: "https://placehold.co/600x350/png?text=Alumni",
    postedOn: "28 May",
    tag: "#Alumnistories",
  },
  {
    id: 5,
    title: "From Learner to Leader: Rahul’s Journey at Garden LMS",
    imageUrl: "https://placehold.co/600x350/png?text=Rahul+Story",
    postedOn: "15 May",
    tag: "#Alumnistories",
  },
  {
    id: 6,
    title: "How Ananya Landed a Remote Job at Google",
    imageUrl: "https://placehold.co/600x350/png?text=Ananya+at+Google",
    postedOn: "10 May",
    tag: "#Alumnistories",
  },

  // #Hiring
  {
    id: 7,
    title: "We’re hiring product designers!",
    imageUrl: "https://placehold.co/600x350/png?text=Hiring",
    postedOn: "21 May",
    tag: "#Hiring",
  },
  {
    id: 8,
    title: "Join our engineering team – Fullstack openings",
    imageUrl: "https://placehold.co/600x350/png?text=Fullstack+Hiring",
    postedOn: "18 May",
    tag: "#Hiring",
  },
  {
    id: 9,
    title: "Looking for growth marketers with LMS experience",
    imageUrl: "https://placehold.co/600x350/png?text=Marketing+Role",
    postedOn: "8 May",
    tag: "#Hiring",
  },

  // #Alerts
  {
    id: 10,
    title: "Emergency alert – server downtime",
    imageUrl: "https://placehold.co/600x350/png?text=Alert",
    postedOn: "9 May",
    tag: "#Alerts",
  },
  {
    id: 11,
    title: "Scheduled maintenance – 12th June, 2AM–4AM IST",
    imageUrl: "https://placehold.co/600x350/png?text=Maintenance+Alert",
    postedOn: "6 Jun",
    tag: "#Alerts",
  },
  {
    id: 12,
    title: "Account verification bug – Please reset passwords",
    imageUrl: "https://placehold.co/600x350/png?text=Bug+Alert",
    postedOn: "2 Jun",
    tag: "#Alerts",
  },

  // #Announcements
  {
    id: 13,
    title: "Announcing LMS 2.0 – Faster, Smarter, Smoother",
    imageUrl: "https://placehold.co/600x350/png?text=LMS+2.0",
    postedOn: "4 Jun",
    tag: "#Announcements",
  },
  {
    id: 14,
    title: "New Learning Tracks for AI, Blockchain, and UI/UX",
    imageUrl: "https://placehold.co/600x350/png?text=New+Tracks",
    postedOn: "26 May",
    tag: "#Announcements",
  },
  {
    id: 15,
    title: "Introducing Garden Certification Exams",
    imageUrl: "https://placehold.co/600x350/png?text=Certification",
    postedOn: "16 May",
    tag: "#Announcements",
  },
];
