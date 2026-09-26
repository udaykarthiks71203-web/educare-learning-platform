# Educare — Smart Learning Platform

Educare is a full-stack smart learning platform designed to provide an interactive and structured learning experience for students.

The platform combines course-based learning, lesson tracking, quizzes, progress management, certificates, leaderboards, an AI-powered learning assistant, and an integrated Python coding environment.

## Features

* 🔐 User registration and JWT-based authentication
* 📚 Course and lesson management
* 📝 Interactive quizzes
* 📈 Course progress tracking
* 🏆 Points and leaderboard system
* 🎓 Course completion certificates
* 🔎 Certificate verification
* 🤖 AI-powered learning chatbot
* 💻 Integrated Python code compiler
* 👤 User profile and learning information
* 🔔 Notification system
* 🐍 Python beginner course with structured lessons
* 📊 Automatic lesson and quiz progress updates

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* MongoDB
* Mongoose

### AI

* AI-powered chatbot integration
* Backend-based AI request handling

### Development Tools

* Git
* GitHub
* VS Code
* Postman

## System Architecture

```text
                    USER
                      │
                      ▼
             React Frontend
                      │
                      │ HTTP Requests
                      ▼
              Express.js API
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
       JWT Middleware      API Routes
             │                 │
             └────────┬────────┘
                      ▼
                  Mongoose
                      │
                      ▼
                   MongoDB
                      │
                      ▼
               JSON Response
                      │
                      ▼
                React UI
```

## Project Structure

```text
Educare/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Chatbot.jsx
│       │   ├── Chatbot.css
│       │   ├── Navbar.jsx
│       │   └── Navbar.css
│       │
│       ├── pages/
│       │   ├── Certificate.jsx
│       │   ├── Leaderboard.jsx
│       │   ├── Lesson.jsx
│       │   ├── Profile.jsx
│       │   ├── PythonCompiler.jsx
│       │   ├── Quiz.jsx
│       │   ├── Register.jsx
│       │   ├── VerifyCertificate.jsx
│       │   ├── courseDetails.jsx
│       │   ├── courses.jsx
│       │   ├── dashboard.jsx
│       │   └── login.jsx
│       │
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── certificate.js
│   │   ├── course.js
│   │   ├── notification.js
│   │   ├── quiz.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── certificateRoutes.js
│   │   ├── compilerRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── quizRoutes.js
│   │
│   ├── .env.example
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

## Authentication

Educare uses JWT-based authentication to protect user-specific resources.

The authentication flow is:

```text
User
 │
 ▼
Login Form
 │
 ▼
POST /api/auth/login
 │
 ▼
Express Authentication Route
 │
 ▼
MongoDB User Lookup
 │
 ▼
Password Verification
 │
 ▼
JWT Generation
 │
 ▼
JWT returned to Frontend
 │
 ▼
Protected API Requests
```

Protected requests include the JWT in the authorization header.

The backend middleware verifies the token before allowing access to protected resources.

Passwords are stored securely using password hashing rather than plain-text storage.

## Course and Lesson System

Courses contain structured lessons that users can complete sequentially.

The learning flow is:

```text
Course
   ↓
Lessons
   ↓
Lesson Content
   ↓
Examples
   ↓
Practice
   ↓
Lesson Completion
   ↓
Progress Update
   ↓
Quiz
   ↓
Certificate
```

The Python course contains structured beginner-level lessons covering topics such as:

* Python fundamentals
* Variables
* Data types
* Input and output
* Operators
* Conditional statements
* Loops
* Strings
* Lists
* Tuples
* Sets
* Dictionaries
* Functions
* Exception handling
* File handling
* Modules
* Object-oriented programming

## Progress Tracking

Educare tracks learning progress for each user.

Progress is calculated based on completed lessons:

```text
Progress =
Completed Lessons / Total Lessons × 100
```

For example:

```text
6 completed lessons
24 total lessons

