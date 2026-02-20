# 📋 Call Analyzer - Project Task Breakdown

---

## 🎯 Project Overview

AI-powered call summarization & QA system for telecom customer support centers. Combines React Native frontend, Node.js backend, and Gemini AI for automated call analysis.

---

## 📌 Execution Order (Sequential Phases)

### **PHASE 1: Infrastructure & Cloud Setup**

> Must be completed first - All components depend on this

#### Infrastructure Tasks

- [ ] **1.1** - Set up Google Cloud Project and enable required APIs
  - Enable Google Cloud Speech-to-Text API
  - Enable Vertex AI API
  - Enable Cloud Pub/Sub API
  - Enable BigQuery API
  - Enable Cloud Storage API

- [ ] **1.2** - Create BigQuery datasets and tables
  - Create dataset: `call_analysis`
  - Create table: `call_transcripts` (with schema from Readme)
  - Create table: `call_analysis` (with schema from Readme)
  - Create table: `agents` (with schema from Readme)

- [ ] **1.3** - Set up Google Cloud Storage bucket
  - Create bucket for audio files
  - Set appropriate access controls
  - Configure retention policies

- [ ] **1.4** - Configure Cloud Pub/Sub topics and subscriptions
  - Create topic: `audio-upload-events`
  - Create subscription: `transcription-worker-sub`
  - Configure message retention

- [ ] **1.5** - Set up service accounts and IAM permissions
  - Create service account for backend
  - Create service account for workers
  - Grant appropriate permissions (Storage, Pub/Sub, BigQuery, Speech-to-Text)
  - Generate and store service account keys

---

### **PHASE 2: Backend Setup & Core APIs**

> Starts after Cloud infrastructure is ready

#### Backend Foundation

- [ ] **2.1** - Initialize Node.js project structure
  - Create `backend/` directory
  - Initialize `package.json`
  - Set up directory structure (controllers, routes, services, workers, scheduler)
  - Create `.env.example` template

- [ ] **2.2** - Install core dependencies
  - Express.js
  - Google Cloud libraries (Storage, Pub/Sub, BigQuery, Speech-to-Text)
  - JWT authentication libraries
  - Environment variable management (dotenv)
  - Logging libraries
  - Additional utilities (multer, axios, etc.)

- [ ] **2.3** - Set up Express server and middleware
  - Create main server file (index.js or app.js)
  - Configure middleware (express.json(), cors, etc.)
  - Set up error handling middleware
  - Configure request logging

- [ ] **2.4** - Implement authentication & authorization
  - Set up JWT token generation
  - Create JWT verification middleware
  - Implement user authentication endpoints (basic auth)
  - Protect API routes with auth middleware

#### Backend APIs - Audio Upload

- [ ] **2.5** - Create `/upload` endpoint
  - Configure multer for file handling
  - Implement audio file validation
  - Store file in Cloud Storage
  - Generate unique call_id

- [ ] **2.6** - Implement Pub/Sub event publishing
  - Create event publisher service
  - Publish `audio-upload-events` when file is uploaded
  - Include metadata (call_id, agent_id, file_path)
  - Add error handling and retry logic

- [ ] **2.7** - Create call record in BigQuery
  - Create database service layer
  - Insert record into `call_transcripts` table
  - Set `analyzed = FALSE`
  - Return call_id to frontend

#### Backend APIs - Retrieval & Status

- [ ] **2.8** - Create `/calls` endpoint (list calls)
  - Query BigQuery for recent calls
  - Filter by date range, agent_id
  - Return paginated results

- [ ] **2.9** - Create `/calls/:id` endpoint (get call details)
  - Fetch transcript from BigQuery
  - Fetch analysis results from `call_analysis` table
  - Return combined response

- [ ] **2.10** - Create `/analysis/:id` endpoint
  - Get analysis results
  - Return summary, category, sentiment, score, improvements

- [ ] **2.11** - Create health check endpoint
  - `/health` - system status
  - Verify database connections
  - Verify Cloud service connectivity

#### Backend Services Layer

