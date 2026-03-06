# 📞 AI-Powered Call Summarization & Quality Assurance System

## 🚀 Overview

An end-to-end AI-driven call quality monitoring system designed for telecom customer support centers.

This system automatically:

- 🎙 Transcribes customer service calls
- 📝 Summarizes conversations
- 🏷 Classifies call reasons
- 😊 Performs sentiment analysis
- ⭐ Rates agent performance
- 📊 Generates structured analytics
- 📈 Displays performance trends in a dashboard

The goal is to eliminate manual QA sampling and enable scalable, data-driven quality monitoring.

---

# 🎯 Problem Statement

Telecom operators handle thousands of calls daily. Manual quality assurance:

- Covers only a small percentage of calls
- Is time-consuming
- Misses patterns and recurring issues
- Lacks consistency in evaluation

This system automates QA using AI + cloud-native architecture.

---

# 🏗 High-Level Architecture (HLL)

## Architecture Style

- Event-driven pipeline
- Decoupled micro-service style components
- Cloud-native processing
- Batch AI analysis
- Analytics-first design

---

## 🔄 End-to-End Flow

React Native App
↓
Node Backend API
↓
Cloud Storage (audio files)
↓
RabbitMQ Queue
↓
Speech-to-Text Worker
↓
MongoDB (raw transcripts)
↓
Scheduled llama Job
↓
MongoDB (analysis results)
↓
Looker Studio Dashboard

---

# 🧩 Tech Stack

## 📱 Frontend

- React Native (Expo)
- JWT Authentication
- Axios

**Purpose:**

- Record audio
- Upload call files
- View summaries
- View performance insights (optional)

---

## ⚙ Backend

- Node.js
- Express.js
- REST APIs
- Service-based architecture
- Cron Scheduler

**Responsibilities:**

- Accept audio uploads
- Upload files to Cloud Storage
- Publish Pub/Sub events
- Trigger AI processing
- Manage pipeline orchestration

---

## ☁ Cloud Infrastructure

### Storage

- Google Cloud Storage  
  Stores raw audio files.

### Messaging

- Google Cloud Pub/Sub  
  Decouples upload from processing.

### Speech-to-Text

- Google Cloud Speech-to-Text API  
  Converts audio files to transcripts.

### Data Warehouse

- Mongodb
  Stores transcripts and AI analysis results.

### AI Analysis

- Vertex AI
- Gemini model

Performs:

- Summarization
- Call classification
- Sentiment detection
- Agent scoring
- Coaching suggestions

### Dashboard

- Looker Studio  
  Visualizes trends and performance metrics.

---

# 🗄 Database Schema (MongoDB)

## Table: `call_transcripts`

| Field      | Type      | Description             |
| ---------- | --------- | ----------------------- |
| call_id    | STRING    | Unique identifier       |
| agent_id   | STRING    | Agent handling call     |
| audio_path | STRING    | Cloud Storage path      |
| transcript | STRING    | Full transcript         |
| duration   | INT64     | Call duration (seconds) |
| analyzed   | BOOLEAN   | AI processed flag       |
| created_at | TIMESTAMP | Record creation time    |

---

## Table: `analyzed_calls`

| Field        | Type      | Description        |
| ------------ | --------- | ------------------ |
| call_id      | STRING    | Foreign key        |
| summary      | STRING    | AI summary         |
| category     | STRING    | Call reason        |
| sentiment    | STRING    | Customer sentiment |
| agent_score  | INT64     | Score (1–10)       |
| improvements | JSON      | JSON array         |
| processed_at | TIMESTAMP | AI processing time |

---

## Table: `agents`

| Field        | Type   |
| ------------ | ------ |
| agent_id     | STRING |
| name         | STRING |
| email        | STRING |
| department   | STRING |
| joining_date | DATE   |

---

# 🧠 AI Prompt Design

The system uses structured prompting to enforce JSON output.

### Example Prompt

You are a telecom QA supervisor.

Return STRICT JSON:

{
“summary”: “”,
“category”: “”,
“sentiment”: “”,
“agent_score”: number,
“improvements”: []
}

Transcript:
“””
{call transcript}
“””

This ensures:

- Predictable schema
- Reliable parsing
- Consistent analytics

---

# ⚙ Processing Workflow

## Step 1: Audio Upload

- App uploads audio to backend
- Backend stores file in Cloud Storage
- Pub/Sub event published

## Step 2: Transcription Worker

- Subscribes to Pub/Sub
- Sends audio to Speech-to-Text API
- Saves transcript in BigQuery
- Marks `analyzed = FALSE`

## Step 3: Scheduled AI Job

Runs every 10 minutes:

```sql
SELECT *
FROM call_transcripts
WHERE analyzed = FALSE
LIMIT 10;

---

For each record:
	•	Send transcript to Gemini
	•	Parse structured output
	•	Insert into call_analysis
	•	Mark transcript as analyzed

⸻

📊 Dashboard Metrics

Managers can view:
	•	📈 Average agent score per week
	•	🏆 Top performing agents
	•	😡 Sentiment distribution
	•	📊 Call category breakdown
	•	🚨 Low-score alerts
	•	📉 Weekly trends

⸻

💰 Cost Optimization Strategy

Designed for free / minimal cost:
	•	BigQuery free tier (10GB storage, 1TB queries)
	•	Limited daily processing
	•	Batch AI calls
	•	Transcript length control
	•	Billing alerts enabled

⸻

🔄 Future Upgrade Path

Phase 2 Enhancements
	•	Replace Gemini with local Ollama models
	•	Add role-based authentication
	•	Build custom React dashboard
	•	Add real-time streaming transcription
	•	Add compliance detection rules

⸻

🔐 Security Considerations
	•	Mask PII in transcripts
	•	Use dummy/sample audio
	•	Restrict IAM permissions
	•	Use service accounts
	•	Enable billing alerts

⸻

📁 Project Structure

backend/
  controllers/
  routes/
  services/
    transcriptionService.js
    analysisService.js
  workers/
  scheduler/

frontend/
  screens/
  components/
```