Progress = 25%
```

Progress is stored in MongoDB so that it remains available when the user logs out and logs back in.

## Gamification

The platform includes a points-based learning system.

Users can earn points by completing learning activities.

Example:

```text
Lesson Completion → +10 points
Quiz Pass         → +50 points
```

The leaderboard retrieves users based on their accumulated points and displays their ranking.

## Quiz System

Courses can include quizzes to evaluate learner understanding.

The quiz system supports:

* Questions and answer options
* Score calculation
* Correct answer tracking
* Pass/fail evaluation
* Quiz attempt storage
* Points for successful completion

Quiz results are associated with individual users.

## Certificate System

After completing the required learning activities, users can receive course completion certificates.

The platform also includes certificate verification functionality.

The certificate flow is:

```text
Complete Lessons
      ↓
Complete Quiz
      ↓
Meet Completion Requirements
      ↓
Generate Certificate
      ↓
Verification ID
      ↓
Certificate Verification
```

## AI Learning Assistant

Educare includes an AI-powered chatbot that helps learners interact with the platform.

The chatbot can be used for:

* Learning questions
* Concept explanations
* Course-related assistance
* Programming-related questions
* General learning guidance

The AI request is handled through the backend rather than exposing AI configuration directly in the React frontend.

```text
User Question
      ↓
React Chatbot
      ↓
POST /api/ai/...
      ↓
Express Backend
      ↓
AI Service / Model
      ↓
Generated Response
      ↓
Express API
      ↓
React Chatbot
```

## Python Compiler

Educare includes an integrated Python coding environment that allows learners to practice Python without leaving the platform.

The compiler feature allows users to:

1. Enter Python code
2. Submit the code
3. Send the code to the backend
4. Execute it through the configured compiler environment
5. Display the output or error

```text
Python Code
     ↓
React Compiler
     ↓
POST /api/compiler/...
     ↓
Backend
     ↓
Python Execution
     ↓
Output / Error
     ↓
React UI
```

## REST API Structure

The backend is organized using REST-style API routes.

Examples include:

```text
POST   /api/auth/login
POST   /api/auth/register

GET    /api/courses

POST   /api/courses/:id/enroll

POST   /api/courses/:courseId/lessons/:lessonId/complete

GET    /api/leaderboard
```

The exact available routes are implemented inside the `server/routes` directory.

## Database Models

MongoDB is used as the primary database.

Main collections/models include:

```text
User
Course
Quiz
Certificate
Notification
```

Mongoose is used to define schemas and interact with MongoDB.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/udaykarthiks71203-web/educare-learning-platform.git
```

### 2. Open the project

```bash
cd educare-learning-platform
```

### 3. Install root dependencies

```bash
npm install
```

### 4. Install client dependencies

```bash
cd client
npm install
```

### 5. Install server dependencies

Open another terminal:

```bash
cd server
npm install
```

## Environment Variables

Create:

```text
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Never commit the actual `.env` file to GitHub.

A sample configuration is provided in:

```text
server/.env.example
```

## Running the Application

### Start Backend

From the `server` directory:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Start Frontend

From the `client` directory:

```bash
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

## Security Considerations

* JWT authentication is used for protected API requests.
* Passwords should never be stored as plain text.
* Environment variables are excluded from Git using `.gitignore`.
* AI configuration is handled through the backend.
* User-specific progress is associated with authenticated users.
* Backend validation is used for protected operations.

## Future Enhancements

Potential improvements include:

* Retrieval-Augmented Generation (RAG) using course content
* Personalized learning recommendations
* More programming languages in the compiler
* Advanced analytics dashboard
* Course creation interface for instructors
* Admin dashboard
* More detailed learning analytics
* Improved AI-based learning recommendations
* Cloud deployment
* Automated testing and CI/CD

## Learning Outcomes

This project demonstrates practical experience with:

* Full-stack web development
* React application development
* REST API development
* Node.js and Express.js
* MongoDB and Mongoose
* JWT authentication
* API integration
* AI integration
* CRUD operations
* User progress tracking
* Database modeling
* Frontend-backend communication
* Git and GitHub
* Python execution integration

## Author

**Uday Karthik S**

Computer Science Engineering Graduate

GitHub:
https://github.com/udaykarthiks71203-web
