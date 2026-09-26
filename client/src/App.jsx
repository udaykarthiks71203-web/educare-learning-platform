import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";

import Register from "./pages/Register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/Profile";
import Courses from "./pages/courses";
import CourseDetails from "./pages/courseDetails";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Certificate from "./pages/Certificate";
import VerifyCertificate from "./pages/VerifyCertificate";
import Leaderboard from "./pages/Leaderboard";
import PythonCompiler from "./pages/PythonCompiler";

import "./App.css";

// ==========================================
// HOME PAGE
// ==========================================

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            🚀 SMART LEARNING PLATFORM
          </div>

          <h1>
            Learn Smarter.
            <br />
            <span>Grow Faster.</span>
          </h1>

          <p>
            Build valuable skills through structured courses,
            interactive lessons, assessments and
            achievement-based learning.
          </p>

          <div className="hero-buttons">

            <Link
              to="/courses"
              className="primary-button"
            >
              Explore Courses →
            </Link>

            <Link
              to="/register"
              className="secondary-button"
            >
              Start Learning
            </Link>

          </div>

          <div className="hero-trust">

            <div>
              <strong>24+</strong>
              <span>Lessons</span>
            </div>

            <div>
              <strong>🎯</strong>
              <span>Quizzes</span>
            </div>

            <div>
              <strong>🏆</strong>
              <span>Certificates</span>
            </div>

          </div>

        </div>

        {/* ================= HERO VISUAL ================= */}

        <div className="hero-visual">

          <div className="learning-card">

            <div className="learning-card-top">
              <span>FEATURED COURSE</span>
              <span>📚</span>
            </div>

            <h3>
              Python for Beginners
            </h3>

            <p>
              Learn Python programming from the basics,
              including variables, loops, functions and
              data structures.
            </p>

            <div className="course-preview-info">

              <div>
                <span>📖</span>
                <strong>24</strong>
                <small>Lessons</small>
              </div>

              <div>
                <span>⏱️</span>
                <strong>6 Weeks</strong>
                <small>Duration</small>
              </div>

              <div>
                <span>🎯</span>
                <strong>Beginner</strong>
                <small>Level</small>
              </div>

            </div>

            <Link
              to="/courses/6ab4c0f2d3dc102dacdd4a4c"
              className="hero-course-button"
            >
              Explore Course →
            </Link>

          </div>

          <div className="floating-card points-card">

            <span className="floating-icon">
              🎯
            </span>

            <div>
              <strong>Learn</strong>
              <small>At Your Own Pace</small>
            </div>

          </div>

          <div className="floating-card certificate-card">

            <span className="floating-icon">
              🏆
            </span>

            <div>
              <strong>Earn</strong>
              <small>Certificates</small>
            </div>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="features-section">

        <div className="section-heading">

          <p className="section-label">
            WHY EDUCARE
          </p>

          <h2>
            Everything you need to
            <span> keep learning.</span>
          </h2>

          <p>
            Educare brings courses, progress tracking,
            assessments and certificates together in
            one simple learning experience.
          </p>

        </div>

        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              📚
            </div>

            <h3>
              Structured Courses
            </h3>

            <p>
              Learn through organized courses with
              lessons arranged in a clear learning path.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Track Progress
            </h3>

            <p>
              Monitor completed lessons and see your
              learning progress from your dashboard.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              🎯
            </div>

            <h3>
              Test Your Knowledge
            </h3>

            <p>
              Complete assessments and test what you
              have learned throughout each course.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              🏆
            </div>

            <h3>
              Earn Certificates
            </h3>

            <p>
              Complete your course requirements and
              earn a certificate of completion.
            </p>

          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">

        <div className="section-heading">

          <p className="section-label">
            HOW IT WORKS
          </p>

          <h2>
            Your learning journey,
            <span> made simple.</span>
          </h2>

        </div>

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div>

              <h3>
                Choose a Course
              </h3>

              <p>
                Browse available courses and choose
                the skills you want to develop.
              </p>

            </div>

          </div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <div>

              <h3>
                Learn at Your Pace
              </h3>

              <p>
                Work through lessons and track your
                progress as you learn.
              </p>

            </div>

          </div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <div>

              <h3>
                Complete the Assessment
              </h3>

              <p>
                Test your understanding by completing
                the final course assessment.
              </p>

            </div>

          </div>

          <div className="step">

            <div className="step-number">
              04
            </div>

            <div>

              <h3>
                Earn Your Certificate
              </h3>

              <p>
                Complete the course and receive your
                Educare certificate.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="cta-section">

        <div className="cta-content">

          <p className="section-label">
            START YOUR JOURNEY
          </p>

          <h2>
            Ready to start learning?
          </h2>

          <p>
            Explore courses, build new skills and
            track your progress with Educare.
          </p>

          <Link
            to="/courses"
            className="cta-button"
          >
            Explore Courses →
          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-logo">
          Edu<span>care</span>
        </div>

        <p>
          Smart learning for a better future.
        </p>

        <div className="footer-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/courses">
            Courses
          </Link>

          <Link to="/leaderboard">
            Leaderboard
          </Link>

          <Link to="/verify-certificate">
            Verify Certificate
          </Link>

          <Link to="/login">
            Login
          </Link>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Educare Academy.
          All rights reserved.
        </div>

      </footer>

    </div>
  );
}


// ==========================================
// APP
// ==========================================

function App() {
  return (
    <BrowserRouter>

      {/* ======================================
          EDUCARE AI CHATBOT
      ====================================== */}

      <Chatbot />

      {/* ======================================
          APPLICATION ROUTES
      ====================================== */}

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* AUTHENTICATION */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* COURSES */}

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />

        {/* LESSONS */}

        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={<Lesson />}
        />

        {/* QUIZ */}

        <Route
          path="/courses/:courseId/quiz"
          element={<Quiz />}
        />

        {/* CERTIFICATE */}

        <Route
          path="/courses/:courseId/certificate"
          element={<Certificate />}
        />

        {/* PUBLIC CERTIFICATE VERIFICATION */}

        <Route
          path="/verify-certificate"
          element={<VerifyCertificate />}
        />

        {/* ======================================
            LEADERBOARD
        ====================================== */}

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        {/* ======================================
            PYTHON COMPILER
        ====================================== */}

        <Route
          path="/compiler"
          element={<PythonCompiler />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;