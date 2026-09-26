import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./courseDetails.css";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");
  const [enrollError, setEnrollError] = useState("");

  // Login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Enrollment status
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Progress
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  // ======================================
  // FETCH COURSE
  // ======================================

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        // ======================================
        // CHECK LOGIN + ACTUAL ENROLLMENT
        // ======================================

        if (token) {
          try {
            const userResponse = await fetch(
              "http://localhost:5000/api/auth/me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (userResponse.ok) {
              const userData = await userResponse.json();

              setIsLoggedIn(true);

              // ======================================
              // CHECK ACTUAL ENROLLED COURSE
              // ======================================

              const enrolled =
                userData.enrolledCourses?.some(
                  (enrolledCourse) => {
                    // If populated course object
                    if (
                      typeof enrolledCourse ===
                        "object" &&
                      enrolledCourse !== null
                    ) {
                      const enrolledCourseId =
                        enrolledCourse._id ||
                        enrolledCourse.id;

                      return (
                        enrolledCourseId?.toString() ===
                        id.toString()
                      );
                    }

                    // If just ObjectId / string
                    return (
                      enrolledCourse?.toString() ===
                      id.toString()
                    );
                  }
                );

              setIsEnrolled(
                enrolled === true
              );
            } else {
              // Invalid token
              localStorage.removeItem("token");

              setIsLoggedIn(false);
              setIsEnrolled(false);
            }
          } catch (error) {
            console.error(
              "User information error:",
              error
            );

            setIsLoggedIn(false);
            setIsEnrolled(false);
          }
        } else {
          setIsLoggedIn(false);
          setIsEnrolled(false);
        }

        // ======================================
        // FETCH COURSE
        // ======================================

        const courseResponse = await fetch(
          `http://localhost:5000/api/courses/${id}`
        );

        if (!courseResponse.ok) {
          throw new Error("Course not found");
        }

        const courseData =
          await courseResponse.json();

        setCourse(courseData);

        // ======================================
        // FETCH LESSONS
        // ======================================

        const lessonsResponse = await fetch(
          `http://localhost:5000/api/courses/${id}/lessons`
        );

        if (!lessonsResponse.ok) {
          throw new Error(
            "Failed to fetch lessons"
          );
        }

        const lessonsData =
          await lessonsResponse.json();

        setLessons(lessonsData);

        // ======================================
        // FETCH PROGRESS
        // ======================================

        if (token) {
          const progressResponse =
            await fetch(
              `http://localhost:5000/api/courses/${id}/progress`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          if (progressResponse.ok) {
            const progressData =
              await progressResponse.json();

            setProgress(
              progressData.progress || 0
            );

            setCompletedLessons(
              progressData.completedLessons ||
                []
            );
          }
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "Course details error:",
          error
        );

        setError(
          "Unable to load course."
        );

        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ======================================
  // CHECK LESSON COMPLETION
  // ======================================

  const isLessonCompleted = (lessonId) => {
    return completedLessons.some(
      (completedId) =>
        completedId.toString() ===
        lessonId.toString()
    );
  };

  // ======================================
  // ENROLL
  // ======================================

  const handleEnroll = async () => {
    setEnrollMessage("");
    setEnrollError("");

    const token =
      localStorage.getItem("token");

    // ======================================
    // NOT LOGGED IN
    // ======================================

    if (!token) {
      navigate("/login");
      return;
    }

    // ======================================
    // ALREADY ENROLLED
    // ======================================

    if (isEnrolled) {
      return;
    }

    setEnrolling(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}/enroll`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      // ======================================
      // ENROLLMENT FAILED
      // ======================================

      if (!response.ok) {
        setEnrollError(
          data.message ||
            "Enrollment failed."
        );

        setEnrolling(false);

        return;
      }

      // ======================================
      // SUCCESS
      // ======================================

      setIsEnrolled(true);

      setEnrollMessage(
        data.message ||
          "Successfully enrolled! 🎉"
      );

      setProgress(0);

      setCompletedLessons([]);

    } catch (error) {
      console.error(
        "Enrollment error:",
        error
      );

      setEnrollError(
        "Unable to connect to the server."
      );
    }

    setEnrolling(false);
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="course-details-page">
        <div className="course-details-container">
          <h2>
            Loading course...
          </h2>
        </div>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error) {
    return (
      <div className="course-details-page">
        <div className="course-details-container">
          <h2>{error}</h2>

          <Link to="/courses">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // ======================================
  // COMPLETED COUNT
  // ======================================

  const completedCount =
    completedLessons.length;

  const totalLessons =
    lessons.length;

  // ======================================
  // COURSE COMPLETION
  // ======================================

  const courseCompleted =
    progress === 100 ||
    (totalLessons > 0 &&
      completedCount === totalLessons);

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="course-details-page">

      <div className="course-details-container">

        {/* ==================================
            BACK TO COURSES
        ================================== */}

        <Link
          to="/courses"
          className="back-courses"
        >
          ← Back to Courses
        </Link>


        {/* ==================================
            COURSE HEADER
        ================================== */}

        <div className="course-details-card">

          {/* COURSE IMAGE */}

          <div className="course-details-image">

            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
              />
            ) : (
              <div className="course-large-icon">
                📚
              </div>
            )}

          </div>


          {/* COURSE INFORMATION */}

          <div className="course-details-content">

            <span className="details-category">
              {course.category}
            </span>

            <h1>
              {course.title}
            </h1>

            <p className="details-description">
              {course.description}
            </p>


            {/* COURSE INFO */}

            <div className="details-info">

              <div>
                <strong>
                  Instructor
                </strong>

                <span>
                  {course.instructor}
                </span>
              </div>


              <div>
                <strong>
                  Level
                </strong>

                <span>
                  {course.level}
                </span>
              </div>


              <div>
                <strong>
                  Duration
                </strong>

                <span>
                  {course.duration}
                </span>
              </div>


              <div>
                <strong>
                  Lessons
                </strong>

                <span>
                  {lessons.length}
                </span>
              </div>

            </div>


            {/* ==================================
                ENROLL SUCCESS
            ================================== */}

            {enrollMessage && (
              <div className="enroll-success">
                {enrollMessage}
              </div>
            )}


            {/* ==================================
                ENROLL ERROR
            ================================== */}

            {enrollError && (
              <div className="enroll-error">
                {enrollError}
              </div>
            )}


            {/* ==================================
                ENROLL BUTTON
            ================================== */}

            <button
              className={
                isEnrolled
                  ? "enroll-button enrolled-button"
                  : "enroll-button"
              }
              onClick={handleEnroll}
              disabled={
                enrolling || isEnrolled
              }
            >

              {enrolling
                ? "Enrolling..."
                : isEnrolled
                ? "✓ Enrolled"
                : "Enroll Now 🚀"}

            </button>

          </div>

        </div>


        {/* ==================================
            LOGGED-IN + ENROLLED
        ================================== */}

        {isLoggedIn && isEnrolled && (
          <>

            {/* ==================================
                COURSE PROGRESS
            ================================== */}

            <section className="course-progress-section">

              <div className="progress-top">

                <div>

                  <p className="lessons-label">
                    YOUR PROGRESS
                  </p>

                  <h2>
                    Course Progress
                  </h2>

                </div>

                <div className="progress-percentage">
                  {progress}%
                </div>

              </div>


              <div className="course-progress-bar">

                <div
                  className="course-progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>


              <div className="progress-bottom">

                <span>
                  {completedCount} /{" "}
                  {totalLessons} lessons
                  completed
                </span>

                {courseCompleted && (
                  <span className="course-complete-text">
                    🎉 Course Completed!
                  </span>
                )}

              </div>

            </section>


            {/* ==================================
                FINAL QUIZ
            ================================== */}

            <section className="final-quiz-section">

              <div className="final-quiz-content">

                <p className="lessons-label">
                  FINAL ASSESSMENT
                </p>

                <h2>
                  {courseCompleted
                    ? "Ready for the Final Quiz? 🎯"
                    : "Complete the Course First 📚"}
                </h2>

                <p>
                  {courseCompleted
                    ? "Test your knowledge and earn points by completing the final assessment."
                    : `Complete all ${totalLessons} lessons to unlock the final quiz.`}
                </p>

              </div>


              {courseCompleted ? (
                <Link
                  to={`/courses/${id}/quiz`}
                  className="final-quiz-button"
                >
                  Take Final Quiz →
                </Link>
              ) : (
                <button
                  className="final-quiz-button quiz-locked"
                  disabled
                >
                  🔒 Quiz Locked
                </button>
              )}

            </section>


            {/* ==================================
                LESSONS
            ================================== */}

            <section className="lessons-section">

              <div className="lessons-header">

                <div>

                  <p className="lessons-label">
                    COURSE CONTENT
                  </p>

                  <h2>
                    Course Lessons 📖
                  </h2>

                </div>

                <span className="lesson-count">
                  {lessons.length} Lessons
                </span>

              </div>


              <div className="lessons-list">

                {lessons.map((lesson) => {

                  const completed =
                    isLessonCompleted(
                      lesson._id
                    );

                  return (
                    <div
                      className={
                        completed
                          ? "lesson-card lesson-completed"
                          : "lesson-card"
                      }
                      key={lesson._id}
                    >

                      {/* NUMBER */}

                      <div
                        className={
                          completed
                            ? "lesson-number completed-number"
                            : "lesson-number"
                        }
                      >
                        {completed
                          ? "✓"
                          : lesson.order}
                      </div>


                      {/* CONTENT */}

                      <div className="lesson-content">

                        <h3>
                          {lesson.title}
                        </h3>

                        <p>
                          {lesson.description}
                        </p>

                      </div>


                      {/* DURATION */}

                      <div className="lesson-duration">
                        ⏱️ {lesson.duration}
                      </div>


                      {/* BUTTON */}

                      {completed ? (
                        <Link
                          to={`/courses/${id}/lessons/${lesson._id}`}
                          className="completed-lesson-button"
                        >
                          Completed ✓
                        </Link>
                      ) : (
                        <Link
                          to={`/courses/${id}/lessons/${lesson._id}`}
                          className="start-lesson-button"
                        >
                          Start →
                        </Link>
                      )}

                    </div>
                  );
                })}

              </div>

            </section>

          </>
        )}


        {/* ==================================
            LOGGED-IN BUT NOT ENROLLED
        ================================== */}

        {isLoggedIn && !isEnrolled && (
          <section className="login-required-section">

            <div className="login-required-icon">
              📚
            </div>

            <h2>
              Ready to start learning?
            </h2>

            <p>
              Enroll in this course to access
              lessons, track your progress,
              complete the quiz and earn your
              certificate.
            </p>

          </section>
        )}


        {/* ==================================
            LOGGED OUT
        ================================== */}

        {!isLoggedIn && (
          <section className="login-required-section">

            <div className="login-required-icon">
              🔐
            </div>

            <h2>
              Ready to start learning?
            </h2>

            <p>
              Create an account or login to
              enroll in this course, track your
              progress, complete the lessons and
              earn your certificate.
            </p>

            <button
              className="login-required-button"
              onClick={() =>
                navigate("/login")
              }
            >
              Login to Enroll →
            </button>

          </section>
        )}

      </div>

    </div>
  );
}

export default CourseDetails;