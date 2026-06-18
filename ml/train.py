import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import joblib
import os

np.random.seed(42)
n_samples = 500

cgpa = np.round(np.random.uniform(5.0, 10.0, n_samples), 1)
aptitude = np.random.randint(30, 100, n_samples)
coding = np.random.randint(20, 100, n_samples)
projects = np.random.randint(0, 6, n_samples)
internships = np.random.randint(0, 4, n_samples)
skills_count = np.random.randint(1, 12, n_samples)
backlogs = np.random.randint(0, 5, n_samples)

placed = []
for i in range(n_samples):
    score = (
        (cgpa[i] - 5.0) / 5.0 * 30 +
        aptitude[i] / 100 * 25 +
        coding[i] / 100 * 25 +
        projects[i] / 5 * 10 +
        internships[i] / 3 * 5 +
        skills_count[i] / 11 * 5 -
        backlogs[i] * 3
    )
    prob = 1 / (1 + np.exp(-0.1 * (score - 40)))
    placed.append(1 if np.random.random() < prob else 0)

df = pd.DataFrame({
    'cgpa': cgpa,
    'aptitude_score': aptitude,
    'coding_score': coding,
    'projects_count': projects,
    'internships_count': internships,
    'skills_count': skills_count,
    'backlogs': backlogs,
    'placed': placed
})

print(f"Dataset created: {n_samples} samples")
print(f"Placed: {sum(placed)} | Not placed: {n_samples - sum(placed)}")
print(f"Placement rate: {sum(placed)/n_samples*100:.1f}%")
print()

X = df.drop('placed', axis=1)
y = df['placed']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    class_weight='balanced'
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model trained successfully!")
print(f"Accuracy: {accuracy*100:.2f}%")
print()
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=['Not Placed', 'Placed']))

feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("Feature Importance:")
print(feature_importance.to_string(index=False))

os.makedirs('model', exist_ok=True)
joblib.dump(model, 'model/placement_model.pkl')
joblib.dump(list(X.columns), 'model/feature_names.pkl')

print()
print("Model saved to model/placement_model.pkl")

sample = pd.DataFrame([{
    'cgpa': 7.5,
    'aptitude_score': 75,
    'coding_score': 70,
    'projects_count': 2,
    'internships_count': 1,
    'skills_count': 5,
    'backlogs': 0
}])

prob = model.predict_proba(sample)[0][1]
print(f"\nSample prediction (CGPA:7.5, Aptitude:75, Coding:70):")
print(f"Placement probability: {prob*100:.1f}%")
