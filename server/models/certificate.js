const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    certificateId: {
      type: String,
      required: true,
      unique: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    courseName: {
      type: String,
      required: true,
    },

    completedAt: {
      type: Date,
      required: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Certificate",
  certificateSchema
);