- [ ] **2.12** - Create transcription service
  - Implement Google Cloud Speech-to-Text integration
  - Function to transcribe audio file
  - Error handling for failed transcriptions

- [ ] **2.13** - Create analysis service
  - Implement Gemini API integration
  - Function to send transcript to Gemini
  - JSON parsing of response
  - Error handling for API failures

- [ ] **2.14** - Create BigQuery service
  - CRUD operations for all tables
  - Query builder for common queries
  - Connection pooling
  - Error handling

---

### **PHASE 3: Background Workers**

> Can start after backend APIs, parallel with Phase 4

#### Transcription Worker

- [ ] **3.1** - Create Pub/Sub subscriber for transcription
  - Listen to `audio-upload-events`
  - Download audio from Cloud Storage
  - Call transcription service

- [ ] **3.2** - Implement transcription processing
  - Handle response from Speech-to-Text API
  - Update `call_transcripts.transcript` field
  - Set `analyzed = FALSE` (ready for AI analysis)
  - Log processing status

- [ ] **3.3** - Implement error handling for transcription
  - Retry logic for failed transcriptions
  - Dead letter handling
  - Error logging and alerts

#### Scheduled AI Analysis Job

- [ ] **3.4** - Create scheduler service (Cron)
  - Set up job scheduler (runs every 10 minutes)
  - Query unanalyzed transcripts (LIMIT 10)
  - Orchestrate processing

- [ ] **3.5** - Implement batch processing
  - For each unanalyzed transcript:
    - Call analysis service (Gemini)
    - Parse structured JSON response
    - Insert into `call_analysis` table
    - Update transcript: `analyzed = TRUE`

- [ ] **3.6** - Implement error handling for AI analysis
  - Handle Gemini API failures
  - Handle parsing errors
  - Log failures for retry
  - Exponential backoff

- [ ] **3.7** - Implement processing metrics
  - Track processing time
  - Log success/failure rates
  - Monitor cost (API calls)
  - Alert on anomalies

---

### **PHASE 4: Mobile App**

> Starts after backend is functional (Phase 2+3 in progress)

#### Mobile App Foundation

- [ ] **4.1** - Initialize React Native (Expo) project
  - Create `frontend/` directory
  - Set up Expo project
  - Configure project structure (screens, components, navigation)

- [ ] **4.2** - Install mobile dependencies
  - React Navigation
  - Axios for API calls
  - JWT token storage (AsyncStorage)
  - Audio recording library (expo-av)
  - UI component libraries
  - Form handling libraries

- [ ] **4.3** - Set up project configuration
  - Create API base URL configuration
  - Set up environment variables
  - Configure navigation stack

#### Authentication

- [ ] **4.4** - Create authentication flow
  - Login screen with agent_id & password
  - Sign up screen (optional)
  - JWT token storage in AsyncStorage
  - Auto-login on app start

- [ ] **4.5** - Implement auth context/state management
  - Create auth context provider
  - Manage token lifecycle
  - Implement token refresh logic
  - Handle logout

#### Audio Recording & Upload

- [ ] **4.6** - Create audio recording screen
  - Implement audio recording functionality
  - Record button UI (start/stop)
  - Audio playback preview
  - Save recorded audio locally

- [ ] **4.7** - Create upload screen
  - Select recorded audio
  - Add agent_id metadata
  - Implement upload progress indicator
  - Show success/error messages

- [ ] **4.8** - Implement upload service
  - Create multipart form data
  - Upload to `/upload` endpoint
  - Retry logic on failure
  - Handle network errors

#### Call History & Results

- [ ] **4.9** - Create call history screen
  - List recent calls from `/calls` endpoint
  - Show call date, duration, status
  - Pull-to-refresh functionality
  - Pagination support

- [ ] **4.10** - Create call details screen
  - Display call transcript
  - Show analysis results (summary, category, sentiment, score)
  - Display improvements/coaching suggestions
  - Refresh button to check if analysis is complete

- [ ] **4.11** - Create result display components
  - Summary component
  - Sentiment indicator (visual)
  - Score display (1-10 rating)
  - Improvements list
  - Category badge

#### App Navigation & UI Polish

