const express = require("express");
const crypto = require("crypto");

const Certificate = require("../models/certificate");
const Course = require("../models/course");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================
// GET CERTIFICATE FOR A COURSE
// ======================================

router.get(
  "/course/:courseId",
  protect,
  async (req, res) => {
    try {
      const certificate =
        await Certificate.findOne({
          student: req.user._id,
          course: req.params.courseId,
        })
          .populate(
            "course",
            "title instructor category"
          )
          .populate(
            "student",
            "name email"
          );

      if (!certificate) {
        return res.status(404).json({
          message:
            "Certificate not found",
        });
      }

      res.json(certificate);
    } catch (error) {
      console.error(
        "Fetch certificate error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch certificate",
      });
    }
  }
);


// ======================================
// CREATE CERTIFICATE
// ======================================

router.post(
  "/course/:courseId",
  protect,
  async (req, res) => {
    try {
      const courseId =
        req.params.courseId;


      // ======================================
      // CHECK COURSE
      // ======================================

      const course =
        await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }


      // ======================================
      // CHECK COURSE PROGRESS
      // ======================================

      const courseProgress =
        req.user.courseProgress.find(
          (item) =>
            item.course.toString() ===
            courseId
        );

      if (!courseProgress) {
        return res.status(400).json({
          message:
            "You are not enrolled in this course.",
        });
      }


      // ======================================
      // CHECK COURSE COMPLETION
      // ======================================

      if (
        !courseProgress.courseCompleted
      ) {
        return res.status(400).json({
          message:
            "Complete the course and pass the final quiz first.",
        });
      }


      // ======================================
      // CHECK EXISTING CERTIFICATE
      // ======================================

      const existingCertificate =
        await Certificate.findOne({
          student: req.user._id,
          course: courseId,
        });

      if (existingCertificate) {
        return res.json({
          message:
            "Certificate already exists.",
          certificate:
            existingCertificate,
        });
      }


      // ======================================
      // GENERATE CERTIFICATE ID
      // ======================================

      const randomId =
        crypto
          .randomBytes(5)
          .toString("hex")
          .toUpperCase();

      const certificateId =
        `EDU-${randomId}`;


      // ======================================
      // CREATE CERTIFICATE
      // ======================================

      const certificate =
        await Certificate.create({
          student:
            req.user._id,

          course:
            course._id,

          certificateId:
            certificateId,

          studentName:
            req.user.name,

          courseName:
            course.title,

          completedAt:
            courseProgress.completedAt ||
            new Date(),
        });


      // ======================================
      // RESPONSE
      // ======================================

      res.status(201).json({
        message:
          "Certificate created successfully! 🏆",

        certificate,
      });

    } catch (error) {
      console.error(
        "Create certificate error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create certificate",
      });
    }
  }
);

// ======================================
// VERIFY CERTIFICATE
// ======================================

router.get(
  "/verify/:certificateId",
  async (req, res) => {
    try {
      const { certificateId } =
        req.params;

      const certificate =
        await Certificate.findOne({
          certificateId:
            certificateId.toUpperCase(),
        })
          .populate(
            "course",
            "title instructor category"
          )
          .populate(
            "student",
            "name email"
          );

      // Certificate not found
      if (!certificate) {
        return res.status(404).json({
          verified: false,
          message:
            "Certificate not found. Please check the Certificate ID.",
        });
      }

      // Certificate found
      res.json({
        verified: true,

        message:
          "Certificate verified successfully! ✅",

        certificate: {
          certificateId:
            certificate.certificateId,

          studentName:
            certificate.studentName,

          courseName:
            certificate.courseName,

          instructor:
            certificate.course?.instructor ||
            "Educare Academy",

          category:
            certificate.course?.category ||
            "",

          completedAt:
            certificate.completedAt,

          issuedAt:
            certificate.issuedAt,
        },
      });

    } catch (error) {
      console.error(
        "Certificate verification error:",
        error
      );

      res.status(500).json({
        verified: false,
        message:
          "Unable to verify certificate.",
      });
    }
  }
);
module.exports = router;