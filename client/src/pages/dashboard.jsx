import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================
  // FETCH USER
  // ======================================

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await response.json();

        setUser(data);
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />

        <div className="dashboard-container">
          <div className="dashboard-loading">
            <div className="dashboard-loading-spinner"></div>

            <h2>
              Loading dashboard...
            </h2>

            <p>
              Please wait while we load your
              learning progress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================
  // NO USER
  // ======================================

  if (!user) {
    return null;
  }

  // ======================================
  // USER DATA
  // ======================================

  const enrolledCourses =
    user.enrolledCourses || [];

  const courseProgress =
    user.courseProgress || [];

  // ======================================
  // COMPLETED COURSES
  // ======================================

  const completedCourses =
    courseProgress.filter(
      (course) =>
        course.courseCompleted === true ||
        (
          course.progress === 100 &&
          course.quizCompleted === true
        )
    ).length;

  // ======================================
  // GET CONTINUE LEARNING LINK
  // ======================================

  const getContinueLink = (
    course,
    progressData
  ) => {
    const lessons =
      course.lessonList || [];

    if (lessons.length === 0) {
      return `/courses/${course._id}`;
    }

    const completedLessonIds =
      progressData?.completedLessons || [];

    const nextLesson =
      lessons.find(
        (lesson) =>
          !completedLessonIds.some(
            (completedLesson) =>
              completedLesson.toString() ===
              lesson._id?.toString()
          )
      );

    if (nextLesson) {
      return `/courses/${course._id}/lessons/${nextLesson._id}`;
    }

    return `/courses/${course._id}`;
  };

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="dashboard-page">

      {/* ==================================
          NAVBAR
      ================================== */}

      <Navbar />

      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main className="dashboard-container">

        {/* ==================================
            WELCOME HEADER
        ================================== */}

        <section className="dashboard-welcome">

          <div className="dashboard-welcome-content">

            <p className="dashboard-label">
              STUDENT DASHBOARD
            </p>

            <h1>
              Welcome back, {user.name}! 👋
            </h1>

            <p className="dashboard-welcome-text">
              Continue your learning journey
              and keep building your skills.
            </p>

          </div>

          <div className="dashboard-welcome-badge">
            <span>🎓</span>

            <div>
              <strong>
                Keep Learning
              </strong>

              <small>
                Your progress matters
              </small>
            </div>
          </div>

        </section>

        {/* ==================================
            STATS
        ================================== */}

        <section className="dashboard-stats">

          {/* ENROLLED COURSES */}

          <div className="stat-card">

            <div className="stat-icon stat-icon-blue">
              📚
            </div>

            <div className="stat-content">
              <span>
                Enrolled Courses
              </span>

              <strong>
                {enrolledCourses.length}
              </strong>
            </div>

          </div>

          {/* OVERALL PROGRESS */}

          <div className="stat-card">

            <div className="stat-icon stat-icon-purple">
              📈
            </div>

            <div className="stat-content">
              <span>
                Overall Progress
              </span>

              <strong>
                {user.progress || 0}%
              </strong>
            </div>

          </div>

          {/* LEARNING POINTS */}

          <div className="stat-card">

            <div className="stat-icon stat-icon-orange">
              🏆
            </div>

            <div className="stat-content">
              <span>
                Learning Points
              </span>

              <strong>
                {user.points || 0}
              </strong>
            </div>

          </div>

          {/* COMPLETED COURSES */}

          <div className="stat-card">

            <div className="stat-icon stat-icon-green">
              🎓
            </div>

            <div className="stat-content">
              <span>
                Completed Courses
              </span>

              <strong>
                {completedCourses}
              </strong>
            </div>

          </div>

        </section>

        {/* ==================================
            MY COURSES
        ================================== */}

        <section
          className="dashboard-section"
          id="my-learning"
        >

          <div className="section-header">

            <div>
              <p className="dashboard-label">
                LEARNING
              </p>

              <h2>
                My Courses
              </h2>

              <p className="section-subtitle">
                Continue where you left off.
              </p>
            </div>

            <Link
              to="/courses"
              className="view-all-link"
            >
              Browse Courses →
            </Link>

          </div>

          {/* ==================================
              NO COURSES
          ================================== */}

          {enrolledCourses.length === 0 ? (

            <div className="empty-courses">

              <div className="empty-icon">
                📚
              </div>

              <h3>
                Start your learning journey
              </h3>

              <p>
                Explore our courses and choose
                something you would like to learn.
              </p>

              <Link
                to="/courses"
                className="browse-button"
              >
                Explore Courses →
              </Link>

            </div>

          ) : (

            /* ==================================
               COURSE GRID
            ================================== */

            <div className="dashboard-course-grid">

              {enrolledCourses.map(
                (course) => {

                  const progressData =
                    courseProgress.find(
                      (item) =>
                        item.course?.toString() ===
                        course._id?.toString()
                    );

                  const progress =
                    progressData?.progress || 0;

                  const completedLessons =
                    progressData
                      ?.completedLessons
                      ?.length || 0;

                  const totalLessons =
                    course.lessonList?.length ||
                    course.lessons ||
                    0;

                  const isCompleted =
                    progressData?.courseCompleted ===
                      true ||
                    (
                      progressData?.progress === 100 &&
                      progressData?.quizCompleted === true
                    );

                  const continueLink =
                    getContinueLink(
                      course,
                      progressData
                    );

                  return (

                    <article
                      className={`dashboard-course-card ${
                        isCompleted
                          ? "course-completed-card"
                          : ""
                      }`}
                      key={course._id}
                    >

                      <div className="course-card-content">

                        {/* COURSE TOP */}

                        <div className="course-card-top">

                          <span className="course-category">
                            {course.category ||
                              "Course"}
                          </span>

                          <span className="course-level">
                            {course.level ||
                              "Beginner"}
                          </span>

                        </div>

                        {/* TITLE */}

                        <h3>
                          {course.title}
                        </h3>

                        {/* DESCRIPTION */}

                        <p className="course-description">
                          {course.description}
                        </p>

                        {/* COURSE META */}

                        <div className="course-meta">

                          <span>
                            ⏱️{" "}
                            {course.duration ||
                              "Self-paced"}
                          </span>

                          <span>
                            📖{" "}
                            {totalLessons} lessons
                          </span>

                        </div>

                        {/* COMPLETED BADGE */}

                        {isCompleted && (
                          <div className="dashboard-course-complete">
                            🏆 Course Completed
                          </div>
                        )}

                        {/* PROGRESS */}

                        <div className="course-progress">

                          <div className="course-progress-header">

                            <span>
                              Your Progress
                            </span>

                            <strong>
                              {progress}%
                            </strong>

                          </div>

                          <div className="course-progress-bar">

                            <div
                              className="course-progress-fill"
                              style={{
                                width: `${progress}%`,
                              }}
                            />

                          </div>

                          <p className="lesson-progress-text">
                            {completedLessons} of{" "}
                            {totalLessons} lessons
                            completed
                          </p>

                        </div>

                        {/* ACTIONS */}

                        {isCompleted ? (

                          <div className="completed-course-actions">

                            <Link
                              to={`/courses/${course._id}`}
                              className="continue-learning"
                            >
                              Review Course →
                            </Link>

                            <Link
                              to={`/courses/${course._id}/certificate`}
                              className="certificate-button"
                            >
                              🏆 Certificate
                            </Link>

                          </div>

                        ) : (

                          <Link
                            to={continueLink}
                            className="continue-learning"
                          >
                            {progress > 0
                              ? "Continue Learning →"
                              : "Start Learning →"}
                          </Link>

                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;