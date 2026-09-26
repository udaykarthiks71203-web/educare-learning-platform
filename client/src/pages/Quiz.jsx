import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./Quiz.css";

function Quiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [result, setResult] = useState(null);

  // ======================================
  // FETCH QUIZ
  // ======================================

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        // ======================================
        // CHECK LOGIN
        // ======================================

        if (!token) {
          navigate("/login");
          return;
        }

        // ======================================
        // FETCH QUIZ
        // ======================================

        const response = await fetch(
          `http://localhost:5000/api/quizzes/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // ======================================
        // API ERROR
        // ======================================

        if (!response.ok) {
          console.error(
            "Quiz API error:",
            data
          );

          setError(
            data.message ||
              "Unable to load quiz."
          );

          setLoading(false);

          return;
        }

        // ======================================
        // CHECK QUIZ DATA
        // ======================================

        if (!data) {
          setError(
            "No quiz found for this course."
          );

          setLoading(false);

          return;
        }

        // ======================================
        // CHECK QUESTIONS
        // ======================================

        if (
          !data.questions ||
          data.questions.length === 0
        ) {
          setError(
            "This quiz does not have any questions yet."
          );

          setLoading(false);

          return;
        }

        // ======================================
        // SET QUIZ
        // ======================================

        setQuiz(data);

        setAnswers(
          new Array(
            data.questions.length
          ).fill("")
        );

        setLoading(false);
      } catch (error) {
        console.error(
          "Quiz loading error:",
          error
        );

        setError(
          "Unable to connect to the server."
        );

        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId, navigate]);

  // ======================================
  // SELECT ANSWER
  // ======================================

  const handleAnswer = (answer) => {
    const updatedAnswers = [
      ...answers,
    ];

    updatedAnswers[currentQuestion] =
      answer;

    setAnswers(updatedAnswers);
  };

  // ======================================
  // NEXT QUESTION
  // ======================================

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      return;
    }

    if (
      currentQuestion <
      quiz.questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // ======================================
  // PREVIOUS QUESTION
  // ======================================

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  // ======================================
  // SUBMIT QUIZ
  // ======================================

  const handleSubmit = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // ======================================
    // CHECK ALL ANSWERS
    // ======================================

    const unanswered = answers.some(
      (answer) => !answer
    );

    if (unanswered) {
      alert(
        "Please answer all questions before submitting."
      );

      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quiz._id}/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            answers,
          }),
        }
      );

      const data =
        await response.json();

      // ======================================
      // SUBMIT ERROR
      // ======================================

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to submit quiz."
        );

        setSubmitting(false);

        return;
      }

      // ======================================
      // SUCCESS
      // ======================================

      setResult(data);
    } catch (error) {
      console.error(
        "Quiz submission error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }

    setSubmitting(false);
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="quiz-page">

        <div className="quiz-container">

          <h2>
            Loading quiz...
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
      <div className="quiz-page">

        <div className="quiz-container">

          <h2>
            {error}
          </h2>

          <Link
            to={`/courses/${courseId}`}
          >
            ← Back to Course
          </Link>

        </div>

      </div>
    );
  }

  // ======================================
  // RESULT
  // ======================================

  if (result) {
    return (
      <div className="quiz-page">

        <div className="quiz-result">

          <div className="result-icon">
            {result.passed
              ? "🎉"
              : "📚"}
          </div>

          <h1>
            {result.passed
              ? "Quiz Passed!"
              : "Quiz Completed"}
          </h1>

          <p className="result-message">
            {result.message}
          </p>

          <div className="result-score">
            {result.score}%
          </div>

          <p className="result-correct">
            {result.correctAnswers} /{" "}
            {result.totalQuestions} correct
          </p>

          <div className="result-points">
            🏆 Points Earned:{" "}
            <strong>
              {result.earnedPoints}
            </strong>
          </div>

          <div className="result-actions">

            <Link
              to={`/courses/${courseId}`}
              className="result-button"
            >
              ← Back to Course
            </Link>

            <Link
              to="/dashboard"
              className="result-button secondary"
            >
              Go to Dashboard
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ======================================
  // CURRENT QUESTION
  // ======================================

  const question =
    quiz.questions[currentQuestion];

  const isLastQuestion =
    currentQuestion ===
    quiz.questions.length - 1;

  const selectedAnswer =
    answers[currentQuestion];

  // ======================================
  // QUIZ UI
  // ======================================

  return (
    <div className="quiz-page">

      <div className="quiz-container">

        {/* ==================================
            BACK
        ================================== */}

        <Link
          to={`/courses/${courseId}`}
          className="quiz-back"
        >
          ← Back to Course
        </Link>


        {/* ==================================
            HEADER
        ================================== */}

        <div className="quiz-header">

          <div>

            <p className="quiz-label">
              FINAL ASSESSMENT
            </p>

            <h1>
              {quiz.title}
            </h1>

            <p>
              {quiz.description}
            </p>

          </div>

        </div>


        {/* ==================================
            PROGRESS
        ================================== */}

        <div className="quiz-progress-section">

          <div className="quiz-progress-info">

            <span>
              Question{" "}
              {currentQuestion + 1} of{" "}
              {quiz.questions.length}
            </span>

            <span>
              {Math.round(
                ((currentQuestion + 1) /
                  quiz.questions.length) *
                  100
              )}
              %
            </span>

          </div>


          <div className="quiz-progress-bar">

            <div
              className="quiz-progress-fill"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    quiz.questions.length) *
                  100
                }%`,
              }}
            />

          </div>

        </div>


        {/* ==================================
            QUESTION
        ================================== */}

        <div className="question-card">

          <div className="question-number">
            Question{" "}
            {currentQuestion + 1}
          </div>

          <h2>
            {question.question}
          </h2>


          {/* ==================================
              OPTIONS
          ================================== */}

          <div className="quiz-options">

            {question.options.map(
              (option, index) => {

                const selected =
                  selectedAnswer ===
                  option;

                return (
                  <button
                    key={index}
                    className={
                      selected
                        ? "quiz-option selected"
                        : "quiz-option"
                    }
                    onClick={() =>
                      handleAnswer(
                        option
                      )
                    }
                  >

                    <span className="option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span>
                      {option}
                    </span>

                  </button>
                );
              }
            )}

          </div>


          {/* ==================================
              NAVIGATION
          ================================== */}

          <div className="quiz-navigation">

            <button
              className="quiz-nav-button previous"
              onClick={
                handlePrevious
              }
              disabled={
                currentQuestion === 0
              }
            >
              ← Previous
            </button>


            {!isLastQuestion ? (

              <button
                className="quiz-nav-button next"
                onClick={
                  handleNext
                }
                disabled={
                  !selectedAnswer
                }
              >
                Next →
              </button>

            ) : (

              <button
                className="quiz-nav-button submit"
                onClick={
                  handleSubmit
                }
                disabled={
                  submitting ||
                  !selectedAnswer
                }
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Quiz 🎯"}
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Quiz;