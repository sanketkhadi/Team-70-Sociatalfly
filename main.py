from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⚠️ PUT YOUR API KEY HERE (DO NOT SHARE PUBLICLY)
YOUTUBE_API_KEY = "AIzaSyDxtkKdGf9q8KeZs3GpP-eAUUsW_PodKFo"

# ---------------- MEMORY STORAGE ----------------
users = {}

# ---------------- REGISTER ----------------
@app.post("/register")
def register(data: dict):
    email = data["email"]
    password = data["password"]

    if email in users:
        return {"msg": "User already exists"}

    users[email] = password
    return {"msg": "Registered successfully"}

# ---------------- LOGIN ----------------
@app.post("/login")
def login(data: dict):
    email = data["email"]
    password = data["password"]

    if users.get(email) == password:
        return {"msg": "Login success"}

    return {"msg": "Invalid credentials"}

# ---------------- YOUTUBE FETCH ----------------
@app.get("/video")
def get_video(concept: str, subject: str, chapter: str):

    query = f"{concept} {subject} {chapter}"

    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": query,
        "key": YOUTUBE_API_KEY,
        "maxResults": 1,
        "type": "video"
    }

    res = requests.get(url, params=params).json()

    if "items" not in res or len(res["items"]) == 0:
        return {"error": "No video found"}

    item = res["items"][0]
    video_id = item["id"]["videoId"]

    return {
        "title": item["snippet"]["title"],
        "video_url": f"https://www.youtube.com/embed/{video_id}",
        "description": item["snippet"]["description"]
    }

# ---------------- AI ANALYSIS ----------------
@app.post("/analyze")
def analyze(data: dict):

    concept = data["concept"]

    summary = f"""
AI Explanation:
The topic {concept} is an important concept in this chapter.
It is used in real-world applications and helps understand the subject better.
"""

    questions = [
        f"What is {concept}?",
        f"Explain {concept} in simple words",
        f"Where is {concept} used?",
        f"Why is {concept} important?",
        f"Give one example of {concept}"
    ]

    return {
        "summary": summary,
        "questions": questions
    }

# ---------------- EVALUATION ----------------
@app.post("/evaluate")
def evaluate(data: dict):

    answer = data["answer"]

    if len(answer) < 5:
        return {
            "result": "wrong",
            "explanation": "Answer too short. Please explain in more detail."
        }

    return {
        "result": "ok",
        "explanation": "Good attempt. Try adding real-life example for better understanding."
    }