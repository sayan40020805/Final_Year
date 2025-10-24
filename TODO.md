# SkillSphere Project TODO

## 1. Setup Phase
- [x] Create `backend/` folder and initialize Node.js project
- [x] Install backend dependencies (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, multer)
- [x] Create basic Express server with MongoDB connection using provided URI
- [x] Create `ml/` folder and set up Python virtual environment
- [x] Install ML dependencies (flask, scikit-learn, spacy, numpy, pandas)
- [x] Download spaCy model for NLP (e.g., en_core_web_sm)

## 2. Backend Development
- [x] Implement user authentication (JWT) and role-based access (Student, Organizer, Admin)
- [x] Create MongoDB models/schemas: User, Event, Registration
- [x] Build API routes: auth (login/register), users, events (CRUD), registrations
- [ ] Integrate Google Calendar API for event scheduling and notifications
- [x] Add middleware for authentication and role checks

## 3. ML Development
- [x] Create `ml/` folder and set up Python virtual environment
- [x] Install ML dependencies (flask, scikit-learn, spacy, numpy, pandas)
- [x] Download spaCy model for NLP (e.g., en_core_web_sm)
- [x] Develop resume parser script using spaCy to extract skills/interests
- [x] Build recommendation engine (content-based filtering) using Scikit-learn
- [x] Expose ML services as REST API using Flask
- [x] Train and save ML models for recommendations

## 4. Frontend Enhancement
- [x] Install React Router and Tailwind CSS in frontend
- [x] Restructure App.jsx with routing for dashboard, login, events, etc.
- [x] Create components: Login/Register, Dashboard, EventList, EventDetails, Profile, Recommendations
- [ ] Implement role-based UI rendering
- [x] Connect frontend to backend APIs for data fetching and authentication
- [ ] Add file upload for resumes and display recommendations

## 5. Integration and Testing
- [x] Connect backend to ML API for skill extraction and recommendations
- [ ] Test end-to-end workflow: Register → Upload resume → Get recommendations → Register for event → Calendar sync
- [x] Add error handling, input validation, and security measures
- [ ] Test authentication, role permissions, and API integrations
- [x] Optimize performance and add loading states

## 6. Deployment and Final Touches
- [ ] Set up environment variables for secrets (MongoDB URI, JWT secret, Google API keys)
- [ ] Deploy frontend to Vercel, backend to Railway/AWS, ML to cloud service
- [ ] Add unit tests for backend and ML components
- [ ] Create README with setup instructions and API documentation
- [ ] Final testing and bug fixes
