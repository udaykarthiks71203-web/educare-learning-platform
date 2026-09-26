const express = require("express");
const Quiz = require("../models/quiz");
const User = require("../models/user");
const Course = require("../models/course");
const Notification = require("../models/notification");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================
// GET QUIZ FOR COURSE
// ======================================

router.get(
  "/course/:courseId",
  protect,
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({
        course: req.params.courseId,
      });

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found for this course",
        });
      }

      res.json(quiz);
    } catch (error) {
      console.error(
        "Fetch quiz error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch quiz",
      });
    }
  }
);


// ======================================
// GET SINGLE QUIZ
// ======================================

router.get(
  "/:quizId",
  protect,
  async (req, res) => {
    try {
      const quiz = await Quiz.findById(
        req.params.quizId
      );

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found",
        });
      }

      res.json(quiz);
    } catch (error) {
      console.error(
        "Fetch quiz error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch quiz",
      });
    }
  }
);


// ======================================
// SUBMIT QUIZ
// ======================================

router.post(
  "/:quizId/submit",
  protect,
  async (req, res) => {
    try {
      const { answers } = req.body;

      // ======================================
      // FIND QUIZ
      // ======================================

      const quiz = await Quiz.findById(
        req.params.quizId
      );

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found",
        });
      }


      // ======================================
      // VALIDATE ANSWERS
      // ======================================

      if (!Array.isArray(answers)) {
        return res.status(400).json({
          message: "Answers must be an array",
        });
      }


      // ======================================
      // CALCULATE SCORE
      // ======================================

      let score = 0;
      let correctAnswers = 0;

      const totalQuestions =
        quiz.questions.length;

      quiz.questions.forEach(
        (question, index) => {
          const userAnswer =
            answers[index];

          if (
            userAnswer &&
            userAnswer ===
              question.correctAnswer
          ) {
            score += question.points;
            correctAnswers++;
          }
        }
      );


      // ======================================
      // CALCULATE TOTAL POINTS
      // ======================================

      const totalPoints =
        quiz.questions.reduce(
          (total, question) =>
            total + question.points,
          0
        );


      // ======================================
      // CALCULATE PERCENTAGE
      // ======================================

      const percentage =
        totalPoints > 0
          ? Math.round(
              (score / totalPoints) * 100
            )
          : 0;


      // ======================================
      // CHECK PASSING SCORE
      // ======================================

      const passed =
        percentage >=
        quiz.passingScore;


      // ======================================
      // FIND USER
      // ======================================

      const user = await User.findById(
        req.user._id
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }


      // ======================================
      // CHECK PREVIOUS ATTEMPT
      // ======================================

      let previousAttempt =
        user.quizResults.find(
          (result) =>
            result.quiz.toString() ===
            quiz._id.toString()
        );


      // ======================================
      // CHECK IF PREVIOUSLY PASSED
      // ======================================

      const wasPreviouslyPassed =
        previousAttempt?.passed === true;


      // ======================================
      // CALCULATE EARNED POINTS
      // ======================================

      let earnedPoints = 0;

      if (
        passed &&
        !wasPreviouslyPassed
      ) {
        earnedPoints = 50;
      }


      // ======================================
      // UPDATE QUIZ RESULT
      // ======================================

      if (previousAttempt) {

        previousAttempt.score =
          percentage;

        previousAttempt.correctAnswers =
          correctAnswers;

        previousAttempt.totalQuestions =
          totalQuestions;

        previousAttempt.passed =
          passed;

        previousAttempt.earnedPoints =
          earnedPoints;

        previousAttempt.attemptedAt =
          new Date();

      } else {

        user.quizResults.push({
          quiz: quiz._id,

          score: percentage,

          correctAnswers:
            correctAnswers,

          totalQuestions:
            totalQuestions,

          passed: passed,

          earnedPoints:
            earnedPoints,

          attemptedAt:
            new Date(),
        });
      }


      // ======================================
      // ADD LEARNING POINTS
      // ======================================

      if (earnedPoints > 0) {
        user.points += earnedPoints;
      }


      // ======================================
      // FIND COURSE PROGRESS
      // ======================================

      const courseProgress =
        user.courseProgress.find(
          (item) =>
            item.course.toString() ===
            quiz.course.toString()
        );


      // ======================================
      // TRACK COURSE COMPLETION
      // ======================================

      let courseWasAlreadyCompleted =
        false;

      let courseCompletedNow =
        false;


      if (courseProgress) {

        // IMPORTANT:
        // Store the old completion state
        // BEFORE modifying it.

        courseWasAlreadyCompleted =
          courseProgress.courseCompleted === true;


        // ======================================
        // UPDATE QUIZ PROGRESS
        // ======================================

        courseProgress.quizCompleted =
          passed;

        courseProgress.quizScore =
          percentage;


        // ======================================
        // COURSE COMPLETION
        // ======================================

        if (
          courseProgress.progress === 100 &&
          passed
        ) {

          courseProgress.courseCompleted =
            true;


          // Course has just become completed
          if (!courseWasAlreadyCompleted) {

            courseCompletedNow =
              true;

            courseProgress.completedAt =
              new Date();
          }
        }
      }


      // ======================================
      // SAVE USER
      // ======================================

      await user.save();


      // ======================================
      // GET COURSE
      // ======================================

      const course =
        await Course.findById(
          quiz.course
        );


      // ======================================
      // CREATE QUIZ NOTIFICATION
      // ======================================

      await Notification.create({
        user: req.user._id,

        title: passed
          ? "Quiz Passed 🎉"
          : "Quiz Completed",

        message: passed
          ? `You passed the ${quiz.title} quiz with a score of ${percentage}%.`
          : `You completed the ${quiz.title} quiz with a score of ${percentage}%.`,

        type: "quiz",
      });


      // ======================================
      // CREATE COURSE COMPLETION NOTIFICATION
      // ======================================

      if (courseCompletedNow) {

        await Notification.create({
          user: req.user._id,

          title:
            "Course Completed 🏆",

          message:
            `Congratulations! You completed ${
              course
                ? course.title
                : "the course"
            }. You can now access your certificate.`,

          type: "course",

          link:
            `/courses/${quiz.course}/certificate`,
        });
      }


      // ======================================
      // RESPONSE
      // ======================================

      res.json({

        message: passed
          ? "Quiz passed successfully! 🎉"
          : "Quiz completed.",

        score:
          percentage,

        correctAnswers:
          correctAnswers,

        totalQuestions:
          totalQuestions,

        passed:
          passed,

        passingScore:
          quiz.passingScore,

        earnedPoints:
          earnedPoints,

        totalPoints:
          user.points,

        courseCompleted:
          courseProgress
            ? courseProgress.courseCompleted
            : false,

        courseCompletedNow:
          courseCompletedNow,
      });

    } catch (error) {

      console.error(
        "Submit quiz error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to submit quiz",
      });
    }
  }
);


// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;