# ⚡ Energy Consumption Forecasting using Machine Learning

## 📌 Project Overview
This project focuses on forecasting **household electricity consumption** using **machine learning–based time-series modeling**. The objective is to accurately predict **hourly Global Active Power (kW)** from historical household electrical measurements.

The project demonstrates a **professional end-to-end ML pipeline**, covering data analysis, preprocessing, feature engineering, model training, evaluation, and visualization.

---

## 🎯 Objectives
- Analyze household energy consumption patterns
- Clean and preprocess large-scale time-series data
- Engineer advanced time-dependent features
- Train and compare multiple machine learning models
- Build a high-accuracy forecasting system

---

## 📂 Dataset
- **Name:** Household Electric Power Consumption Dataset  
- **Source:** UCI Machine Learning Repository  
- **Link:** https://archive.ics.uci.edu/dataset/374/appliances+energy+prediction  

⚠️ **Dataset not included** in this repository due to large size.  
Please download it manually and place it in the project directory before running the notebook.

---

## 🔍 Exploratory Data Analysis (EDA)
- Distribution and outlier analysis of power and voltage
- Missing value analysis over time
- Correlation heatmap across electrical features
- Daily, weekly, and monthly consumption trends
- Time-series visualization of energy usage patterns

---

## 🧹 Data Cleaning & Preprocessing
- Extreme outlier removal using **1%–99% percentile IQR**
- Time-weighted interpolation for missing values
- Forward and backward filling for smoother continuity
- Removal of hours with insufficient raw readings
- Resampling minute-level data into **hourly aggregates**
  - Mean for continuous features
  - Sum for sub-metering readings

---

## 🧠 Feature Engineering
Over **80+ engineered features** were created:

### ⏱️ Lag Features
- lag_1h, lag_2h, lag_3h  
- lag_24h (previous day)  
- lag_168h (previous week)  
- lag_336h (previous fortnight)

### 📊 Rolling Window Features
Computed for 3h, 6h, 12h, 24h, 48h, 168h windows:
- Rolling mean
- Rolling standard deviation
- Rolling minimum
- Rolling maximum

### 📉 EWMA Features
- Exponential moving averages (12h, 24h, 48h)

### 🕒 Time-Based Features
- Hour of day
- Day of week
- Month, quarter
- Weekend flag
- Day segmentation (Night / Morning / Afternoon / Evening)

### 🔁 Cyclical Encoding
- Sin/Cos transformations for periodic time variables

### ⚡ Electrical Features
- Voltage
- Intensity
- Reactive power
- Sub-metering values
- Derived apparent power

---

## 🤖 Models Trained
The following regression models were implemented and compared:

- Ridge Regression  
- Lasso Regression  
- Random Forest Regressor  
- Gradient Boosting Regressor  
- XGBoost Regressor  
- CatBoost Regressor  
- **Stacking Ensemble** (XGBoost + CatBoost + Random Forest → Ridge)

All features were standardized using **StandardScaler**.

---

## 🏆 Model Performance
### ✅ Best Model: **Ridge Regression**
- **Accuracy:** ~99.53%  
- **RMSE:** Extremely low  
- **MAE:** Minimal  
- Stable predictions and strong generalization

### 📊 Model Comparison Summary
| Model | Accuracy | Notes |
|-----|--------|------|
| Ridge Regression | ~99.5%+ | Best performer |
| Stacking Ensemble | ~98.5%+ | Strong blended model |
| XGBoost | ~98.5% | Robust generalization |
| Random Forest | ~98.5% | Stable performance |
| CatBoost | ~97.5% | Handles non-linearity well |
| Gradient Boosting | ~97–98% | Strong baseline |
| Lasso Regression | <90% | Over-regularized |

---

## 📈 Visualizations
- Actual vs Predicted energy consumption plots
- Residual analysis
- Model comparison charts
- Time-series trend analysis

---

## 🛠️ Tech Stack
- **Languages:** Python  
- **Libraries:** NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn  
- **ML Models:** XGBoost, CatBoost  
- **Tools:** Jupyter Notebook  

---

## ▶️ How to Run the Project
1. Install dependencies:
   ```bash
   pip install pandas numpy matplotlib seaborn scikit-learn xgboost catboost joblib
