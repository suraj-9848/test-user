export interface LeaderboardEntry {
  userName: string;
  totalScore: number;
  percentage: number;
  courseName: string;
  totalMaxMarks: number;
  rank: number;
}

/**
 * Static mock leaderboard dataset with exactly 1634 Telugu/AP/Telangana names.
 * This data won't change on refresh as it's a pre-generated constant array.
 */

// Telugu/AP/Telangana male first names
const maleFirstNames = [
  "Venkata",
  "Krishna",
  "Srinivas",
  "Rajesh",
  "Suresh",
  "Ramesh",
  "Mahesh",
  "Ganesh",
  "Naresh",
  "Harish",
  "Venkatesh",
  "Kiran",
  "Praveen",
  "Anil",
  "Mohan",
  "Ravi",
  "Chandra",
  "Bhaskar",
  "Kishore",
  "Pavan",
  "Vamsi",
  "Siva",
  "Jagadish",
  "Ashwin",
  "Prasad",
  "Gopi",
  "Vinod",
  "Murali",
  "Karthik",
  "Naveen",
  "Lokesh",
  "Hari",
  "Chaitanya",
  "Tarun",
  "Venkat",
  "Gopal",
  "Nikhil",
  "Rakesh",
  "Srikanth",
  "Dhananjay",
  "Venu",
  "Rohit",
  "Ajay",
  "Sunil",
  "Varun",
  "Prashanth",
  "Keshav",
  "Vikram",
  "Siddharth",
  "Rajasekhar",
  "Nithin",
  "Deepak",
  "Nithish",
  "Hemanth",
  "Akhil",
  "Vishnu",
  "Charan",
  "Sumanth",
  "Abhishek",
  "Nitin",
  "Rohith",
  "Darshan",
  "Mohan",
  "Uday",
  "Arun",
  "Vijay",
  "Naga",
  "Teja",
  "Srinath",
  "Venky",
  "Surya",
  "Prabhu",
  "Satish",
  "Raghu",
  "Shankar",
  "Chakri",
  "Kalyan",
  "Pradeep",
  "Shiva",
  "Srinu",
  "Dinesh",
  "Aravind",
  "Madhu",
  "Santhosh",
  "Bhanu",
  "Chaitu",
  "Murthy",
  "Eswar",
  "Goutham",
  "Jaswanth",
  "Lokanath",
  "Manoj",
  "Nagendra",
  "Omkar",
  "Prithvi",
  "Raju",
  "Sarath",
  "Tejeshwar",
  "Umashankar",
  "Veeresh",
  "Yashwanth",
  "Vignesh",
  "Ramakrishna",
  "Anand",
  "Babu",
  "Durga",
  "Eshanth",
  "Hemanth",
  "Satyam",
  "Sriman",
  "Sriram",
  "Gautam",
  "Lalith",
  "Nagesh",
  "Prudhvi",
  "Sairam",
];

// Telugu/AP/Telangana female first names
const femaleFirstNames = [
  "Lakshmi",
  "Priya",
  "Kavitha",
  "Priyanka",
  "Divya",
  "Swathi",
  "Sowmya",
  "Madhuri",
  "Deepika",
  "Sneha",
  "Keerthi",
  "Nithya",
  "Sindhu",
  "Lavanya",
  "Sravya",
  "Vyshnavi",
  "Sahithi",
  "Mounika",
  "Bhavya",
  "Harini",
  "Vani",
  "Sushma",
  "Pooja",
  "Rachana",
  "Jyothi",
  "Anitha",
  "Sailaja",
  "Gowri",
  "Padma",
  "Chitra",
  "Ramya",
  "Srilekha",
  "Manasa",
  "Sruthi",
  "Alekhya",
  "Bhavani",
  "Roshni",
  "Tejaswi",
  "Vaishnavi",
  "Varsha",
  "Archana",
  "Nandini",
  "Roja",
  "Aparna",
  "Sandhya",
  "Shruti",
  "Spandana",
  "Jhansi",
  "Shravani",
  "Saritha",
  "Swetha",
  "Chandana",
  "Pallavi",
  "Thanuja",
  "Shobha",
  "Pranitha",
  "Harshitha",
  "Madhavi",
  "Revathi",
  "Nikhitha",
  "Deepthi",
  "Ramani",
  "Tejaswini",
  "Bhargavi",
  "Keerthana",
  "Srividya",
  "Pranavi",
  "Pavani",
  "Anjali",
  "Sahaja",
  "Akshaya",
  "Anusha",
  "Bhavitha",
  "Pragna",
  "Samyuktha",
  "Sravanthi",
  "Srilatha",
  "Manvitha",
  "Hema",
  "Sowjanya",
  "Nikitha",
  "Preethi",
  "Haritha",
  "Swapna",
  "Kavya",
  "Ashwini",
  "Mythri",
  "Varsha",
  "Satya",
  "Sirisha",
  "Sushmitha",
  "Tanuja",
  "Uma",
  "Vijaya",
  "Yamini",
  "Aaradhya",
  "Bindu",
  "Chandrika",
  "Dhanalakshmi",
  "Ganga",
  "Indira",
  "Jayanthi",
  "Kamala",
  "Lalitha",
  "Meenakshi",
  "Nagalakshmi",
  "Saraswati",
  "Sudha",
  "Sunitha",
  "Tulasi",
  "Vimala",
  "Radhika",
];

