const express = require("express");
const Course = require("../models/course");
const protect = require("../middleware/authMiddleware");
const Notification = require("../models/notification");

const router = express.Router();


// ======================================
// GET ALL COURSES
// ======================================

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    res.json(courses);
  } catch (error) {
    console.error("Fetch courses error:", error);

    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
});


// ======================================
// GET SINGLE COURSE
// ======================================

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    console.error("Fetch course error:", error);

    res.status(500).json({
      message: "Failed to fetch course",
    });
  }
});


// ======================================
// CREATE COURSE
// ======================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      category,
      level,
      duration,
      image,
      lessons,
    } = req.body;

    if (
      !title ||
      !description ||
      !instructor ||
      !category ||
      !duration
    ) {
      return res.status(400).json({
        message: "Please fill all required course fields",
      });
    }

    const course = await Course.create({
      title,
      description,
      instructor,
      category,
      level,
      duration,
      image,
      lessons,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    res.status(500).json({
      message: "Failed to create course",
    });
  }
});


// ======================================
// ENROLL IN COURSE
// ======================================

router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check if already enrolled
    const alreadyEnrolled = req.user.enrolledCourses.some(
      (id) => id.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "You are already enrolled in this course.",
      });
    }

    // Add course to enrolled courses
    req.user.enrolledCourses.push(courseId);

    // Create progress record for this course
    req.user.courseProgress.push({
      course: courseId,
      completedLessons: [],
      progress: 0,
    });

    await req.user.save();

   // Create enrollment notification
await Notification.create({
  user: req.user._id,
  title: "Course Enrolled",
  message: `You have successfully enrolled in ${course.title}.`,
  type: "course",
});

res.status(200).json({
  message: "Successfully enrolled in the course! 🎉",
  course: {
    id: course._id,
    title: course.title,
  },
});
  } catch (error) {
    console.error("Enrollment error:", error);

    res.status(500).json({
      message: "Failed to enroll in course",
    });
  }
});


// ======================================
// GET COURSE LESSONS
// ======================================

router.get("/:id/lessons", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course.lessonList);
  } catch (error) {
    console.error("Fetch lessons error:", error);

    res.status(500).json({
      message: "Failed to fetch lessons",
    });
  }
});


// ======================================
// ADD LESSONS TO COURSE
// ======================================

router.put("/:id/lessons", async (req, res) => {
  try {
    const { lessonList } = req.body;

    if (!Array.isArray(lessonList)) {
      return res.status(400).json({
        message: "lessonList must be an array",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    course.lessonList = lessonList;
    course.lessons = lessonList.length;

    await course.save();

    res.json({
      message: "Lessons added successfully",
      course,
    });
  } catch (error) {
    console.error("Add lessons error:", error);

    res.status(500).json({
      message: "Failed to add lessons",
    });
  }
});


// ======================================
// COMPLETE LESSON
// ======================================

router.post(
  "/:courseId/lessons/:lessonId/complete",
  protect,
  async (req, res) => {
    try {
      const { courseId, lessonId } = req.params;

      // Find course
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check lesson exists
      const lesson = course.lessonList.id(lessonId);

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found",
        });
      }

      // Check user is enrolled
      const isEnrolled = req.user.enrolledCourses.some(
        (id) => id.toString() === courseId
      );

      if (!isEnrolled) {
        return res.status(403).json({
          message: "Please enroll in this course first.",
        });
      }

      // Find this course's progress record
      let courseProgress = req.user.courseProgress.find(
        (item) => item.course.toString() === courseId
      );

      // If progress record does not exist, create it
      if (!courseProgress) {
        req.user.courseProgress.push({
          course: courseId,
          completedLessons: [],
          progress: 0,
        });

        courseProgress =
          req.user.courseProgress[
            req.user.courseProgress.length - 1
          ];
      }

      // Check if lesson is already completed
      const alreadyCompleted =
        courseProgress.completedLessons.some(
          (id) => id.toString() === lessonId
        );

      if (alreadyCompleted) {
        return res.status(400).json({
          message: "Lesson already completed.",
        });
      }

      // Add completed lesson
      courseProgress.completedLessons.push(lessonId);

      // Calculate progress for THIS course
      const totalLessons = course.lessonList.length;

      const completedLessons =
        courseProgress.completedLessons.length;

      const progress =
        totalLessons > 0
          ? Math.round(
              (completedLessons / totalLessons) * 100
            )
          : 0;

      // Save progress
      courseProgress.progress = progress;

      // Add learning points
      req.user.points += 10;

      await req.user.save();

      res.json({
        message: "Lesson completed successfully! 🎉",
        progress: progress,
        points: req.user.points,
        completedLessons: completedLessons,
        totalLessons: totalLessons,
      });
    } catch (error) {
      console.error("Complete lesson error:", error);

      res.status(500).json({
        message: "Failed to complete lesson",
      });
    }
  }
);


// ======================================
// GET USER COURSE PROGRESS
// ======================================

router.get("/:courseId/progress", protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    const courseProgress = req.user.courseProgress.find(
      (item) => item.course.toString() === courseId
    );

    if (!courseProgress) {
      return res.json({
        progress: 0,
        completedLessons: [],
      });
    }

    res.json({
      progress: courseProgress.progress,
      completedLessons: courseProgress.completedLessons,
    });
  } catch (error) {
    console.error("Get course progress error:", error);

    res.status(500).json({
      message: "Failed to fetch course progress",
    });
  }
});


// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;