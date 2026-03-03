import pandas as pd
import re
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

# Load dataset
df = pd.read_csv("emergency_data.csv")

# Text cleaning function
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z ]', '', text)
    words = text.split()
    words = [w for w in words if w not in stopwords.words('english')]
    return " ".join(words)

df["clean_text"] = df["text"].apply(clean_text)

df.to_csv("cleaned_emergency_data.csv", index=False)

print("Cleaned dataset saved successfully!")

print(df.head())

from sklearn.feature_extraction.text import TfidfVectorizer

X_text = df["clean_text"]

vectorizer = TfidfVectorizer(max_features=3000)
X = vectorizer.fit_transform(X_text)

print("Shape of TF-IDF matrix:", X.shape)