// Telugu/AP/Telangana surnames
const surnames = [
  "Reddy",
  "Naidu",
  "Rao",
  "Raju",
  "Chowdary",
  "Goud",
  "Sharma",
  "Varma",
  "Chari",
  "Murthy",
  "Sastry",
  "Prasad",
  "Achari",
  "Acharya",
  "Dora",
  "Devarakonda",
  "Bujji",
  "Nandyala",
  "Kuchipudi",
  "Akkineni",
  "Daggubati",
  "Konidela",
  "Allu",
  "Nandamuri",
  "Ghattamaneni",
  "Tottempudi",
  "Deverakonda",
  "Vemulapati",
  "Chiranjeevi",
  "Ravipudi",
  "Singampalli",
  "Tenali",
  "Anumolu",
  "Tupakula",
  "Manchu",
  "Yarlagadda",
  "Panduranga",
  "Pothineni",
  "Gottipati",
  "Gunturi",
  "Jonnalagadda",
  "Kommareddy",
  "Lingampally",
  "Madiraju",
  "Nimmagadda",
  "Ogirala",
  "Pulijala",
  "Rachakonda",
  "Surampudi",
  "Talluri",
  "Uppalapati",
  "Vadlamudi",
  "Yellamraju",
  "Maddukuri",
  "Mudunuri",
  "Nareddula",
  "Palaparthi",
  "Yellandu",
  "Bezawada",
  "Bhamidipati",
  "Doppalapudi",
  "Ganapathiraju",
  "Gudavalli",
  "Vemulakonda",
  "Yendamuri",
  "Nanduri",
  "Chilukuri",
  "Adavi",
  "Bandi",
  "Challa",
  "Cherukuri",
  "Edupuganti",
  "Gudimetla",
  "Jampala",
  "Kadiyala",
  "Kakarlapudi",
  "Kondaveeti",
  "Madala",
  "Nelakuditi",
  "Pedapudi",
  "Saripalli",
  "Tadepalli",
  "Veeramachineni",
  "Mokkapati",
  "Paritala",
  "Abburi",
  "Buchepalli",
  "Devineni",
];

// Extra Telugu name components to add variety
const prefixes = [
  "Sri",
  "Sai",
  "Naga",
  "Venkata",
  "Rama",
  "Surya",
  "Chandra",
  "Durga",
  "Siva",
  "Satya",
  "Maha",
  "Lakshmi",
];
const middleNames = [
  "Bhavani",
  "Kumar",
  "Prasad",
  "Teja",
  "Lakshmi",
  "Devi",
  "Krishna",
  "Pavan",
  "Manoj",
  "Srinivas",
];

// Web development and tech-related courses only
const courses = [
  { name: "Full Stack Development", maxMarks: 100 },
  { name: "MERN Stack Development", maxMarks: 100 },
  { name: "React & TypeScript", maxMarks: 100 },
  { name: "Frontend Development", maxMarks: 100 },
  { name: "Backend Development", maxMarks: 100 },
  { name: "DevOps & CI/CD", maxMarks: 100 },
  { name: "Web Security", maxMarks: 100 },
  { name: "JavaScript Advanced", maxMarks: 100 },
  { name: "UI/UX Design", maxMarks: 100 },
  { name: "API Development", maxMarks: 100 },
];

/**
 * Creates a fixed, static leaderboard data with exactly 1634 entries
 */
