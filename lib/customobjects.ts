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
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605161/IMG_1221_-_ADITYA_SINGH_qngv56.png"
      },
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
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766607814/ANANYA_ftwxyj.jpg"
    },
    {
     name:"Atharv Jain",
     domain:"Web Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/ajj_jnz8qo.jpg"
    },
    {
     name:"Kumar Mridul",
     domain:"Web Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605156/IMG_3359_-_KUMAR_MRIDUL_nglrxy.jpg"
    },
    {
     name:"Shubham Atri",
     domain:"Web Development",
     image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605158/IMG-20251128-WA0020_-_SHUBHAM_pqbeqt.jpg"
    },
    {
     name:"Aarju",
     domain:"Web Development",
     image: "https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605159/IMG-20251224-WA0058_-_AARJU_ha4pz2.jpg"
    },  
 ]
},

  {
    id:2,
    url:"aiml",
    title: "AI & Machine Learning",
    description:
      "Data-driven intelligence, neural networks, and real-world AI applications",
    icon: HiOutlineSparkles,
    leads: [
      {
        name:"Zayan Khan",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605160/WhatsApp_Image_2025-12-24_at_6.12.19_PM_-_ZAYAN_KHAN_ktkgyj.jpg"
      },
      {
        name:"Shashwat Yashasvi",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605155/IMG-20250127-WA0007_-_Shashwat_Yashasvi_sovwgb.jpg"
      },
    ],
    cordinators: [
      
      {
        name:"Shwetank Maurya",
        domain:"AI & Machine Learning",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605160/WhatsApp_Image_2025-12-24_at_17.03.29_-_Shwetank_Maurya_sxau9h.jpg"
     },
      {
        name:"Pankaj Gupta",
        domain:"AI & Machine Learning",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766412686/pg_j0e0xz.jpg"
     },
     {
        name:"Navodit Sahai",
        domain:"AI & Machine Learning",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605156/pic_-_NAVODIT_SAHAI_miuyb9.jpg"
     },
    ],
  },

  {
    id:3,
    url:"cp",
    title: "Competitive Programming",
    description:
      "Problem solving, algorithms, data structures, and coding competitions",
    icon: HiOutlineTrophy,
    leads: [
      {
        name:"Ayansh Raj",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/f4a29726-d70a-43b5-bf48-9e99168a4393_-_AYANSH_RAJ_ynijtj.jpg"
      },
      {
        name:"Udisha",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605157/20251217_155402_1_-_UDISHA_ehso3e.jpg"
      }
    ],
    cordinators:[
    {
      name:"Harsh Goel",
      domain:"Competitive Programming",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766761425/IMG_20251226_003411_-_HARSH_GOEL_je9gpv.png"
     },
    {
      name:"Smruti Ranjan Ray",
      domain:"Competitive Programming",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/IMG_20251128_044114_737_-_SMRUTI_RANJAN_RAY_vzcpfg.webp"
     },
    {
      name:"Pushp Raj",
      domain:"Competitive Programming",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605156/abcdefg_-_PUSHP_RAJ_y9uliv.png"
     },
    {
      name:"Ujjwal Kumar",
      domain:"Competitive Programming",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605157/ujjwal_photo_-_Ujjwal_Kumar_csvtgs.jpg"
     },
    {
      name:"Vedang Bhushan Masne",
      domain:"Competitive Programming",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766761426/20251226_170149_-_VEDANG_BHUSHAN_MASNE_a15fcs.jpg"
     },
    {
      name:"Aditya Kumar",
      domain:"Competitive Programming",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605157/Snapchat-188109786_-_ADITYA_KUMAR_xam033.jpg"
     },
    ],
  },
  {
    id:4,
    url:"iot",
    title: "Internet of Things and Robotics",
    description:
      "Embedded systems, sensors, hardware-software integration, and smart devices",
    icon: HiOutlineCpuChip,
    leads: [
      {
      name:"Kumar Anubhav",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766607024/unnamed_-_KUMAR_ANUBHAV_hd9njj.png"
    },
      {
      name:"Chaitanya Chaurasia",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/cc_kuwcph.png"
    },
    ],
    cordinators: [
      {
      name:"Vansh garg",
      domain:"Internet of Things and Robotics",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605155/1734851783170_-_VANSH_GARG_lwdwnj.jpg"
     },
      {
      name:"Dipankar Sinha",
      domain:"Internet of Things and Robotics",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605159/IMG20251218060229_-_DIPANKAR_SINHA_gwuhqa.jpg"
     },
    ],
  },
  
  {
    id:5,
    url:"arcanum",
    title: "Arcanum (Web Design & Gaming)",
    description:
      "UI/UX design, creative web experiences, game design, and interactive media",
    icon: HiOutlinePaintBrush,
    highlight: true,
    leads: [
      {
        name:"Pragati Ghosh",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605158/IMG_3971_-_PRAGATI_GHOSH_omdbct.jpg"
      },
      {
        name:"Kushagra Malviya",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605159/IMG_20251224_173535_-_KUSHAGRA_OMPRAKASH_MALVIYA_uelupp.jpg"
      },
    ],
    cordinators: [
      {
        name:"Aryan Trivedi",
        domain:"Arcanum",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766607025/photo_-_Aryan_Trivedi_rmzh05.jpg"
     },
    ],
  },
  {
    id:6,
    url:"cyber",
    title: "Cybersecurity",
    description:
      "Ethical hacking, system security, cryptography, and digital defense",
    icon: HiOutlineShieldCheck,
    leads: [
      {
        name:"Gyan Prakash",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766607025/heaven3_-_GYAN_PRAKASH_SINGH_JARUHAR_uqvafi.jpg"
      }
    ],
    cordinators: [
      {
      name:"Aakash Soni",
      domain:"Cybersecurity",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766607026/IMG_20251217_105611789_HDR_PORTRAIT_-_AAKASH_SONI_lzaro2.jpg"
     },
      {
      name:"Tirth savani",
      domain:"Cybersecurity",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605158/IMG_20251224_133227_-_tirth_savani_tz6vql.jpg"
     },
    ],
  },
  {
    id:7,
    url:"spark",
    title: "SPARK (Core Electronics)",
    description:
      "Circuit design, microcontrollers, digital systems, and electronics fundamentals",
    icon: HiOutlineBolt,
    leads: [
      {
        name:"Umang Khandelwal",
        image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766607025/IMG-20250918-WA0016_-_UMANG_KHANDELWAL_llxkqv.jpg"
      },
    ],
    cordinators: [
      {
      name:"Adwait Patwardhan",
      domain:"SPARK",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605158/IMG-20251223-WA0034_-_ADWAIT_PATWARDHAN_kdpfcg.jpg"
     },
      {
      name:"Rachit shukla",
      domain:"SPARK",
      image:"https://res.cloudinary.com/dlmfnwkon/image/upload/v1766605161/IMG_20251224_164239_-_RACHIT_SHUKLA_qfpik2.jpg"
     },
    ],
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




