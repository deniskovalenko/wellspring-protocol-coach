# 🧠 Wellbeing Protocol Coach — PRD v0.1

## 🔥 Overview

**Goal:**  
Build a web-based MVP that takes in user wellbeing goals and constraints, then generates a personalized 5–7 day wellbeing protocol using science-backed techniques (inspired by Huberman, Bryan Johnson, Atomic Habits) and allows tracking completion/progress on the protocol, and get links to information to research further.

**Outcome:**  
A lightweight tool that:
- Collects inputs from users (goals, struggles, context)
- Uses LLM to generate a tailored wellbeing plan. Groq or Gemini as an example
- Lets users commit to small changes, similar to Atoms app. 
- delivers nudges and adapts goal automatically to simpler, if user fails initial committment

---

## 🎯 Problem Statement

Modern wellbeing knowledge is scattered across podcasts, books, and videos. 
People:
- Are not aware, that simple, behavioral low/no cost changes can drastically improve their wellbeing
- Are overwhelmed by choices, don't know where to sample knowledge from.
- Don't know where to start
- Struggle to commit and stick

There’s no assistant that *synthesizes knowledge into tailored, doable protocols* based on your unique needs.

---
💡 Core Features
1. User Input Form
Goal selection: (e.g., Sleep, Energy, Focus, Cravings, Mood, Longevity)
Top struggle: (free text)
Constraints:
Time per day (slider: 1–60 min)
Budget (low, medium, high)
2. Protocol Generation (LLM)
Generate a protocol with:
Protocol name
Summary of benefits
3–5 daily habits:
Name
Description
Why it works (short science summary)
3. Commitment Selection
User selects 1–3 habits to commit to.
User writes a free-form commitment: “I will do X by date Y.”
LLM extracts: habit, schedule, one-time actions, and follow-up date.
4. Progress Tracking
Calendar-style tracker:
Each commitment/habit is a row; days are columns.
User checks off habits daily.
Positive feedback (“Yay!” popup) on completion.
Weekly reflection:
User reviews progress and logs changes.
Option to commit to next week’s protocol.
🛠️ Tech Stack
Frontend: Expo (React  + Web), Tailwind CSS
Backend: Node.js/Express (for LLM proxy, if needed)
LLM: OpenAI GPT-4 API (or Groq/Gemini)
State: React Context + useReducer
Storage: Local device (AsyncStorage); no login required
Reminders: Expo Notifications (stretch goal)
✨ UX/UI Principles
Mobile-first: Use Expo/React  Web for cross-platform.
Minimal steps: 1–2 screens before protocol is generated.
Accessible: Large tap targets, readable fonts, dark mode.
Delightful: Positive language, simple icons/illustrations.
📝 MVP Feature List
Feature	Must Have	Nice to Have	Out of Scope
User Input Form	✅		
LLM Protocol Gen	✅		
Protocol Display	✅		
Commitment Selection	✅		
Progress Tracking	✅		
Reminders		✅	
Social Sharing			✅
🧪 Example GPT Prompt

You are a wellbeing protocol coach. The user provides a health goal and constraints. Return a 5–7 day protocol with 3–5 daily actions that are science-based, simple, and fit their constraints.

{
  "protocol_name": "Evening Reset Protocol",
  "summary": "Improve sleep quality by managing light, supplements, and routine.",
  "actions": [
    {
      "title": "Block Blue Light",
      "description": "Wear blue-light blocking glasses after 8pm.",
      "timing": "Evening",
      "why": "Reduces melatonin suppression and supports sleep onset."
    },
    ...
  ]
}