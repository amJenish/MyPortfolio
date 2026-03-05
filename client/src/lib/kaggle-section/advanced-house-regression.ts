import { KaggleProject } from "../interfaces";

export const AdvancedHouseRegression : KaggleProject = 
    {

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
  
}