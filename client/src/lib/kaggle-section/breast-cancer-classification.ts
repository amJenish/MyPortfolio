import { KaggleProject } from "../interfaces"

export const BreastCancerClassification: KaggleProject = 

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
  }