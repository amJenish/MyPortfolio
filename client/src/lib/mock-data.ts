import heroBg from "@assets/main_images/main-bg.jpg";

export const profile = {
  name: "Jenish Paudel",
  role: "Computer Science Student @ Western University",
  bio: "I am interested in building reliable software and applying data science and machine learning concepts to solve real-world problems.",
  email: "jeni.paudel@gmail.com",
  github: "https://github.com/amJenish",
  linkedin: "https://www.linkedin.com/in/jenish-paudel-52687b260/",
  heroImage: heroBg
};

export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  videoUrl?: string;
  tags: string[];
  featured?: boolean;
  content: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
  abstract: string;
}

export interface KaggleProject {
  id: string;
  title: string;
  date: string;
  description: string;
  githubUrl: string;
}

export const projects: Project[] = [
    {
    id: "1",
    title: "Job-Resume Matcher",
    description: "ML project that implements a hybrid machine learning pipeline that combines semantic embeddings with handcrafted features to predict compatibility between resumes and job postings",
    githubUrl: "https://github.com/amJenish/Job-Resume-Matching",
    tags: ["Python", "scikit-learn", "pandas", "pytorch", "tensorflow", "NLP", "spacy", "feature-engineering", "hyperparameter-tuning", "xgboost", "MLP", "gradient-boosting", "Neurak Networks"],
    featured:true,
    content: `

## Project Overview  
This research implements a machine learning system for automated matching between resumes and job descriptions (JDs). The system combines semantic embeddings with handcrafted features to classify compatibility, addressing scalability and consistency challenges in recruitment screening.

## Objective  
To design, implement, and evaluate a machine learning pipeline that predicts resume-JD compatibility using a hybrid feature engineering approach and multiple classification models.

## Dataset  
The system uses two labeled datasets:
- **Training set**: \`train_JD_resume.csv\`  
- **Testing set**: \`test_JD_resume.csv\`  

### Label Schema  
- **Three-class**: "No Fit", "Potential Fit", "Good Fit"  
- **Binary**: 0 = "No Fit", 1 = "Fit" (merging "Potential" and "Good")

## Methodology  

### 1. Data Preprocessing  
- Filtered texts with fewer than 10 words  
- Converted to HuggingFace \`Dataset\` format  
- Encoded labels into numerical representations  

### 2. Feature Engineering  

#### A. Embedding-Based Features  
Used \`all-MiniLM-L12-v2\` SentenceTransformer to generate 384-dimensional embeddings for JDs and resumes. Derived features include:

- **Cosine similarity** between JD and resume embeddings  
- **Difference statistics**: mean, max, std of absolute differences  
- **Product statistics**: max and min of element-wise products  
- **Length ratio**: resume word count / JD word count  

#### B. Semantic Features (Rule-Based)  
Extracted domain-specific features using spaCy and regex:

- **Skill overlap**: Jaccard similarity of extracted skills  
- **Experience matching**: years of experience comparison  
- **Education level alignment**: degree requirement satisfaction  
- **Sentence similarity**: maximum cosine similarity between content-rich sentences  
- **Linguistic features**: noun/verb overlap, token-based Jaccard similarity  

### 3. Model Development  

#### Feature Sets Evaluated:  
1. **Basic**: 7 embedding-derived features  
2. **Extended**: 1536-dimensional concatenated embeddings + differences + products  
3. **Combined**: Extended features + semantic features  

#### Classifiers Tested:  
- Logistic Regression  
- Random Forest  
- XGBoost, LightGBM, CatBoost  
- Gradient Boosting variants  
- Multi-layer Perceptron (MLP)  

### 4. Training Pipeline  
1. Fine-tuned SentenceTransformer with \`CosineSimilarityLoss\`  
2. Extracted features from fine-tuned embeddings  
3. Scaled features using \`StandardScaler\`  
4. Trained classifiers with class weighting for imbalance  
5. Evaluated using stratified 80-20 validation split  

## Best Performing Model: MLP Classifier:  
- Hidden layers: (512, 256)  
- Activation: ReLU  
- Optimizer: Adam  
- Regularization: L2 (α=1e-4)  

## Key Findings  

  - The combined feature set (embeddings + semantic features) consistently outperformed either feature type alone.
  - MLP achieved the highest accuracy (87%), suggesting neural architectures are particularly suited for this high-dimensional, embedding-rich feature space.
  - Adapting the SentenceTransformer on domain data improved downstream classification performance by approximately 4% absolute accuracy.
  - Handcrafted features (skill overlap, experience matching) provided complementary information to embeddings, particularly for edge cases.

## Limitations  

  - Embedding generation requires significant resources.  
  - Semantic features rely on pattern matching that may not generalize across all domains.  
  - Reducing to binary classification loses nuance between "Potential" and "Good" fits.  

## Future Research Directions  

   - End-to-end transformer architectures specialized for resume-JD matching  
   - Multi-task learning incorporating both binary and multi-class objectives   
   - Domain adaptation techniques for different industries  

## Conclusion  

This study presents a comprehensive machine learning pipeline for automated resume-JD matching. The hybrid approach combining deep learning embeddings with rule-based semantic features proved effective, with the MLP classifier achieving 87% accuracy. The research contributes to automated recruitment literature by demonstrating:  

- The value of domain-specific feature engineering alongside general-purpose embeddings  
- The superiority of neural network architectures for this classification task  
- Practical methodologies for handling class imbalance and feature scaling  

While showing promise for reducing manual screening effort, further validation in real-world settings and exploration of ranking-based approaches would strengthen practical applicability.  


    
    `
  },
  {
    id: "2",
    title: "Geese-Map",
    description: "[Backend] A Springboot, Java & Python web-app that's a heatmap-based social interaction website, built using five different Microservices.",
    githubUrl: "https://github.com/amJenish/geese-map",
    tags: ["Java", "Springboot", "Python", "mySQL", "IBM Cloud Object Storage", "Roboflow API"],
    featured: true,
    content: `

A backend-focused, microservices-based system that powers a location-based social interaction heatmap. This project emphasizes service-oriented architecture, data pipelines, and applied machine learning integration.

The frontend is maintained in a separate repository and is demonstrated in the project video. As this was a group project, frontend implementation and maintenance were handled by other team members, while I was responsible for backend system design, service implementation, and data processing.

## Key Features
- Microservices-based backend architecture
- Image ingestion and cloud object storage
- Automated image verification via ML APIs
- Metadata extraction for location-based analysis
- Post orchestration and data aggregation for heatmap visualization

## Backend Services
- **AccountService** – User authentication and account management
- **ImageUploadService** – Stores images in IBM Cloud Object Storage and returns reference links
- **ImageVerificationService** – Validates image content using the Roboflow API (coded in python)
- **MetadataExtractionService** – Extracts structured metadata (location, time taken) from images
- **PostService** – Orchestrates post creation and aggregates data for frontend consumption

## Tech Stack
- Java
- Spring Boot
- Python
- IBM Cloud Object Storage
- Roboflow API
- Google Maps API
- RESTful Microservices
    `
  },
  {
    id: "3",
    title: "Student Enrollment System",
    description: "A backend-focused web application built with Java, Servlets, and a MySQL database to manage student enrollment, academic programs, and course prerequisites",
    githubUrl: "https://github.com/amJenish/StudentEnrollmentSystem",
    tags: ["Java", "SQL", "Servlets"],
    featured: false,
    content: `

A servlet-based backend application designed to manage academic administration workflows within an educational institution. This system implements a secure, multi-tiered platform supporting three user roles: Student, Professor, and Administrator, each with permissions and specialized functionality.

### **Technical Architecture**

- **Backend Framework**: Java Servlets implementing MVC architecture
- **Database**: MySQL
- **Communication Protocol**: HTTP Servlets
- **Authentication**: Role verification, secure password-hashing and access control
- **Data Layer**: JDBC for database connectivity with prepared statements

### **Role-Based System Design**

#### **Student Interface**
- **Course Enrollment**: Register for available courses with prerequisite validation
- **Program Management**: Select and track academic program requirements
- **Progress Monitoring**:  graphs for academic progress
- **Schedule Management**: View and modify personal course schedules

#### **Professor Interface**
- **Course Dashboard**: View all assigned courses with student rosters

#### **Administrator Interface**
- **Academic Structure Management**: Create and modify academic programs, courses, and prerequisites
- **Faculty Assignment**: Assign professors to courses with teaching load tracking
- **User Administration**: Invite, approve, and remove system users (students, professors, co-admins)
- **System Configuration**: Manage academic terms, enrollment periods, and system parameters

### **Core Functionality**

#### **Data Persistence **
-  All CRUD operations handled through dedicated servlets
- **Database Operations**: MySQL stored procedures for complex queries and data validation

#### **Business Logic Implementation**
- **Enrollment Validation**: Automated prerequisite checking and seat availability verification
- **Conflict Detection**: Schedule collision prevention during course registration


The platform serves as a foundational backend that could be extended with modern frontend frameworks while maintaining the servlet-based core for data integrity and business logic enforcement.
    `
  }, 

  {
  id: "4",
  title: "Cosmic Quest: Educational Math Game",
  description: "CosmicQuest is a space-themed educational game designed to teach addition, subtraction, multiplication, and division at an elementary school level. Students can create their own profiles & save their information as they progress through planets, learning the different subjects, and accruing a fuel score (this game's scoring metric) along the way.",
  githubUrl: "https://github.com/amJenish/Cosmic-Quest",
  tags: ["Java","Java Swing"],
  featured: false,
  content: `
  # CosmicQuest

## Description

CosmicQuest is a space-themed educational game designed to teach addition, subtraction, multiplication, and division at an elementary school level.

Students can create their own profiles, which will save their information as they progress through planets, learning the different subjects, and accruing a fuel score (this game's scoring metric) along the way. This score is displayed on a leaderboard, which will be accessible by all students within the classroom. Additionally, the game has built-in tutorials and a settings menu to allow for greater ease of use.

Teachers will be able to add/remove students from their class and will be able to view the progress of individual students.

Dev mode allows for debuggers to skip to any level and manually change their fuel score.

## Required Libraries and third-party tools

### To Run:
- Java SE - version 19 or above
    - Java Libraries:
        - Java.swing
        - Java.awt
        - Java.io
        - Java.util
        - Java.sound
- Windows 10

### To Build:
- Above tools
- A modern IDE that supports Java (e.g., Eclipse 4.26.0)

## Building the source code

1. Create a new project in your IDE of choice.
2. Download all the Java files alongside the avatars, images, and sounds folders.
3. Copy/move all the Java image files and folders into the src folder.
4. Run the class MainMenuScreen to generate the necessary text files in src (do not move these).
5. To rerun the program, rerun MainMenuScreen.

## User Guide

### Students:
- When first opening the program, the user will see a main menu with various buttons. These buttons are labeled and will take the user to different screens, which will have escape buttons to navigate back.
- Clicking on learn and leaderboard will take the user to the tutorial and class leaderboard respectively.
- Clicking on load will prompt the user to log in using a username and password. Alternatively, clicking new will prompt the user to create a new account.
- Once logged in, the user can then edit their settings using the settings menu, where they can toggle sound and change their profile avatar.
- To play the game, the user can click the play button where they will see their avatar, level map, and fuel score. They can then play any unlocked level where they will answer incoming questions of a certain type (determined by level) to gain score, unlocking the next level if they achieve a certain score threshold.
- The user can logout to return to the main menu and can quit the application from the main menu.

### Teachers:
- Instead of having access to settings and play, teachers have the ability to manage their class by adding/removing students, as well as the ability to view the stats of individual students. Creating a teacher account also generates a class code which will then be associated with the teacher and any student they add to their class.
To create a Teacher account:
1. Run the Jar file
2. Click on new
3. Enter a username and password
4. Select the teacher button 
5. Click on the checkmark
6. Login with your teacher account

### Devs:
- In dev mode, the user has access to everything the students would in addition to the ability to override their game progress, skipping to any level, and editing their fuel count. To access this mode, the user must log in with the username cs2212 and the password ducks2212.
  `
}
];

