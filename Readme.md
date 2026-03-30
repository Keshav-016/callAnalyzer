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
RabbitMQ (transcription queue)
↓
Speech-to-Text Worker
↓
MongoDB (store transcript)
↓
RabbitMQ (analysis queue)   ← ADD THIS
↓
Llama Worker
↓
MongoDB (analysis results)
↓
Dashboard

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

**Responsibilities:**

- Accept audio uploads
- Upload files to Cloud Storage
- Publish Pub/Sub events
- Trigger AI processing
- Manage pipeline orchestration

---

### Speech-to-Text

- wisper
  Converts audio files to transcripts.

### Data Warehouse

- Mongodb
  Stores transcripts and AI analysis results.

### AI Analysis

- llama

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
- Saves transcript in Mongodb
- Marks `analyzed = FALSE`
- Add to queue(RabbitMQ) for analyzing 

## Step 3: Analyze Call

- Worker consumes message from RabbitMQ (analysis queue)
- Extract call_id from message
- Fetch transcript from database (BigQuery / MongoDB)

- Validate:
  - Transcript exists
  - analyzed = FALSE

-------------------------------
AI Processing
-------------------------------

- Build structured prompt (QA supervisor role)
- Send transcript to Gemini / LLM
- Expect STRICT JSON response:
  {
    "summary": "",
    "category": "",
    "sentiment": "",
    "agent_score": number,
    "improvements": []
  }

-------------------------------
Post Processing
-------------------------------

- Parse AI response
- Validate JSON:
  - Check required fields
  - Validate data types
- Handle failures:
  - Invalid JSON
  - Empty response
  - Partial fields

-------------------------------
Database Updates
-------------------------------

- Insert into analyzed_calls:
  - call_id
  - summary
  - category
  - sentiment
  - agent_score
  - improvements
  - processed_at

- Update transcript record:
  - analyzed = TRUE

-------------------------------
Error Handling & Retry
-------------------------------

- If AI call fails:
  - Retry (max 3 attempts, exponential backoff)

- If still failing:
  - Push to dead-letter queue
  - Log error for debugging

-------------------------------
Monitoring & Metrics
-------------------------------

- Track:
  - Processing time
  - Success / failure rate
  - API usage / cost

- Log all events for observability

-------------------------------
Optional Enhancements
-------------------------------

- Batch processing (5–10 transcripts per run)
- Rate limiting AI calls
- Priority queue (urgent calls first)
- Cache repeated transcripts


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

```
