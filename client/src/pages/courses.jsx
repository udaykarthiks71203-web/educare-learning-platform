import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ======================================
  // CHECK LOGIN STATUS
  // ======================================

  const isLoggedIn = Boolean(
    localStorage.getItem("token")
  );

  // ======================================
  // FETCH COURSES
  // ======================================

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/courses"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        setCourses(data);
      } catch (error) {
        console.error("Courses error:", error);

        setError(
          "Unable to load courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ======================================
  // GET CATEGORIES
  // ======================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [courses]);

  // ======================================
  // FILTER COURSES
  // ======================================

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        course.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        course.instructor
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    courses,
    searchTerm,
    selectedCategory,
  ]);

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="courses-page">
        <div className="courses-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading courses...
          </h2>

          <p>
            Please wait while we load the
            available courses.
          </p>

        </div>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error) {
    return (
      <div className="courses-page">
        <div className="courses-error-box">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            className="retry-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ======================================
  // MAIN PAGE
  // ======================================

  return (
    <div className="courses-page">

      <div className="courses-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="courses-header">

          {/* ======================================
              DYNAMIC BACK BUTTON
          ====================================== */}

          <Link
            to={
              isLoggedIn
                ? "/dashboard"
                : "/"
            }
            className="back-button"
          >
            {isLoggedIn
              ? "← Back to Dashboard"
              : "← Back to Home"}
          </Link>


          <p className="courses-label">
            LEARNING LIBRARY
          </p>


          <h1>
            Explore Our Courses
          </h1>


          <p className="courses-subtitle">
            Build new skills, expand your knowledge,
            and learn at your own pace.
          </p>

        </div>


        {/* ======================================
            SEARCH + FILTER
        ====================================== */}

        <div className="courses-controls">

          {/* SEARCH */}

          <div className="course-search">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            {searchTerm && (

              <button
                className="clear-search"
                onClick={() =>
                  setSearchTerm("")
                }
              >
                ×
              </button>

            )}

          </div>


          {/* CATEGORY FILTER */}

          <div className="category-filter">

            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
            >

              {categories.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* ======================================
            COURSE COUNT
        ====================================== */}

        <div className="courses-result-info">

          <p>

            Showing{" "}

            <strong>
              {filteredCourses.length}
            </strong>{" "}

            {filteredCourses.length === 1
              ? "course"
              : "courses"}

          </p>

        </div>


        {/* ======================================
            NO COURSES
        ====================================== */}

        {filteredCourses.length === 0 ? (

          <div className="no-courses">

            <div className="no-courses-icon">
              🔎
            </div>

            <h2>
              No courses found
            </h2>

            <p>
              Try changing your search
              or category filter.
            </p>

            <button
              className="reset-filter-button"
              onClick={() => {

                setSearchTerm("");
                setSelectedCategory("All");

              }}
            >
              Reset Filters
            </button>

          </div>

        ) : (

          /* ======================================
             COURSE GRID
          ====================================== */

          <div className="courses-grid">

            {filteredCourses.map(
              (course) => (

                <div
                  className="course-card"
                  key={course._id}
                >

                  {/* ======================================
                      COURSE IMAGE
                  ====================================== */}

                  <div className="course-image-container">

                    {course.image ? (

                      <img
                        src={course.image}
                        alt={course.title}
                        className="course-image"
                      />

                    ) : (

                      <div className="course-image-placeholder">

                        <span>
                          📚
                        </span>

                      </div>

                    )}

                    <span className="course-level-badge">
                      {course.level ||
                        "Beginner"}
                    </span>

                  </div>


                  {/* ======================================
                      COURSE CONTENT
                  ====================================== */}

                  <div className="course-card-content">

                    <span className="course-category">
                      {course.category}
                    </span>


                    <h2>
                      {course.title}
                    </h2>


                    <p className="course-description">
                      {course.description}
                    </p>


                    {/* ======================================
                        COURSE INFO
                    ====================================== */}

                    <div className="course-info">

                      <div className="course-info-item">

                        <span className="info-icon">
                          👨‍🏫
                        </span>

                        <span>
                          {course.instructor ||
                            "Educare Academy"}
                        </span>

                      </div>


                      <div className="course-info-item">

                        <span className="info-icon">
                          ⏱️
                        </span>

                        <span>
                          {course.duration ||
                            "Self-paced"}
                        </span>

                      </div>


                      <div className="course-info-item">

                        <span className="info-icon">
                          📖
                        </span>

                        <span>
                          {course.lessons || 0}{" "}
                          lessons
                        </span>

                      </div>

                    </div>


                    {/* ======================================
                        VIEW COURSE
                    ====================================== */}

                    <div className="course-bottom">

                      <span className="course-level">
                        {course.level ||
                          "Beginner"}
                      </span>

                      <Link
                        to={`/courses/${course._id}`}
                        className="view-course"
                      >
                        View Course →
                      </Link>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Courses;