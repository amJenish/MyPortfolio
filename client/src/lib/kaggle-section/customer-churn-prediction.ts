import { KaggleProject } from "../interfaces"

export const CustomerChurnPrediction: KaggleProject = 
    {
    id: "kaggle-5",
    title: "Telco Customer Churn Prediction",
    date: "2026-01-24",
    githubUrl: 'https://github.com/amJenish/Telco-Customer-Churn-Prediction',
    description: ` 

## Project Overview

This project analyzes customer churn behavior using the Telco Customer
Churn dataset.
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

-   **Total Records (after cleaning):** 7,032 customers
-   **Target Variable:** \`Churn\` (binary classification)
-   **Churn Rate:** 26.6%

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
-   **Short tenure (<12 months)** customers show higher churn
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

Churn Class Metrics: - Precision: 0.652
- Recall: 0.488
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

##  Future Improvements

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
Data cleaning
- Feature engineering
- Exploratory analysis
- Model comparison
- Business-focused interpretation

The final model provides strong predictive performance and actionable
insights for reducing telecom customer churn.


    `
  
  }