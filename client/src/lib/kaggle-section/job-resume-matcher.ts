import { KaggleProject } from "../interfaces"

export const JobResumeMatcherKaggle: KaggleProject = 
  {
  id: "kaggle-1",
  title: "Job-Resume Matcher",
  date: "2025-12-10",
  githubUrl: "https://github.com/amJenish/Job-Resume-Matching",
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
  }