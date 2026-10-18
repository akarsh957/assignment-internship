export const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const seedCandidates = [
  {
    id: "c-1001", name: "Aarav Mehta", email: "aarav.mehta@email.com", phone: "+91 98765 43210",
    role: "Frontend Engineer", department: "Engineering", experience: 4, skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    score: 94, stage: "Interview", appliedAt: daysAgo(2), linkedin: "https://linkedin.com", resume: "https://example.com/resume/aarav-mehta",
    rating: 4, notes: [{ id: "n-1", text: "Strong component architecture fundamentals. Move to system design round.", author: "Priya S.", createdAt: daysAgo(1) }],
    activity: [{ id: "a-1", from: "Screening", to: "Interview", at: daysAgo(1) }]
  },
  {
    id: "c-1002", name: "Diya Nair", email: "diya.nair@email.com", phone: "+91 98470 12345",
    role: "Product Designer", department: "Design", experience: 3, skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
    score: 88, stage: "Screening", appliedAt: daysAgo(1), linkedin: "https://linkedin.com", resume: "https://example.com/resume/diya-nair",
    rating: 0, notes: [{ id: "n-2", text: "Portfolio shows thoughtful B2B workflow design.", author: "Rahul K.", createdAt: daysAgo(1) }],
    activity: []
  },
  {
    id: "c-1003", name: "Kabir Shah", email: "kabir.shah@email.com", phone: "+91 98201 33445",
    role: "Full Stack Engineer", department: "Engineering", experience: 6, skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    score: 91, stage: "Offer", appliedAt: daysAgo(8), linkedin: "https://linkedin.com", resume: "https://example.com/resume/kabir-shah",
    rating: 5, notes: [{ id: "n-3", text: "Excellent ownership across the full product lifecycle. References checked.", author: "Priya S.", createdAt: daysAgo(2) }],
    activity: [{ id: "a-3", from: "Interview", to: "Offer", at: daysAgo(2) }]
  },
  {
    id: "c-1004", name: "Ananya Iyer", email: "ananya.iyer@email.com", phone: "+91 94440 56789",
    role: "AI Engineer", department: "AI & Data", experience: 5, skills: ["Python", "PyTorch", "LLMs", "MLOps"],
    score: 97, stage: "Interview", appliedAt: daysAgo(4), linkedin: "https://linkedin.com", resume: "https://example.com/resume/ananya-iyer",
    rating: 5, notes: [{ id: "n-4", text: "Built and deployed retrieval-augmented generation systems at scale.", author: "Meera R.", createdAt: daysAgo(2) }],
    activity: [{ id: "a-4", from: "Screening", to: "Interview", at: daysAgo(2) }]
  },
  {
    id: "c-1005", name: "Rohan Kulkarni", email: "rohan.kulkarni@email.com", phone: "+91 98220 87654",
    role: "Backend Engineer", department: "Engineering", experience: 2, skills: ["Java", "Spring Boot", "MySQL", "Docker"],
    score: 78, stage: "Applied", appliedAt: daysAgo(0), linkedin: "https://linkedin.com", resume: "https://example.com/resume/rohan-kulkarni",
    rating: 0, notes: [], activity: []
  },
  {
    id: "c-1006", name: "Ishita Rao", email: "ishita.rao@email.com", phone: "+91 98450 22567",
    role: "Frontend Engineer", department: "Engineering", experience: 2, skills: ["Vue.js", "JavaScript", "CSS", "Accessibility"],
    score: 73, stage: "Rejected", appliedAt: daysAgo(12), linkedin: "https://linkedin.com", resume: "https://example.com/resume/ishita-rao",
    rating: 2, notes: [{ id: "n-6", text: "Good communication; role requires deeper React experience.", author: "Rahul K.", createdAt: daysAgo(8) }],
    activity: [{ id: "a-6", from: "Screening", to: "Rejected", at: daysAgo(8) }]
  },
  {
    id: "c-1007", name: "Arjun Desai", email: "arjun.desai@email.com", phone: "+91 98980 11022",
    role: "Product Manager", department: "Product", experience: 7, skills: ["Product Strategy", "SQL", "Roadmapping", "Analytics"],
    score: 90, stage: "Hired", appliedAt: daysAgo(21), linkedin: "https://linkedin.com", resume: "https://example.com/resume/arjun-desai",
    rating: 5, notes: [{ id: "n-7", text: "Accepted! Strong product sense and clear stakeholder leadership.", author: "Meera R.", createdAt: daysAgo(2) }],
    activity: [{ id: "a-7", from: "Offer", to: "Hired", at: daysAgo(2) }]
  },
  {
    id: "c-1008", name: "Sana Khan", email: "sana.khan@email.com", phone: "+91 98190 77889",
    role: "Data Analyst", department: "AI & Data", experience: 3, skills: ["SQL", "Python", "Tableau", "Statistics"],
    score: 85, stage: "Screening", appliedAt: daysAgo(3), linkedin: "https://linkedin.com", resume: "https://example.com/resume/sana-khan",
    rating: 0, notes: [], activity: []
  },
  {
    id: "c-1009", name: "Vikram Reddy", email: "vikram.reddy@email.com", phone: "+91 98490 34567",
    role: "DevOps Engineer", department: "Infrastructure", experience: 5, skills: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
    score: 93, stage: "Interview", appliedAt: daysAgo(5), linkedin: "https://linkedin.com", resume: "https://example.com/resume/vikram-reddy",
    rating: 4, notes: [{ id: "n-9", text: "Great incident response examples. Schedule platform deep dive.", author: "Priya S.", createdAt: daysAgo(1) }],
    activity: [{ id: "a-9", from: "Screening", to: "Interview", at: daysAgo(1) }]
  },
  {
    id: "c-1010", name: "Meera Joshi", email: "meera.joshi@email.com", phone: "+91 98230 45678",
    role: "Frontend Intern", department: "Engineering", experience: 1, skills: ["React", "JavaScript", "HTML", "CSS"],
    score: 81, stage: "Applied", appliedAt: daysAgo(1), linkedin: "https://linkedin.com", resume: "https://example.com/resume/meera-joshi",
    rating: 0, notes: [], activity: []
  },
  {
    id: "c-1011", name: "Aditya Bose", email: "aditya.bose@email.com", phone: "+91 98300 98765",
    role: "Full Stack Engineer", department: "Engineering", experience: 4, skills: ["TypeScript", "Node.js", "MongoDB", "Redis"],
    score: 69, stage: "Rejected", appliedAt: daysAgo(16), linkedin: "https://linkedin.com", resume: "https://example.com/resume/aditya-bose",
    rating: 2, notes: [{ id: "n-11", text: "Could not demonstrate expected database design depth.", author: "Meera R.", createdAt: daysAgo(12) }],
    activity: [{ id: "a-11", from: "Interview", to: "Rejected", at: daysAgo(12) }]
  },
  {
    id: "c-1012", name: "Nisha Patil", email: "nisha.patil@email.com", phone: "+91 98900 12345",
    role: "AI Engineer", department: "AI & Data", experience: 2, skills: ["Python", "TensorFlow", "NLP", "FastAPI"],
    score: 87, stage: "Offer", appliedAt: daysAgo(10), linkedin: "https://linkedin.com", resume: "https://example.com/resume/nisha-patil",
    rating: 4, notes: [{ id: "n-12", text: "Offer extended; candidate is considering and should respond this week.", author: "Priya S.", createdAt: daysAgo(1) }],
    activity: [{ id: "a-12", from: "Interview", to: "Offer", at: daysAgo(1) }]
  }
];