//Research--------------------------------------------------

export const researchPapers: ResearchPaper[] = [
  {
    id: "research-1",
    title: "Deconstructing the Support Vector Machine: A Mathematical Analysis",
    date: "2025-12-20",
    pdfUrl: "research_pdfs/Deconstructing SVMs.pdf",
    abstract: `
    This article provides a mathematical deconstruction of the Support Vector Machine (SVM) for classification, progressing systematically from the primal hard-margin formulation to its soft-margin and kernelized extensions. Using Lagrange multipliers, the dual optimization problem is derived, establishing the quadratic programming framework and Karush–Kuhn–Tucker (KKT) conditions that characterize the solution. For pedagogical clarity, a complete computational example is developed: a two-dimensional, non-linearly separable dataset is made separable via an explicit second-degree polynomial feature mapping. The dual problem is solved numerically to obtain the Lagrange multipliers, from which the optimal weight vector, bias, and support vectors are recovered, yielding a decision boundary that corresponds to a circle in the original space. The article concludes by connecting this explicit feature construction to the kernel trick, demonstrating how kernel methods preserve the same mathematical structure while avoiding explicit high-dimensional computations. The treatment unifies theory and implementation, offering a complete picture 
    of the SVM's mathematical foundation.
    `
  },
    {
    id: "research-2",
    title: "Architecture in the Age of Continuous Delivery",
    date: "2025-11-30",
    pdfUrl: "research_pdfs/Architecture_in_the_Age_of_Continuous_Delivery.pdf",
    abstract: `
    This article provides a systematic analysis of the architectural requirements and patterns necessary for implementing Continuous Delivery (CD). It begins by establishing the core principles of CD and contrasting them with traditional release models, highlighting how frequent, low-risk deployments depend on specific quality attributes: deployability, modifiability, testability, resilience, and observability.

The analysis progresses from monolithic architectures, where tight coupling and team dependencies obstruct CD, toward architectures that enable independent deployment and fast feedback loops. Using the conceptual frameworks of vertical slicing and microservices, the article demonstrates how decomposing systems along business capabilities reduces coordination overhead and aligns with team autonomy, a key enabler of continuous flow.

A complete architectural case study is developed: a monolithic application is decomposed into independently deployable services, each with its own database and deployment pipeline. This transformation is shown to enable rapid, reliable deployments by isolating changes, containing failures, and eliminating shared-state bottlenecks.

The article concludes by connecting these architectural patterns to the operational mindset shift required for CD: from treating operations as a separate phase to designing systems explicitly for deployment and operation from the outset. The treatment unifies architectural theory with practical implementation concerns, offering a complete framework for building systems that support continuous, confident delivery.
    `
  }
];



