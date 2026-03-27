import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# -------- LOAD CLEANED DATA --------
df = pd.read_csv("cleaned_emergency_data.csv")
df = df.dropna(subset=["clean_text", "severity"])
df = df[df["clean_text"].str.strip() != ""]

X_text = df["clean_text"]
y = df["severity"]

# -------- LOAD EXISTING VECTORIZER --------
vectorizer = joblib.load("tfidf_vectorizer.pkl")
X = vectorizer.transform(X_text)

# -------- TRAIN/TEST SPLIT --------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------- TRAIN MODEL --------
severity_model = LogisticRegression(max_iter=1000)
severity_model.fit(X_train, y_train)

# -------- EVALUATE --------
predictions = severity_model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"✅ Severity Model Accuracy: {accuracy:.4f}")
print("\n📊 Classification Report:")
print(classification_report(y_test, predictions))

# -------- SAVE --------
joblib.dump(severity_model, "severity_model.pkl")
print("✅ Severity model saved successfully!")