- [ ] **4.12** - Set up app navigation structure
  - Create navigation stack
  - Implement tab navigation (Upload, History)
  - Handle deep linking (optional)

- [ ] **4.13** - Create splash/loading screens
  - Splash screen on app launch
  - Loading indicators during API calls
  - Empty state screens

- [ ] **4.14** - Implement error handling & user feedback
  - Toast notifications for errors
  - User-friendly error messages
  - Offline mode handling
  - Session expiration handling

- [ ] **4.15** - Test mobile app end-to-end
  - Test on iOS simulator/device
  - Test on Android simulator/device
  - Test all screens and flows
  - Test error scenarios

---

### **PHASE 5: AI Model & Prompting**

> Can start after backend analysis service is ready

#### Gemini Prompt Engineering

- [ ] **5.1** - Design structured prompt template
  - Create JSON schema for output
  - Design summary instruction
  - Design classification categories
  - Design sentiment options
  - Design scoring criteria

- [ ] **5.2** - Implement prompt builder
  - Create function to build prompt with transcript
  - Include system context (telecom QA supervisor role)
  - Add output format instructions
  - Handle long transcripts (truncation if needed)

- [ ] **5.3** - Test and refine prompts
  - Test with sample transcripts
  - Validate JSON output consistency
  - Adjust prompts for accuracy
  - Document prompt versions

#### AI Integration

- [ ] **5.4** - Create Gemini API wrapper
  - Initialize Gemini client with Vertex AI
  - Create function to send transcript
  - Handle response parsing
  - Implement token counting (cost optimization)

- [ ] **5.5** - Implement response validation
  - Validate JSON structure
  - Validate field types and ranges
  - Set default values for missing fields
  - Log validation failures

- [ ] **5.6** - Add fallback strategies
  - Handle timeouts gracefully
  - Implement retry logic with backoff
  - Use cached results if available
  - Log all failures

---

### **PHASE 6: Analytics & Dashboard**

> Starts after data is being populated (Phase 3 running)

#### Analytics Setup

- [ ] **6.1** - Create analytics queries in BigQuery
  - Query: Average agent score (weekly/monthly)
  - Query: Top performing agents
  - Query: Sentiment distribution
  - Query: Call category breakdown
  - Query: Low-score alerts (< 5)

- [ ] **6.2** - Create Looker Studio dashboard
  - Connect to BigQuery dataset
  - Create scorecard: average agent score
  - Create table: top agents
  - Create pie chart: sentiment distribution
  - Create bar chart: call categories
  - Create time series: weekly trends

- [ ] **6.3** - Add dashboard filters
  - Filter by date range
  - Filter by agent_id
  - Filter by team
  - Filter by supervisor

- [ ] **6.4** - Add dashboard alerts
  - Alert on low agent scores
  - Alert on negative sentiment spikes
  - Email notifications to supervisors

---

### **PHASE 7: Deployment & Optimization**

> After all components are tested and working

#### Backend Deployment

- [ ] **7.1** - Create production environment configuration
  - Production `.env` file
  - Database connection pooling
  - Enable monitoring and logging
  - Set up error tracking (Sentry, etc.)

- [ ] **7.2** - Containerize backend (optional but recommended)
  - Create Dockerfile
  - Create docker-compose.yml
  - Push to Container Registry
  - Set up CI/CD pipeline

- [ ] **7.3** - Deploy backend to Cloud Run / App Engine
  - Configure auto-scaling
  - Set up health checks
  - Configure traffic splitting
  - Monitor deployment

#### Mobile App Deployment

- [ ] **7.4** - Prepare mobile app for release
  - Update version numbers
  - Create production build
  - Generate app signing keys
  - Configure API endpoints for production

- [ ] **7.5** - Deploy to app stores
  - Google Play Store
  - Apple App Store
  - Set up beta testing (TestFlight, Play Beta)

#### Cost Optimization

- [ ] **7.6** - Implement cost monitoring
  - Set up BigQuery cost alerts
  - Monitor Speech-to-Text costs
  - Monitor Gemini API costs
  - Optimize batch processing window

