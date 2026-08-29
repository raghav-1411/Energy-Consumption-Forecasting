/* Every number here is taken directly from the executed outputs in main.ipynb.
   Nothing is estimated or rounded up. */

const DATA = {
  dataset: {
    name: "Household Electric Power Consumption",
    source: "UCI Machine Learning Repository",
    rawRecords: 162495,
    rangeStart: "2006-12-16",
    rangeEnd: "2007-04-08",
    missingBefore: 69,
    hourlySamples: 2709,
    modelledSamples: 2373,
    features: 84,
    trainRows: 2017,
    testRows: 356,
    testSplit: 0.15
  },

  headline: {
    accuracy: 99.53,
    r2: 0.999981,
    mae: 0.003548,
    rmse: 0.004901,
    mape: 0.474987
  },

  /* Sorted by accuracy, exactly as printed by the final results table. */
  models: [
    { name: "Ridge Regression",  mae: 0.003548, rmse: 0.004901, r2: 0.999981, mape: 0.474987,  acc: 99.525013, family: "linear",   best: true },
    { name: "XGBoost",           mae: 0.014134, rmse: 0.021935, r2: 0.999615, mape: 1.289935,  acc: 98.710065, family: "boosting" },
    { name: "Gradient Boosting", mae: 0.013238, rmse: 0.019712, r2: 0.999689, mape: 1.352232,  acc: 98.647768, family: "boosting" },
    { name: "Stacking Ensemble", mae: 0.013800, rmse: 0.020258, r2: 0.999672, mape: 1.417773,  acc: 98.582227, family: "ensemble" },
    { name: "Random Forest",     mae: 0.014694, rmse: 0.022072, r2: 0.999611, mape: 1.499685,  acc: 98.500315, family: "bagging" },
    { name: "CatBoost",          mae: 0.025881, rmse: 0.048318, r2: 0.998134, mape: 2.207216,  acc: 97.792784, family: "boosting" },
    { name: "Lasso Regression",  mae: 0.089910, rmse: 0.104907, r2: 0.991203, mape: 13.757099, acc: 86.242901, family: "linear" }
  ],

  /* Held-out test predictions from the winning Ridge model.
     Two contiguous windows: the opening 20 hours and the closing 20 hours
     of the chronological test set. */
  predictions: {
    windowA: {
      label: "Test window opens",
      range: "24–25 Mar 2007",
      rows: [
        ["2007-03-24 18:00", 3.023200, 3.029423],
        ["2007-03-24 19:00", 5.015867, 5.026397],
        ["2007-03-24 20:00", 3.887800, 3.894679],
        ["2007-03-24 21:00", 3.240300, 3.245592],
        ["2007-03-24 22:00", 4.117867, 4.119299],
        ["2007-03-24 23:00", 4.137300, 4.135801],
        ["2007-03-25 00:00", 2.376533, 2.369191],
        ["2007-03-25 01:00", 2.322633, 2.310829],
        ["2007-03-25 02:00", 2.359733, 2.347205],
        ["2007-03-25 03:00", 2.358333, 2.345123],
        ["2007-03-25 04:00", 2.392100, 2.376070],
        ["2007-03-25 05:00", 2.501300, 2.487051],
        ["2007-03-25 06:00", 2.901167, 2.887708],
        ["2007-03-25 07:00", 2.322133, 2.314595],
        ["2007-03-25 08:00", 2.877900, 2.871147],
        ["2007-03-25 09:00", 2.681800, 2.674185],
        ["2007-03-25 10:00", 2.056800, 2.051501],
        ["2007-03-25 11:00", 0.676467, 0.681096],
        ["2007-03-25 12:00", 1.867600, 1.865691],
        ["2007-03-25 13:00", 1.778167, 1.776055]
      ]
    },
    windowB: {
      label: "Test window closes",
      range: "7–8 Apr 2007",
      rows: [
        ["2007-04-07 18:00", 0.969133, 0.970747],
        ["2007-04-07 19:00", 0.420400, 0.421480],
        ["2007-04-07 20:00", 0.344133, 0.343042],
        ["2007-04-07 21:00", 3.297033, 3.301494],
        ["2007-04-07 22:00", 3.338000, 3.338308],
        ["2007-04-07 23:00", 3.377867, 3.374635],
        ["2007-04-08 00:00", 2.790767, 2.784223],
        ["2007-04-08 01:00", 2.299000, 2.292788],
        ["2007-04-08 02:00", 2.344833, 2.337015],
        ["2007-04-08 03:00", 2.395900, 2.388686],
        ["2007-04-08 04:00", 2.329100, 2.322794],
        ["2007-04-08 05:00", 2.278633, 2.273198],
        ["2007-04-08 06:00", 1.830400, 1.827470],
        ["2007-04-08 07:00", 0.904833, 0.907922],
        ["2007-04-08 08:00", 0.584433, 0.595573],
        ["2007-04-08 09:00", 1.288633, 1.299058],
        ["2007-04-08 10:00", 0.702667, 0.719272],
        ["2007-04-08 11:00", 0.623300, 0.637706],
        ["2007-04-08 12:00", 0.568533, 0.581383],
        ["2007-04-08 13:00", 0.553590, 0.569226]
      ]
    }
  },

  errorStats: {
    mae: 0.0035,
    max: 0.0166,
    min: 0.0000,
    std: 0.0034,
    meanPct: 0.47
  },

  pipeline: [
    { step: "01", title: "Ingest",   detail: "162,495 minute-level meter readings parsed from semicolon-delimited raw text, datetime-indexed.", stat: "162,495 rows" },
    { step: "02", title: "Clean",    detail: "Extreme values trimmed at the 1st/99th percentile, then time-weighted interpolation with forward/backward fill.", stat: "69 → 0 gaps" },
    { step: "03", title: "Resample", detail: "Minute data aggregated to hourly — mean for continuous channels, sum for sub-metering. Sparse hours dropped.", stat: "2,709 hours" },
    { step: "04", title: "Engineer", detail: "Lags, rolling statistics, EWMAs, calendar flags and cyclical encodings built on the hourly series.", stat: "84 features" },
    { step: "05", title: "Model",    detail: "Chronological 85/15 split, StandardScaler, seven models trained and scored on untouched future hours.", stat: "356 test hours" }
  ],

  featureGroups: [
    { icon: "clock", title: "Lag features", items: ["1h, 2h, 3h, 6h, 12h", "24h — same hour yesterday", "168h — same hour last week", "336h — two weeks back"] },
    { icon: "window", title: "Rolling windows", items: ["Mean, std, min, max", "3h / 6h / 12h windows", "24h / 48h / 168h windows", "Shifted to avoid leakage"] },
    { icon: "wave", title: "EWMA", items: ["12h exponential mean", "24h exponential mean", "48h exponential mean", "Weights recent load higher"] },
    { icon: "calendar", title: "Calendar", items: ["Hour, day of week, month", "Quarter and weekend flag", "Night / morning / afternoon / evening", "Sin–cos cyclical encoding"] },
    { icon: "bolt", title: "Electrical", items: ["Voltage and intensity", "Global reactive power", "Sub-metering 1, 2, 3", "Derived apparent power"] }
  ],

  figures: [
    { file: "forecast-dashboard.png",     title: "Forecast dashboard",        caption: "Actual vs predicted across the full test horizon, with residuals and error distribution." },
    { file: "model-comparison.png",       title: "Model comparison",          caption: "MAE, RMSE, R² and accuracy side by side for all seven models." },
    { file: "eda-trends.png",             title: "Consumption trends",        caption: "Daily, weekly and monthly average load across the observation period." },
    { file: "weekly-hourly-pattern.png",  title: "Daily rhythm",              caption: "A one-week sample alongside the average load profile by hour of day." },
    { file: "correlation-heatmap.png",    title: "Correlation heatmap",       caption: "Relationships between every electrical channel in the raw dataset." },
    { file: "eda-distributions.png",      title: "Distributions & outliers",  caption: "Power and voltage distributions, boxplot outliers and missing-value density." },
    { file: "day-of-week.png",            title: "Weekday profile",           caption: "How average consumption shifts between weekdays and weekends." }
  ],

  stack: {
    "Language": ["Python 3"],
    "Data": ["pandas", "NumPy"],
    "Modelling": ["scikit-learn", "XGBoost", "CatBoost"],
    "Visualisation": ["Matplotlib", "Seaborn"],
    "Environment": ["Jupyter", "joblib"]
  },

  repo: "https://github.com/raghav-1411/Energy-Consumption-Forecasting"
};
