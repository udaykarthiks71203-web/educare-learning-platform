const mongoose = require("mongoose");

// ======================================
// LESSON SCHEMA
// ======================================

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "10 minutes",
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true,
  }
);


// ======================================
// COURSE SCHEMA
// ======================================

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },

    duration: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Number of lessons
    lessons: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Complete lesson information
    lessonList: {
      type: [lessonSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


// ======================================
// EXPORT COURSE MODEL
// ======================================

module.exports =
  mongoose.model("Course", courseSchema);