const createFixedLeaderboardData = () => {
  const data: LeaderboardEntry[] = [];

  // Generate exactly 1634 students
  const studentCount = 1634;

  // Used to track unique names
  const usedNames = new Set<string>();

  // Generate unique names for all students
  const generateUniqueName = (index: number): string => {
    // Select name components based on pseudo-random but deterministic pattern
    const isFemale = index % 2 === 0;
    const nameList = isFemale ? femaleFirstNames : maleFirstNames;

    // Select name components based on index to ensure deterministic but varied results
    const firstNameIndex = (index * 13) % nameList.length;
    const surnameIndex = (index * 17) % surnames.length;
    const firstName = nameList[firstNameIndex];
    const surname = surnames[surnameIndex];

    // Different name patterns
    let name = "";
    const pattern = index % 7;

    if (pattern === 0 && index % 3 === 0) {
      // Add a Telugu prefix (Sri, Sai, etc.)
      const prefixIndex = (index * 11) % prefixes.length;
      name = `${prefixes[prefixIndex]} ${firstName} ${surname}`;
    } else if (pattern === 1) {
      // Add a middle name/initial
      const middleIndex = (index * 19) % middleNames.length;
      name = `${firstName} ${middleNames[middleIndex].charAt(0)}. ${surname}`;
    } else if (pattern === 2) {
      // Use two-part first name with surname
      const secondNameIndex = ((index + 1) * 13) % nameList.length;
      const secondName = nameList[secondNameIndex];
      name = `${firstName} ${secondName} ${surname}`;
    } else if (pattern === 3 && index % 2 === 1) {
      // Use initials with surname
      name = `${firstName.charAt(0)}.${firstName.charAt(1)}. ${surname}`;
    } else if (pattern === 4) {
      // Use just first name and surname
      name = `${firstName} ${surname}`;
    } else if (pattern === 5) {
      // Use compound surname
      const secondSurnameIndex = ((index + 2) * 17) % surnames.length;
      const secondSurname = surnames[secondSurnameIndex];
      name = `${firstName} ${surname} ${secondSurname}`;
    } else {
      // Use standard format with middle name
      const middleIndex = (index * 7) % middleNames.length;
      name = `${firstName} ${middleNames[middleIndex]} ${surname}`;
    }

    // Check if this name is already used
    if (usedNames.has(name)) {
      // Add a regional indicator as a last resort to make unique
      const districts = [
        "Vizag",
        "Guntur",
        "Hyderabad",
        "Warangal",
        "Kurnool",
        "Nellore",
      ];
      const districtIndex = (index * 23) % districts.length;
      name = `${name} (${districts[districtIndex]})`;

      // Still a duplicate? Add an initial
      if (usedNames.has(name)) {
        name = `${name} ${String.fromCharCode(65 + (index % 26))}`;
      }
    }

    usedNames.add(name);
    return name;
  };

  // Generate deterministic student data
  for (let i = 0; i < studentCount; i++) {
    // Get unique name
    const userName = generateUniqueName(i);

    // Select a course deterministically
    const courseIndex = (i * 7) % courses.length;
    const course = courses[courseIndex];

    // Generate deterministic score distribution
    let percentage;
    if (i < studentCount * 0.03) {
      // Top 3%
      percentage = 95 + ((i * 0.01) % 5); // 95-100%
    } else if (i < studentCount * 0.1) {
      // Next 7%
      percentage = 90 + ((i * 0.01) % 5); // 90-95%
    } else if (i < studentCount * 0.25) {
      // Next 15%
      percentage = 80 + ((i * 0.1) % 10); // 80-90%
    } else if (i < studentCount * 0.5) {
      // Next 25%
      percentage = 70 + ((i * 0.1) % 10); // 70-80%
    } else if (i < studentCount * 0.75) {
      // Next 25%
      percentage = 60 + ((i * 0.1) % 10); // 60-70%
    } else if (i < studentCount * 0.9) {
      // Next 15%
      percentage = 50 + ((i * 0.1) % 10); // 50-60%
    } else {
      // Bottom 10%
      percentage = 35 + ((i * 0.1) % 15); // 35-50%
    }

    // Calculate score based on percentage (all max marks are 100)
    const totalScore = Math.floor(percentage);

    data.push({
      userName,
      totalScore,
      percentage: Math.round(percentage * 100) / 100,
      courseName: course.name,
      totalMaxMarks: 100,
      rank: 0, // Will be set after sorting
    });
  }

  // Sort by percentage and assign proper ranks
  data.sort((a, b) => b.percentage - a.percentage);
  data.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return data;
};

// Create the static data once
const MOCK_LEADERBOARD_DATA = createFixedLeaderboardData();

// Export the static data and generation function
export { MOCK_LEADERBOARD_DATA };

// Pagination helper function
export function paginateData<T>(data: T[], page: number, itemsPerPage: number) {
  if (!data || !Array.isArray(data)) {
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    data: data.slice(startIndex, endIndex),
    totalPages: Math.ceil(data.length / itemsPerPage),
    currentPage: page,
    totalItems: data.length,
    hasNextPage: endIndex < data.length,
    hasPreviousPage: page > 1,
  };
}
