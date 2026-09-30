export const profile = {
  name: 'Ansh Mani',
  degree: 'B.Tech – Computer Science Engineering',
  university: 'Shobhit University',
  duration: '2024–2028',
  cgpa: '7.0',
  email: 'anshmani.pvt@gmail.com',
  phone: '9305117821',
  github: 'https://github.com/anshmanipvt-prog',
  linkedin: 'https://www.linkedin.com/in/ansh-mani-3852683a0/',
  leetcode: 'https://leetcode.com/u/anshmanipvt-prog/',
  geeksforgeeks: 'https://www.geeksforgeeks.org/profile/anshmas4qp',
  resumeUrl: '',
  headline: 'B.Tech CSE Student | Developer | Problem Solver',
  intro: 'Computer Science Engineering student passionate about software development, web development and problem solving. I enjoy building real-world projects, learning new technologies and improving my Data Structures & Algorithms skills.',
}

export const defaultProjects = [
  {
    _id: 'shree-ram-auto-parts',
    title: 'Shree Ram Auto Parts',
    description: 'A full-stack web application for a bike workshop and spare-parts business, designed to manage products, services and customer interactions.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    githubUrl: 'https://github.com/anshmanipvt-prog/shree-ram-auto-parts',
    liveUrl: 'https://shree-ram-auto-parts.onrender.com/',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=82',
    category: 'Full stack',
    featured: true,
  },
  {
    _id: 'personal-resume-website',
    title: 'Personal Resume Website',
    description: 'A responsive personal resume and portfolio website showcasing education, skills, projects and professional information.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: 'https://github.com/anshmanipvt-prog',
    liveUrl: '',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=82',
    category: 'Frontend',
    featured: false,
  },
  {
    _id: 'bioguard-ai',
    title: 'BioGuard AI',
    subtitle: 'AI-Powered Early Warning System for Crop Health & Food Security',
    description: 'An AI-powered system designed to analyze crop health and provide early warnings and decision support.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Google Gemini API'],
    githubUrl: '',
    liveUrl: '',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=82',
    category: 'AI / ML',
    featured: true,
    features: ['AI-powered crop analysis', 'Crop image analysis', 'Foliar diagnostic vision analysis', 'Multilingual decision-support assistant', 'Gemini AI integration'],
  },
  {
    _id: 'student-management-system',
    title: 'Student Management System',
    description: 'A console-based C++ application that manages student records using file handling and menu-driven operations.',
    technologies: ['C++'],
    githubUrl: '',
    liveUrl: '',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=82',
    category: 'Software',
    featured: false,
    features: ['Add, update and delete students', 'Display student records', 'Persistent file storage', 'Menu-driven navigation'],
  },
]

export const skillGroups = [
  { title: 'Programming', skills: ['C++', 'Python', 'JavaScript'] },
  { title: 'Web development', skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js'] },
  { title: 'Data & APIs', skills: ['MongoDB', 'MySQL', 'REST APIs'] },
  { title: 'Computer science', skills: ['Data Structures & Algorithms', 'Problem Solving', 'Object-Oriented Programming'] },
  { title: 'Tools', skills: ['Git', 'GitHub', 'VS Code'] },
]

export const interests = ['Software development', 'Web development', 'C++', 'Python', 'JavaScript', 'React', 'Data Structures & Algorithms', 'Problem solving', 'Real-world applications']

export const education = {
  degree: 'B.Tech – Computer Science Engineering',
  university: 'Shobhit University',
  duration: '2024–2028',
  cgpa: '7.0',
  areas: ['Programming', 'Data Structures & Algorithms', 'Web Development', 'Database Systems', 'Computer Science fundamentals'],
}

export const codingProfiles = [
  { name: 'GitHub', handle: '@anshmanipvt-prog', url: profile.github, mark: 'GH', description: 'Projects, experiments and source code.' },
  { name: 'LeetCode', handle: 'anshmanipvt-prog', url: profile.leetcode, mark: 'LC', description: 'Practice in algorithms and data structures.' },
  { name: 'GeeksforGeeks', handle: 'anshmas4qp', url: profile.geeksforgeeks, mark: 'GFG', description: 'Learning notes and coding practice.' },
]