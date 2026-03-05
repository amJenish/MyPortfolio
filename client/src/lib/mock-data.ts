import heroBg from "@assets/main_images/main-bg.jpg";


//Projects import -----------------
import { JobResumeMatcher } from "./project-section/job-resume-matcher"
import { StudentEnrollmentSystem } from "./project-section/student-enrollment-system"
import { GeeseMap} from "./project-section/geese-map";
import { CosmicQuest } from "./project-section/cosmic-quest";
import { AIStudyAssistant } from "./project-section/AI-study-assistant";
import { Project, KaggleProject, ResearchPaper} from "./interfaces"

//kaggle imports ------------------------------
import { AdvancedHouseRegression } from "./kaggle-section/advanced-house-regression";
import { BreastCancerClassification } from "./kaggle-section/breast-cancer-classification";
import { CropYieldPredictor } from "./kaggle-section/crop-yield-predictor";
import { CustomerChurnPrediction } from "./kaggle-section/customer-churn-prediction";
import { JobResumeMatcherKaggle } from "./kaggle-section/job-resume-matcher";
import { NeuralNetworkFromScratch } from "./kaggle-section/neural-network-from-scratch";

//paper imports ------------------------
import { architectureInCD } from "./paperworks/architecture-in-CD";
import { DeconstructingSVM } from "./paperworks/deconstructing SVMS";

export const profile = {
  name: "Jenish Paudel",
  role: "Computer Science Student @ Western University",
  bio: "I am interested in building reliable software and applying data science and machine learning concepts to solve real-world problems.",
  email: "jeni.paudel@gmail.com",
  github: "https://github.com/amJenish",
  linkedin: "https://www.linkedin.com/in/jenish-paudel-52687b260/",
  heroImage: heroBg
};



export const projects: Project[] = [ 
  AIStudyAssistant,
  JobResumeMatcher,
  GeeseMap,
  StudentEnrollmentSystem,
  CosmicQuest

];



//Kaggle ------------------------------------------------------------------------------------
export const kaggleProjects: KaggleProject[] = [
  CropYieldPredictor,
  NeuralNetworkFromScratch,
  CustomerChurnPrediction,
  AdvancedHouseRegression,
  JobResumeMatcherKaggle,
  BreastCancerClassification
  
];

export const researchPapers: ResearchPaper[] = [
  DeconstructingSVM,
  architectureInCD
]

export const skills = {
  languages: ["Java", "Python", "JavaScript", "C++", "SQL"],

  coreCS: [
    "Data Structures & Algorithms",
    "Object-Oriented Design",
    "Software Engineering Principles",
    "System Architecture",
    "Database Design & Management",
    "Concept of CI/CD"
  ],

  machineLearning: [
    "Neural Networks",
    "Support Vector Machines (SVMs)",
    "Supervised & Unsupervised Learning",
    "Model Evaluation & Optimization",
    "Feature Engineering"
  ],

  backendConcepts: [
    "RESTful APIs",
    "Client–Server Architecture",
    "Authentication & Authorization",
    "Concurrency & Multithreading",
    "Database Management",
    "Microservices Arhitecture"
  ]
};