//Kaggle ------------------------------------------------------------------------------------
export const kaggleProjects: KaggleProject[] = [
  {
  id: "kaggle-1",
  title: "Job-Resume Matcher",
  date: "2025-12-10",
  description:
  `
  ## Project Overview  
This research implements a machine learning system for automated matching between resumes and job descriptions (JDs). The system combines semantic embeddings with handcrafted features to classify compatibility, addressing scalability and consistency challenges in recruitment screening.

## Objective  
To design, implement, and evaluate a machine learning pipeline that predicts resume-JD compatibility using a hybrid feature engineering approach and multiple classification models.

## Dataset  
The system uses two labeled datasets:
- **Training set**: \`train_JD_resume.csv\`  
- **Testing set**: \`test_JD_resume.csv\`  

### Label Schema  
- **Three-class**: "No Fit", "Potential Fit", "Good Fit"  
- **Binary**: 0 = "No Fit", 1 = "Fit" (merging "Potential" and "Good")

## Methodology  

### 1. Data Preprocessing  
- Filtered texts with fewer than 10 words  
- Converted to HuggingFace \`Dataset\` format  
- Encoded labels into numerical representations  

### 2. Feature Engineering  

#### A. Embedding-Based Features  
Used \`all-MiniLM-L12-v2\` SentenceTransformer to generate 384-dimensional embeddings for JDs and resumes. Derived features include:

- **Cosine similarity** between JD and resume embeddings  
- **Difference statistics**: mean, max, std of absolute differences  
- **Product statistics**: max and min of element-wise products  
- **Length ratio**: resume word count / JD word count  

#### B. Semantic Features (Rule-Based)  
Extracted domain-specific features using spaCy and regex:

- **Skill overlap**: Jaccard similarity of extracted skills  
- **Experience matching**: years of experience comparison  
- **Education level alignment**: degree requirement satisfaction  
- **Sentence similarity**: maximum cosine similarity between content-rich sentences  
- **Linguistic features**: noun/verb overlap, token-based Jaccard similarity  

### 3. Model Development  

#### Feature Sets Evaluated:  
1. **Basic**: 7 embedding-derived features  
2. **Extended**: 1536-dimensional concatenated embeddings + differences + products  
3. **Combined**: Extended features + semantic features  

#### Classifiers Tested:  
- Logistic Regression  
- Random Forest  
- XGBoost, LightGBM, CatBoost  
- Gradient Boosting variants  
- Multi-layer Perceptron (MLP)  

### 4. Training Pipeline  
1. Fine-tuned SentenceTransformer with \`CosineSimilarityLoss\`  
2. Extracted features from fine-tuned embeddings  
3. Scaled features using \`StandardScaler\`  
4. Trained classifiers with class weighting for imbalance  
5. Evaluated using stratified 80-20 validation split  

## Best Performing Model: MLP Classifier:  
- Hidden layers: (512, 256)  
- Activation: ReLU  
- Optimizer: Adam  
- Regularization: L2 (α=1e-4)  

## Key Findings  

  - The combined feature set (embeddings + semantic features) consistently outperformed either feature type alone.
  - MLP achieved the highest accuracy (87%), suggesting neural architectures are particularly suited for this high-dimensional, embedding-rich feature space.
  - Adapting the SentenceTransformer on domain data improved downstream classification performance by approximately 4% absolute accuracy.
  - Handcrafted features (skill overlap, experience matching) provided complementary information to embeddings, particularly for edge cases.

## Limitations  

  - Embedding generation requires significant resources.  
  - Semantic features rely on pattern matching that may not generalize across all domains.  
  - Reducing to binary classification loses nuance between "Potential" and "Good" fits.  

## Future Research Directions  

   - End-to-end transformer architectures specialized for resume-JD matching  
   - Multi-task learning incorporating both binary and multi-class objectives   
   - Domain adaptation techniques for different industries  

## Conclusion  

This study presents a comprehensive machine learning pipeline for automated resume-JD matching. The hybrid approach combining deep learning embeddings with rule-based semantic features proved effective, with the MLP classifier achieving 87% accuracy. The research contributes to automated recruitment literature by demonstrating:  

- The value of domain-specific feature engineering alongside general-purpose embeddings  
- The superiority of neural network architectures for this classification task  
- Practical methodologies for handling class imbalance and feature scaling  

While showing promise for reducing manual screening effort, further validation in real-world settings and exploration of ranking-based approaches would strengthen practical applicability.  


  `,
  githubUrl: "https://github.com/amJenish/Job-Resume-Matching"
  },
    {
    id: "kaggle-3",
    title: "Neural Network From Scratch",
    date: "2025-12-28",
    githubUrl: 'https://github.com/amJenish/Neural-Network-From-Scratch',
    description: `

built a neural network from scratch, only relying on numPy and math library for the production.

## About the project
The goal of this project is to learn and demonstrate the mathematics and inner mechanics of neural networks by building one from scratch. Unlike using high-level libraries like PyTorch or TensorFlow, this project focuses on implementing all essential components manually, providing a deeper understanding of:
- Neuron structure and computations
- Activation functions and their derivatives
- Loss functions and their gradients
- Forward and backward propagation
- Weight and bias updates during training

This project is for learning purposes and builds basic foundation for a custom neural network.

## Classes and Components

### 1. \`ActivationFunction\`  
Encapsulates different activation functions and their derivatives.  
Supported functions:  

- **Linear**: \( f(x) = x \)  
- **Sigmoid**: \( f(x) = \frac{1}{1 + e^{-x}} \)  
- **Tanh**: \( f(x) = \tanh(x) \)  
- **ReLU**: \( f(x) = \max(0, x) \)  
- **Leaky ReLU**: \( f(x) = x \text{ if } x>0 \text{ else } \alpha x \)  

**Purpose:** Easy extension to new activation functions and consistent gradient computation.

---

### 2. \`LossFunction\`  
Handles computation of loss and gradient for training.  

Supported functions:  

- **MSE (Mean Squared Error)**: Regression tasks  
- **MAE (Mean Absolute Error)**: Regression tasks  
- **Binary Cross-Entropy (BCE)**: Binary classification tasks  

**Purpose:** Centralized loss computation and gradient calculation for backpropagation.

---

### 3. \`Neuron\`  
Represents a single neuron in the network.

- Contains weight vector corresponding to the number of inputs (neurons in the previous layer)  
- Stores bias  
- Implements forward propagation through its activation function  
- Updates weights and bias using backpropagation with gradient clipping  

**Purpose:** Modular building block for constructing layers.

---

### 4. \`Network\`  
Represents a full feedforward neural network.

- Composed of layers of neurons  
- Implements forward propagation through all layers  
- Implements backward propagation for training  
- Methods:
  - \`fit()\`: Trains the network on given data for specified epochs  
  - \`predict()\`: Outputs predictions for new data  

**Purpose:** Provides end-to-end neural network training and inference.

---

## Features

- Fully manual implementation with no high-level ML libraries  
- Supports multiple activation and loss functions  
- Gradient clipping to stabilize training  
- Designed to best fit for binary classification tasks  
- Extensible for new layers, activation, or loss functions  
    `
  },
    {
    id: "kaggle-5",
    title: "Telco Customer Churn Prediction",
    date: "2026-01-24",
    githubUrl: 'https://github.com/amJenish/Telco-Customer-Churn-Prediction',
    description: ` 
## Project Overview

This project analyzes customer churn behavior using the Telco Customer
Churn dataset.\
The goal is to identify key factors influencing churn and build
predictive models to help businesses reduce customer attrition through
targeted retention strategies.

------------------------------------------------------------------------

## Objective

-   Predict whether a customer will churn (Yes/No).
-   Identify the most influential features contributing to churn.
-   Provide actionable business recommendations based on analytical
    findings.

------------------------------------------------------------------------

## Dataset Summary

-   **Total Records (after cleaning):** 7,032 customers\
-   **Target Variable:** \`Churn\` (binary classification)\
-   **Churn Rate:** \~26.6%

### Key Features:

-   Tenure
-   MonthlyCharges
-   TotalCharges
-   Contract type
-   Payment method
-   Internet service type
-   Online security / tech support
-   Paperless billing
-   Demographic indicators

------------------------------------------------------------------------

## Data Cleaning & Preparation

-   Converted \`TotalCharges\` to numeric and removed invalid entries.
-   Encoded categorical variables.
-   Engineered risk-related binary features:
    -   \`short_tenure\`
    -   \`month_to_month\`
    -   \`fiber_no_security\`
    -   \`no_support_services\`
    -   \`electronic_check_payment\`
-   Created a composite \`risk_score\` based on churn-related indicators.
-   Scaled numerical features where required.

------------------------------------------------------------------------

##  Exploratory Data Analysis (Key Insights)

-   Customers with **month-to-month contracts** churn more frequently.
-   **Short tenure (\<12 months)** customers show higher churn
    probability.
-   **Higher monthly charges** correlate with higher churn.
-   **Fiber optic users without security/support services** churn at
    higher rates.
-   **Electronic check payment users** churn more frequently.
-   Customers with dependents or partners are less likely to churn.

------------------------------------------------------------------------

## Models Evaluated

-   K-Nearest Neighbors (KNN)
-   Support Vector Machine (SVM)
-   Logistic Regression
-   Random Forest
-   Gradient Boosting (Final Model)

------------------------------------------------------------------------

## Model Performance (Test Set)

  Model                   Accuracy    ROC-AUC
  ----------------------- ----------- -----------
  KNN                     0.771       0.751
  SVM                     0.752       0.705
  Logistic Regression     0.767       0.836
  Random Forest           0.791       0.835
  **Gradient Boosting**   **0.795**   **0.836**

### Final Model: Gradient Boosting

-   Best overall accuracy
-   Strong ROC-AUC performance
-   Balanced precision and recall

Churn Class Metrics: - Precision: 0.652\
- Recall: 0.488\
- F1-Score: 0.559

------------------------------------------------------------------------

## Key Drivers of Churn (Feature Importance)

1.  Contract type (month-to-month)
2.  Tenure
3.  Risk score composite
4.  Fiber optic without security
5.  Monthly charges
6.  Electronic check payment

------------------------------------------------------------------------

## Business Recommendations

1.  Offer incentives to convert month-to-month customers to long-term
    contracts.
2.  Implement early engagement programs for new customers.
3.  Bundle internet security and tech support with fiber optic plans.
4.  Encourage automatic payment methods through discounts.
5.  Deploy the risk score for proactive customer outreach.

------------------------------------------------------------------------

## Limitations

-   Moderate class imbalance affects recall.
-   No cost-sensitive optimization included.
-   Snapshot-based data (no time-series behavior modeling).

------------------------------------------------------------------------

## 🚀 Future Improvements

-   Threshold tuning to maximize retention ROI.
-   Cost-sensitive learning implementation.
-   SHAP-based model explainability.
-   Deployment via web dashboard or API.

------------------------------------------------------------------------

## Tech Stack

-   Python
-   Pandas / NumPy
-   Scikit-learn
-   Matplotlib / Seaborn
-   Gradient Boosting & Random Forest Models

------------------------------------------------------------------------

## Conclusion

This project demonstrates a full end-to-end data science workflow: -
Data cleaning\
- Feature engineering\
- Exploratory analysis\
- Model comparison\
- Business-focused interpretation

The final model provides strong predictive performance and actionable
insights for reducing telecom customer churn.

  
    `
  
  },

  {
    id: "kaggle-2",
    title: "Breast Cancer Classification",
    date: "2025-12-12",
    githubUrl: 'https://github.com/amJenish/Breast-Cancer-Classification',
    description: `
## 1. Baseline Model
Algorithm: Logistic Regression (L2 regularization, standardized features)

Performance: 98% accuracy

Conclusion: Already strong, but motivated exploration of further improvements.

## 2. Feature-Split Strategy
Hypothesis: Since some features showed higher linear correlation to the target, perhaps separating them could allow tailored modeling:

Top correlated features → Logistic Regression (linear assumptions hold)

Remaining features → Non-linear model (Random Forest / XGBoost / MLP)

Combination: Weighted average of predictions from both models.

Results:

Best configuration reached ≈99.1% F1‑score

Minor gain over baseline, but not consistently reproducible across cross‑validation folds

100% scores observed in with combining MLP & LogisticRegression but suspected to be overfitting (validation instability).

## 3. Full-Feature Ensemble Approach
Revised hypothesis: Instead of splitting features artificially, train multiple model types on all features and combine their predictions to capture both linear and non‑linear relationships.

Methods tested:

Averaging predictions (soft‑voting) of Logistic Regression and Random Forest

Stacking with a meta‑learner (MLP classifier) to learn optimal combination

Final architecture:

text
Base Models:
  → Logistic Regression (L2 penalty, standardized inputs)
  → Random Forest (balanced class weight, sqrt max‑features)
  
Meta‑Learner:
  → MLP (one hidden layer, ReLU, Adam optimizer)
Outcome:

Stacking with an MLP meta‑learner delivered the most stable and highest validation performance

Achieved consistent near‑perfect metrics without signs of overfitting present in earlier experiments

Cross‑validation scores aligned closely with final held‑out test performance, confirming generalizability.

## 4. Key Takeaways
- Linear correlations alone were not enough to guide optimal feature partitioning.
- Model diversity (linear + tree‑based) proved more valuable than feature‑subset specialization.
- Stacking with a simple MLP as a meta‑learner successfully captured complementary patterns from both base models.
- Validation discipline (nested CV, clean train‑test splits) was critical to distinguish real gains from overfitting.

## 5. Final Model Performance
F1‑Score: ~99.2 on held‑out test set. (0 type-2 errors detected/No Malignant cases misclassified. One type-1 Error detected/One Benign case misclassified )

Conclusion: The stacked ensemble generalizes well and represents a reliable, if more complex, upgrade over standalone logistic regression.

    `
  }, {

      id : 'kaggle-4',
  title: 'Advanced Regression House PricePrediction',
  date: '2026-01-10',
  githubUrl: 'https://github.com/amJenish/House-Prices-Advanced-Regression',
  
  description: `

  #  Housing Price Prediction

Machine learning regression project predicting house sale prices using the Ames Housing dataset. Achieved **92.2% R² score** through systematic feature engineering, data exploration, and gradient boosting.

---

## Project Overview

This project predicts home prices using a set of data provided by Kaggle. The model achieves high accuracy by carefully selecting and engineering features that capture the key drivers of housing value.

### Key Results
- **R² Score**: 0.922 (92.2%)
- **Model**: XGBoost Gradient Boosting
- **Features**: hand-selected and engineered from 80+ original variables
- **Approach**: Feature selection, engineering, and target encoding

---

## Methodology

### 1. Data Exploration & Analysis
- Analyzed 1,460 residential properties with 80+ features
- Identified key price drivers through correlation analysis
- Examined distributions and relationships between variables
- Detected and handled missing values systematically

### 2. Feature Engineering

The project employs strategic feature engineering to extract maximum predictive power:

#### **Core Features (Hand-Selected)**
- \`OverallQual\` - Overall material and finish quality (1-10 scale)
- \`GrLivArea\` - Above grade living area square feet
- \`TotalBsmtSF\` - Total basement square footage
- \`GarageCars\` - Garage capacity
- \`1stFlrSF\`, \`2ndFlrSF\` - First and second floor square footage
- \`LotArea\` - Lot size in square feet
- \`LotFrontage\` - Linear feet of street connected to property

#### **Engineered Features**
| Feature | Description | Rationale |
|---------|-------------|-----------|
| \`is_single_fam_detached\` | Binary indicator for single-family homes | Single-family homes command premium prices |
| \`PorchArea\` | Total porch square footage | Outdoor living space adds value |
| \`hasPorch\` | Binary indicator for porch presence | Presence vs. absence matters |
| \`is_residential\` | Residential zoning indicator | Zoning significantly impacts value |
| \`HouseAge\` | Years since construction (YrSold - YearBuilt) | Age affects pricing non-linearly |
| \`BsmtHeight\` | Basement height quality metric | Basement quality drives value |
| \`PConc_in_Early_Era\` | Poured concrete foundation in pre-1940s homes | Foundation quality × era interaction |
| \`PConc_in_Modern_Era\` | Poured concrete foundation in post-1980s homes | Modern construction quality signal |
| \`NeighborhoodAvgPrice\` | Target-encoded neighborhood average | Location is critical for pricing |

#### **Feature Engineering Techniques**
- **Binary indicators**: Created flags for valuable features (single-family, porch presence, residential zoning)
- **Aggregations**: Combined related features (total porch area from multiple porch types)
- **Temporal features**: Calculated house age from construction and sale years
- **Era-based interactions**: Foundation type × construction period to capture quality improvements over time
- **Target encoding**: Neighborhood average prices (calculated only from training data to prevent leakage)

### 3. Data Preprocessing
- **Missing value handling**: Systematic imputation based on feature context
- **Feature selection**: Reduced from 80+ to 19 high-impact features
- **Data leakage prevention**: Target encoding applied post-split using only training data
- **Type consistency**: Ensured proper numeric types for all features

### 4. Model Selection & Training

**Primary Model: XGBoost Regressor**
- Chosen for superior performance on tabular data
- Handles non-linear relationships and feature interactions automatically
- Robust to outliers and missing values

**Hyperparameters:**
\`\`\`python

XGBRegressor(
    n_estimators=600,
    learning_rate=0.03,
    max_depth=5,
    subsample=0.7,
    colsample_bytree=0.9,
    objective="reg:squarederror",
    random_state=42,
    enable_categorical=False  

)
\`\`\`

**Note: these parameters were picked through Hyperparameter Tuning**

---


## Features

### Selected Original Features
- **OverallQual**: Overall material and finish quality (1-10)
- **GrLivArea**: Above grade living area (sq ft)
- **TotalBsmtSF**: Total basement area (sq ft)
- **GarageCars**: Garage capacity
- **1stFlrSF, 2ndFlrSF**: Floor square footages
- **LotArea**: Lot size (sq ft)
- **LotFrontage**: Street frontage (linear ft)
- **BsmtFinSF1**: Type 1 finished basement area
- **OverallCond**: Overall condition rating
- **WoodDeckSF**: Wood deck area

### Engineered Features
- **is_single_fam_detached**: Binary indicator for single-family homes
- **PorchArea**: Total porch square footage (all porch types combined)
- **hasPorch**: Binary indicator for porch presence
- **is_residential**: Residential zoning indicator
- **HouseAge**: Years since construction
- **BsmtHeight**: Basement height quality
- **PConc_in_Early_Era**: Poured concrete foundation × pre-1940 construction
- **PConc_in_Modern_Era**: Poured concrete foundation × post-1980 construction
- **NeighborhoodAvgPrice**: Target-encoded neighborhood values

---


## Data Preprocessing

### Missing Value Handling
Systematic imputation based on feature semantics and data context.

### Feature Selection
Reduced feature space through:
- Correlation analysis
- Domain knowledge
- Redundancy elimination
- Predictive power assessment

### Target Encoding
Neighborhood average prices calculated exclusively from training data to prevent data leakage:
\`\`\`python
# Calculate on training set only
neighborhood_avg = train_data.groupby('Neighborhood')['SalePrice'].mean()

# Apply to both sets
X_train['NeighborhoodAvgPrice'] = X_train['Neighborhood'].map(neighborhood_avg)
X_test['NeighborhoodAvgPrice'] = X_test['Neighborhood'].map(neighborhood_avg)
\`\`\`

---

## Results

**Performance Metrics**:
- R² Score: 0.924
- Test set size: 20% of total data
- Train/test split: Random state 42 for reproducibility

**Key Findings**:
- Location (neighborhood) is the strongest price predictor
- Construction era and foundation type interact to signal build quality
- Outdoor amenities (porches, decks) add measurable value
- Residential zoning and single-family status command premiums

---

## Future Improvements

**Potential Enhancements**:
- Ensemble methods (stacking XGBoost, LightGBM, Ridge)
- Polynomial features on top predictors

**Expected Impact**:
- Ensemble: +1-2% R²
- Additional features: +1-1.5% R²
- Hyperparameter tuning: +0.5-1% R²
- Target: 94-95% R²

---
  
  `
  
}, 
];

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
