import pandas as pd
import re
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

# -------- LOAD DATA --------
df = pd.read_csv("emergency_data.csv")

# -------- CUSTOM STOPWORDS --------
custom_stopwords = set(stopwords.words('english')) - {"help", "urgent", "now"}

# -------- CLEAN TEXT --------
def clean_text(text):
    if pd.isna(text):
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z ]', '', text)
    words = text.split()
    words = [w for w in words if w not in custom_stopwords]
    return " ".join(words)

df["clean_text"] = df["text"].apply(clean_text)

# -------- REMOVE DUPLICATES --------
before = len(df)
df = df.drop_duplicates(subset=["clean_text"])
after = len(df)
print(f"🧹 Removed {before - after} duplicates")

# -------- SAVE CLEANED DATA --------
df.to_csv("cleaned_emergency_data.csv", index=False)
print("✅ Cleaned dataset saved!")