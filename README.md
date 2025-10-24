# SkillSphere - College Event Management Platform

A comprehensive platform for college event management with AI-powered personalization, connecting students with events that match their skills and interests.

## Features

### Core Functionality
- **Role-based Access Control**: Student, Organizer, and Admin roles with different permissions
- **Event Management**: Create, view, and manage college events
- **User Registration**: Secure user authentication and profile management
- **Event Registration**: Students can register for events they're interested in

### AI-Powered Features
- **Resume Parsing**: Extract skills and interests from uploaded resumes using NLP
- **Smart Recommendations**: AI-powered event recommendations based on user skills
- **Personalized Dashboard**: Tailored event suggestions for each user

### Additional Features
- **Google Calendar Integration**: Sync events to personal calendars
- **Real-time Notifications**: Event updates and reminders
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Machine Learning
- Python with Flask
- spaCy for NLP and resume parsing
- Scikit-learn for recommendation algorithms
- TensorFlow for advanced ML models

## Project Structure

```
final_year/
├── backend/                 # Node.js Express server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
├── ml/                     # Python ML services
│   ├── app.py             # Flask API server
│   ├── resume_parser.py   # Resume parsing logic
│   └── recommendation_engine.py
├── src/                    # React frontend
│   ├── components/         # React components
│   └── App.jsx            # Main app component
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://sayan:sayan4002@cluster0.3rtdspn.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
ML_API_URL=http://localhost:8000
```

4. Start the backend server:
```bash
npm start
```

### ML Service Setup

1. Navigate to the ML directory:
```bash
cd ml
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

6. Start the ML service:
```bash
python app.py
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd final_year
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (Organizer/Admin only)
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event (Organizer/Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations` - Get user's registrations
- `DELETE /api/registrations/:id` - Cancel registration

### ML Services
- `POST /api/ml/extract-skills` - Extract skills from resume
- `POST /api/ml/recommend-events` - Get event recommendations

## Usage

1. **Registration**: Create an account as a Student, Organizer, or Admin
2. **Login**: Sign in with your credentials
3. **Dashboard**: View all events and personalized recommendations
4. **Event Registration**: Register for events that interest you
5. **Resume Upload**: Upload your resume to get better recommendations
6. **Calendar Sync**: Events are automatically synced to your Google Calendar

## Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd final_year && npm test
```

### Building for Production
```bash
# Frontend build
cd final_year && npm run build

# Backend build (if using a build process)
cd backend && npm run build
```

## Deployment

### Frontend
Deploy to Vercel, Netlify, or any static hosting service.

### Backend
Deploy to Railway, Render, Heroku, or AWS.

### ML Service
Deploy to Railway, Render, or Google Cloud Run.

### Database
Use MongoDB Atlas for cloud database.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.
