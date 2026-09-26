const mongoose = require("mongoose");

// ======================================
// COURSE PROGRESS SCHEMA
// ======================================

const courseProgressSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    progress: {
      type: Number,
      default: 0,
    },

    // ======================================
    // QUIZ / COURSE COMPLETION
    // ======================================

    quizCompleted: {
      type: Boolean,
      default: false,
    },

    quizScore: {
      type: Number,
      default: 0,
    },

    courseCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);


// ======================================
// QUIZ RESULT SCHEMA
// ======================================

const quizResultSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    earnedPoints: {
      type: Number,
      default: 0,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);


// ======================================
// USER SCHEMA
// ======================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      default: "student",
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    courseProgress: {
      type: [courseProgressSchema],
      default: [],
    },

    points: {
      type: Number,
      default: 0,
    },

    // ======================================
    // QUIZ RESULTS
    // ======================================

    quizResults: {
      type: [quizResultSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);