- [ ] **7.7** - Optimize data storage
  - Archive old transcripts (> 6 months)
  - Compress audio files
  - Enable BigQuery clustering
  - Set up retention policies

#### Security Hardening

- [ ] **7.8** - Implement security measures
  - Enable Cloud Armor for DDoS protection
  - Implement rate limiting on APIs
  - Mask PII in transcripts (optional)
  - Enable audit logging

- [ ] **7.9** - Set up monitoring & alerting
  - Create uptime monitors
  - Set up log alerts
  - Create incident response plan
  - Set up on-call rotations

---

### **PHASE 8: Testing & Documentation**

> Parallel throughout, finalized in Phase 7-8

#### Testing

- [ ] **8.1** - Unit tests for backend services
  - Test transcription service
  - Test analysis service
  - Test database service
  - Test Pub/Sub publisher

- [ ] **8.2** - Integration tests
  - Test upload → transcription → analysis flow
  - Test API endpoints
  - Test error scenarios
  - Test with sample data

- [ ] **8.3** - Mobile app unit tests
  - Test authentication logic
  - Test API integration
  - Test state management

- [ ] **8.4** - End-to-end tests
  - Test complete workflow (mobile to dashboard)
  - Test with real audio samples
  - Test error recovery

#### Documentation

- [ ] **8.5** - API documentation
  - Document all endpoints
  - Create OpenAPI/Swagger spec
  - Add request/response examples
  - Document authentication

- [ ] **8.6** - Architecture documentation
  - Create architecture diagrams
  - Document data flow
  - Document deployment procedures
  - Create troubleshooting guide

- [ ] **8.7** - User documentation
  - Agent user guide (mobile app)
  - Manager user guide (dashboard)
  - Admin setup guide
  - FAQ

- [ ] **8.8** - Developer documentation
  - Setup instructions
  - Development environment guide
  - Contributing guidelines
  - Local development procedures

---

### **PHASE 9: Monitoring & Maintenance**

> Post-deployment, ongoing

#### Production Monitoring

- [ ] **9.1** - Set up application monitoring
  - Application Performance Monitoring (APM)
  - Log aggregation (Cloud Logging)
  - Metrics dashboard
  - Alert thresholds

- [ ] **9.2** - Monitor AI quality
  - Track analysis accuracy (manual sampling)
  - Monitor token costs per call
  - Track processing latency
  - Identify common errors

#### Maintenance & Improvements

- [ ] **9.3** - Regular maintenance tasks
  - Review and optimize slow queries
  - Update dependencies monthly
  - Security patches
  - Database maintenance

- [ ] **9.4** - Gather feedback and iterate
  - Collect user feedback
  - Analyze usage patterns
  - Plan improvements
  - A/B test prompt changes

---

## 📊 Task Statistics

### By Component:

- **Infrastructure & Cloud**: 5 tasks
- **Backend**: 13 tasks
- **Workers**: 7 tasks
- **Mobile App**: 15 tasks
- **AI Model**: 6 tasks
- **Analytics & Dashboard**: 4 tasks
- **Deployment & Optimization**: 9 tasks
- **Testing & Documentation**: 8 tasks
- **Monitoring & Maintenance**: 4 tasks

**Total: 71 tasks**

---

## 🎯 Critical Path

The fastest route to an MVP (Minimum Viable Product):

1. ✅ Phase 1: Infrastructure (2-3 days)
2. ✅ Phase 2: Backend Core (3-4 days)
3. ✅ Phase 3: Workers (2-3 days)
4. ✅ Phase 4: Mobile App (3-4 days)
5. ✅ Phase 5: AI Prompting (1-2 days)
6. ✅ Phase 8: Testing (2-3 days)

**MVP Timeline: 2-3 weeks**

Phases 6, 7, 9 can be completed post-MVP.

---

## 🚀 Getting Started

1. Start with PHASE 1 - Set up all cloud infrastructure first
2. Use task IDs (1.1, 2.1, etc.) to track progress
3. Update this file as tasks are completed
4. Keep team informed of blockers
5. Document any deviations from plan

Good luck! 🎉
