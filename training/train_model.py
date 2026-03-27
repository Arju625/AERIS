import pandas as pd
import pickle
import re
import nltk
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.feature_extraction.text import TfidfVectorizer

nltk.download('stopwords')

# -------- LOAD DATA --------
df = pd.read_csv("cleaned_emergency_data.csv")
df.rename(columns={"emergency_type": "type"}, inplace=True)
df = df.drop_duplicates()

stop_words = set(stopwords.words('english')) - {"help", "urgent", "now", "emergency", "immediately"}

def clean_text(text):
    if pd.isna(text):
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z ]', '', text)
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return " ".join(words)

df["clean_text"] = df["clean_text"].apply(clean_text)
df = df.dropna(subset=["clean_text", "type", "severity"])

# -------- FEATURES --------
X = df["clean_text"]
y_type = df["type"]
y_severity = df["severity"]

# -------- TF-IDF --------
vectorizer = TfidfVectorizer(max_features=3000)
X_vec = vectorizer.fit_transform(X)

# -------- TRAIN/TEST SPLIT --------
X_train, X_test, y_type_train, y_type_test = train_test_split(X_vec, y_type, test_size=0.2, random_state=42)
_, _, y_severity_train, y_severity_test = train_test_split(X_vec, y_severity, test_size=0.2, random_state=42)

# -------- TRAIN MODELS --------
type_model = LogisticRegression(max_iter=1000)
type_model.fit(X_train, y_type_train)

severity_model = LogisticRegression(max_iter=1000)
severity_model.fit(X_train, y_severity_train)

# -------- EVALUATION --------
print("\n📊 TYPE CLASSIFICATION REPORT")
print(classification_report(y_type_test, type_model.predict(X_test)))

print("\n📊 SEVERITY CLASSIFICATION REPORT")
print(classification_report(y_severity_test, severity_model.predict(X_test)))

# -------- SAVE --------
pickle.dump(vectorizer, open("tfidf_vectorizer.pkl", "wb"))
pickle.dump(type_model, open("emergency_model.pkl", "wb"))
pickle.dump(severity_model, open("severity_model.pkl", "wb"))

print("\n✅ Models + vectorizer saved successfully!")