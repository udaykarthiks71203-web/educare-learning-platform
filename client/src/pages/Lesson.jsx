import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Lesson.css";

const Lesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [courseId, lessonId]);

  const fetchLesson = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${courseId}/lessons`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lessons");
      }

      const currentLesson = data.find(
        (item) => item._id === lessonId
      );

      if (!currentLesson) {
        throw new Error("Lesson not found");
      }

      setLesson(currentLesson);
    } catch (error) {
      console.error("Lesson fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async () => {
    try {
      setCompleting(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (
          data.message === "Lesson already completed."
        ) {
          setCompleted(true);
          return;
        }

        throw new Error(
          data.message || "Failed to complete lesson"
        );
      }

      setCompleted(true);

      alert(
        `Lesson completed! 🎉\n\nYou earned 10 points.\nProgress: ${data.progress}%`
      );
    } catch (error) {
      console.error("Complete lesson error:", error);
      alert(error.message);
    } finally {
      setCompleting(false);
    }
  };

  const formatContent = (content) => {
    if (!content) {
      return null;
    }

    const lines = content
      .split("\n")
      .map((line) => line.trimEnd());

    const elements = [];

    let currentCode = [];
    let inCode = false;

    const flushCode = () => {
      if (currentCode.length > 0) {
        elements.push(
          <pre className="lesson-code" key={`code-${elements.length}`}>
            <code>{currentCode.join("\n")}</code>
          </pre>
        );

        currentCode = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (
        trimmed.startsWith("```")
      ) {
        if (inCode) {
          inCode = false;
          flushCode();
        } else {
          inCode = true;
        }

        return;
      }

      if (inCode) {
        currentCode.push(line);
        return;
      }

      if (!trimmed) {
        return;
      }

      // Main section headings
      if (
        trimmed === "Important Points:" ||
        trimmed === "Common Mistake:" ||
        trimmed === "Practice Task:" ||
        trimmed === "Output:"
      ) {
        elements.push(
          <h3
            className={`lesson-section-title ${
              trimmed === "Important Points:"
                ? "important-title"
                : trimmed === "Common Mistake:"
                ? "mistake-title"
                : trimmed === "Practice Task:"
                ? "practice-title"
                : "output-title"
            }`}
            key={`heading-${index}`}
          >
            {trimmed.replace(":", "")}
          </h3>
        );

        return;
      }

      // Example heading
      if (
        trimmed === "Example:" ||
        trimmed === "Your first Python program:"
      ) {
        elements.push(
          <h3
            className="lesson-example-title"
            key={`example-${index}`}
          >
            {trimmed.replace(":", "")}
          </h3>
        );

        return;
      }

      // Bullet points
      if (trimmed.startsWith("- ")) {
        elements.push(
          <div
            className="lesson-bullet"
            key={`bullet-${index}`}
          >
            <span>•</span>
            <p>{trimmed.substring(2)}</p>
          </div>
        );

        return;
      }

      // Code-like lines
      const looksLikeCode =
        trimmed.startsWith("print(") ||
        trimmed.startsWith("input(") ||
        trimmed.startsWith("if ") ||
        trimmed.startsWith("elif ") ||
        trimmed.startsWith("else:") ||
        trimmed.startsWith("for ") ||
        trimmed.startsWith("while ") ||
        trimmed.startsWith("def ") ||
        trimmed.startsWith("return ") ||
        trimmed.startsWith("import ") ||
        trimmed.startsWith("from ") ||
        trimmed.startsWith("class ") ||
        trimmed.startsWith("try:") ||
        trimmed.startsWith("except") ||
        trimmed.startsWith("finally:") ||
        trimmed.startsWith("with ") ||
        trimmed.startsWith("student") ||
        trimmed.startsWith("name") ||
        trimmed.startsWith("age") ||
        trimmed.startsWith("numbers") ||
        trimmed.startsWith("fruits") ||
        trimmed.startsWith("word") ||
        trimmed.startsWith("marks") ||
        trimmed.startsWith("result") ||
        trimmed.startsWith("average") ||
        trimmed.startsWith("count") ||
        trimmed.startsWith("password") ||
        trimmed.startsWith("price") ||
        trimmed.startsWith("course") ||
        trimmed.startsWith("data") ||
        trimmed.startsWith("employee") ||
        trimmed.startsWith("empty_set") ||
        trimmed.startsWith("coordinates") ||
        trimmed.startsWith("first_name") ||
        trimmed.startsWith("last_name") ||
        trimmed.startsWith("full_name") ||
        trimmed.startsWith("is_") ||
        trimmed.includes(" = ") ||
        trimmed.startsWith("#");

      if (looksLikeCode) {
        elements.push(
          <pre
            className="lesson-inline-code"
            key={`inline-code-${index}`}
          >
            <code>{trimmed}</code>
          </pre>
        );

        return;
      }

      // Output-like lines
      if (
        trimmed === "Hello from Educare!" ||
        trimmed === "Hello Uday" ||
        trimmed === "30" ||
        trimmed === "23" ||
        trimmed === "5.0" ||
        trimmed === "6.0" ||
        trimmed === "Cannot divide by zero" ||
        trimmed === "Access granted" ||
        trimmed === "Uday" ||
        trimmed === "Python"
      ) {
        elements.push(
          <div
            className="lesson-output"
            key={`output-${index}`}
          >
            {trimmed}
          </div>
        );

        return;
      }

      // Normal paragraph
      elements.push(
        <p
          className="lesson-paragraph"
          key={`paragraph-${index}`}
        >
          {trimmed}
        </p>
      );
    });

    if (inCode) {
      flushCode();
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="lesson-loading">
        Loading lesson...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-error">
        <h2>Lesson not found</h2>

        <button onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="lesson-header">

        <button
          className="lesson-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Course
        </button>

        <div className="lesson-header-content">

          <span className="lesson-number">
            Lesson {lesson.order}
          </span>

          <h1>{lesson.title}</h1>

          {lesson.description && (
            <p className="lesson-description">
              {lesson.description}
            </p>
          )}

          <div className="lesson-meta">
            <span>⏱ {lesson.duration}</span>
            <span>📚 Python</span>
          </div>

        </div>
      </div>


      {/* =====================================
          CONTENT
      ====================================== */}

      <main className="lesson-container">

        <article className="lesson-card">

          <div className="lesson-content">

            <h2>Lesson Content</h2>

            <div className="formatted-content">
              {formatContent(lesson.content)}
            </div>

          </div>


          {/* =====================================
              COMPLETE LESSON
          ====================================== */}

          <div className="lesson-completion">

            {!completed ? (
              <button
                className="complete-button"
                onClick={completeLesson}
                disabled={completing}
              >
                {completing
                  ? "Completing..."
                  : "✓ Mark Lesson as Complete"}
              </button>
            ) : (
              <div className="completed-message">
                ✓ Lesson Completed
              </div>
            )}

          </div>

        </article>

      </main>

    </div>
  );
};

export default Lesson;