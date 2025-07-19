import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# === Load CSV ===
csv_file = "output_data.csv" 
df = pd.read_csv(csv_file)

print(f"Loaded dataset with {df.shape[0]} rows and {df.shape[1]} columns.")

# === Algorithm 1: Data Distribution Analysis ===
def data_distribution_summary(df):
    summary = {}
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            data = df[col].dropna()
            summary[col] = {
                "Mean": data.mean(),
                "Median": data.median(),
                "Mode": data.mode().iloc[0] if not data.mode().empty else None,
                "Min": data.min(),
                "Max": data.max(),
                "Range": data.max() - data.min(),
                "Variance": data.var(),
                "Std Dev": data.std()
            }
    return summary

summary_stats = data_distribution_summary(df)

print("\n=== Summary Statistics ===")
for var, stats in summary_stats.items():
    print(f"\nVariable: {var}")
    for k, v in stats.items():
        print(f"  {k}: {v}")

# === Algorithm 2: Visualization for Data Exploration ===
def visualize_data(df):
    numeric_cols = df.select_dtypes(include='number').columns
    categorical_cols = df.select_dtypes(exclude='number').columns

    # Histograms + Boxplots
    for col in numeric_cols:
        plt.figure(figsize=(10, 4))
        plt.subplot(1, 2, 1)
        plt.hist(df[col].dropna(), bins=20, color='skyblue', edgecolor='black')
        plt.title(f'Histogram of {col}')
        
        plt.subplot(1, 2, 2)
        sns.boxplot(x=df[col])
        plt.title(f'Boxplot of {col}')
        
        plt.tight_layout()
        plt.savefig(f'{col}_distribution.png')
        plt.close()

    # Scatterplots for numeric pairs
    for i in range(len(numeric_cols)):
        for j in range(i + 1, len(numeric_cols)):
            plt.figure(figsize=(6, 6))
            sns.scatterplot(x=df[numeric_cols[i]], y=df[numeric_cols[j]])
            plt.xlabel(numeric_cols[i])
            plt.ylabel(numeric_cols[j])
            plt.title(f'Scatterplot: {numeric_cols[i]} vs {numeric_cols[j]}')
            plt.savefig(f'{numeric_cols[i]}vs{numeric_cols[j]}_scatter.png')
            plt.close()

    # Bar charts for categorical variables (if any)
    for col in categorical_cols:
        plt.figure(figsize=(8, 4))
        df[col].value_counts().plot(kind='bar', color='lightcoral', edgecolor='black')
        plt.title(f'Bar Chart of {col}')
        plt.ylabel('Count')
        plt.savefig(f'{col}_barchart.png')
        plt.close()

    # Correlation heatmap
    if len(numeric_cols) > 1:
        corr = df[numeric_cols].corr()
        plt.figure(figsize=(8, 6))
        sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
        plt.title('Correlation Heatmap')
        plt.savefig('correlation_heatmap.png')
        plt.close()

# visualization
visualize_data(df)

print("\nSummary statistics printed and visualizations saved as PNG files!")