import { HiOutlineCodeBracket,HiOutlineTrophy,HiOutlineCpuChip,HiOutlineBolt,HiOutlinePaintBrush,HiOutlineSparkles,HiOutlineShieldCheck} from "react-icons/hi2";

export interface Lead{
  name:string,
  domain?:string,
  url?:string,
  image?:string
}


export const heads=[
  
  {
      name:"Kushagra Malviya",
      position:"Pr Lead",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/km_tg6lmk.png"
  },
  {
      name:"Devansh Khandelwal",
      position:"Head of Operations",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/dk_fqpjkp.png"
  },
  {
      name:"Chaitanya Chaurasia",
      position:"Treasurer",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/cc_kuwcph.png"
  },

]


export const domains = [
  {
    id:1,
    url:"sd",
    title: "Software Development",
    description:
      "Building scalable applications, system design, and full-stack development",
    icon: HiOutlineCodeBracket,
    leads:[
      {
        name:"Agnish Bhattacharya",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/ab_zmycia.png"
      },
      {
        name:"Aditya Singh",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/as_brd6vg.png"
      }
  ],
  cordinators:[
    {
     name:"Atul Pandey",
     domain:"Web Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/ap_p6khin.png"
    },
    {
     name:"Amitesh Anand",
     domain:"App Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/aa_h1uem1.png"
    },
    {
     name:"Ananya",
     domain:"Web Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/ana_hdgzbs.png"
    },
    {
     name:"Atharv Jain",
     domain:"Web Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/ajj_jnz8qo.jpg"
    },
    {
     name:"Kumar Mridul",
     domain:"Web Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/mk_ryxgcg.png"
    },
    {
     name:"Shubham Atri",
     domain:"Web Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/sa_h11a26.png"
    },
    {
     name:"Aarju",
     domain:"Web Development",
     image: "https://res.cloudinary.com/dlmfnwkon/image/upload/arj_i2bxbs.png"
    },
    
  
]

  },
  {
    id:2,
    url:"cp",
    title: "Competitive Programming",
    description:
      "Problem solving, algorithms, data structures, and coding competitions",
    icon: HiOutlineTrophy,
    leads: [],
    cordinators: [],
  },
  {
    id:3,
    url:"iot",
    title: "Internet of Things (IoT)",
    description:
      "Embedded systems, sensors, hardware-software integration, and smart devices",
    icon: HiOutlineCpuChip,
    leads: [],
    cordinators: [],
  },
  {
    id:4,
    url:"spark",
    title: "SPARK (Core Electronics)",
    description:
      "Circuit design, microcontrollers, digital systems, and electronics fundamentals",
    icon: HiOutlineBolt,
    leads: [],
    cordinators: [],
  },
  {
    id:5,
    url:"arcanum",
    title: "Arcanum (Web Design & Gaming)",
    description:
      "UI/UX design, creative web experiences, game design, and interactive media",
    icon: HiOutlinePaintBrush,
    highlight: true,
    leads: [],
    cordinators: [],
  },
  {
    id:6,
    url:"aiml",
    title: "AI & Machine Learning",
    description:
      "Data-driven intelligence, neural networks, and real-world AI applications",
    icon: HiOutlineSparkles,
    leads: [],
    cordinators: [],
  },
  {
    id:7,
    url:"cyber",
    title: "Cybersecurity",
    description:
      "Ethical hacking, system security, cryptography, and digital defense",
    icon: HiOutlineShieldCheck,
    leads: [],
    cordinators: [],
  },
];

export const donors = [
  {
    id: 1,
    name: 'John Doe',
    amount: 5000,
    image: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 2,
    name: 'Jane Doe',
    amount: 4750,
    image: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    name: 'Peter Jones',
    amount: 4500,
    image: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: 4,
    name: 'Sara Williams',
    amount: 3250,
    image: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: 5,
    name: 'David Brown',
    amount: 2100,
    image: 'https://i.pravatar.cc/150?u=5',
  },
  {
    id: 6,
    name: 'Emily Davis',
    amount: 7500,
    image: 'https://i.pravatar.cc/150?u=6',
  },
  {
    id: 7,
    name: 'Michael Miller',
    amount: 1000,
    image: 'https://i.pravatar.cc/150?u=7',
  },
  {
    id: 8,
    name: 'Jessica Wilson',
    amount: 750,
    image: 'https://i.pravatar.cc/150?u=8',
  },
  {
    id: 9,
    name: 'Chris Moore',
    amount: 500,
    image: 'https://i.pravatar.cc/150?u=9',
  },
  {
    id: 10,
    name: 'Ashley Taylor',
    amount: 250,
    image: 'https://i.pravatar.cc/150?u=10',
  },
];



export type Event = {
  id: number;
  date: string;
  category: string;
  title: string;
  description: string;
  eventurl : string;
};

export const eventsData: Event[] = [
  {
    id: 1,
    eventurl : "quasar-2",
    date: "March 2025",
    category: "College-Level Hackathon",
    title: "Quasar 2.0",
    description:
      "A high-energy hackathon bringing together students to collaborate, innovate, and build impactful technical solutions under real-world problem statements.",
  },
  {
    id: 4,
    eventurl : "houseofhackers",
    date: "January 2025",
    category: "Cybersecurity & Ethical Hacking Event",
    title: "House of Hackers",
    description:
      "A focused technical event designed to introduce students to cybersecurity concepts, ethical hacking practices, and real-world security challenges.",
  },
  {
    id: 3,
    eventurl : "sih25",
    date: "2025",
    category: "Internal Selection Hackathon",
    title: "Smart India Hackathon – Internal Hackathon 2025",
    description:
      "A continuation of the SIH internal selection process aimed at nurturing competitive teams and preparing students for national-level innovation challenges.",
  },
  
  {
    id: 2,
    eventurl : "sih24",
    date: "August 2024",
    category: "Internal Selection Hackathon",
    title: "Smart India Hackathon – Internal Hackathon 2024",
    description:
      "An internal hackathon conducted to shortlist and mentor teams for the Smart India Hackathon, focusing on problem-solving, teamwork, and innovation.",
  }
];




