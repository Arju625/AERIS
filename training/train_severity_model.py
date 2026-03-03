import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Load cleaned data
df = pd.read_csv("cleaned_emergency_data.csv")

X_text = df["clean_text"]
y = df["severity"]   # 👈 change here (severity instead of emergency_type)

# Vectorization
vectorizer = TfidfVectorizer(max_features=3000)
X = vectorizer.fit_transform(X_text)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train severity classifier
severity_model = LogisticRegression(max_iter=1000)
severity_model.fit(X_train, y_train)

# Evaluate
predictions = severity_model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print("Severity Model Accuracy:", accuracy)

# Save model
joblib.dump(severity_model, "severity_model.pkl")
joblib.dump(vectorizer, "severity_vectorizer.pkl")

print("Severity model saved successfully!")  