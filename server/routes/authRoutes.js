const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();


// ======================================
// REGISTER
// ======================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Registration successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ======================================
// LOGIN
// ======================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ======================================
// GET CURRENT USER
// ======================================

router.get("/me", async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // ======================================
    // VERIFY TOKEN
    // ======================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findById(
      decoded.userId
    )
      .select("-password")
      .populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ======================================
    // SYNC COURSE COMPLETION
    // ======================================

    let userDataChanged = false;

    user.courseProgress.forEach(
      (courseProgress) => {
        if (
          courseProgress.progress === 100 &&
          courseProgress.quizCompleted === true &&
          courseProgress.courseCompleted !== true
        ) {
          courseProgress.courseCompleted = true;

          if (!courseProgress.completedAt) {
            courseProgress.completedAt = new Date();
          }

          userDataChanged = true;
        }
      }
    );

    if (userDataChanged) {
      await user.save();
    }

    // ======================================
    // CALCULATE OVERALL PROGRESS
    // ======================================

    let overallProgress = 0;

    if (user.courseProgress.length > 0) {
      const totalProgress =
        user.courseProgress.reduce(
          (sum, course) =>
            sum + course.progress,
          0
        );

      overallProgress = Math.round(
        totalProgress /
          user.courseProgress.length
      );
    }

    // ======================================
    // SEND USER DATA
    // ======================================

    res.json({
      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      enrolledCourses:
        user.enrolledCourses,

      courseProgress:
        user.courseProgress,

      progress:
        overallProgress,

      points:
        user.points,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
});


// ======================================
// UPDATE PROFILE
// ======================================

router.put("/update-profile", async (req, res) => {
  try {
    // ======================================
    // GET TOKEN
    // ======================================

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // ======================================
    // VERIFY TOKEN
    // ======================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ======================================
    // GET USER
    // ======================================

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ======================================
    // GET UPDATED DATA
    // ======================================

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // ======================================
    // CHECK EMAIL
    // ======================================

    const normalizedEmail =
      email.toLowerCase().trim();

    if (normalizedEmail !== user.email) {
      const existingUser =
        await User.findOne({
          email: normalizedEmail,
        });

      if (
        existingUser &&
        existingUser._id.toString() !==
          user._id.toString()
      ) {
        return res.status(400).json({
          message: "Email is already in use",
        });
      }
    }

    // ======================================
    // UPDATE USER
    // ======================================

    user.name = name.trim();
    user.email = normalizedEmail;

    await user.save();

    // ======================================
    // SEND UPDATED USER
    // ======================================

    res.json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
});

// ======================================
// CHANGE PASSWORD
// ======================================

router.put("/change-password", async (req, res) => {
  try {
    // Get token
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get passwords
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // Check fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "Please fill all password fields",
      });
    }

    // Check new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    // Check passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }

    // Check current password
    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    // Save new password
    user.password = hashedPassword;

    await user.save();

    res.json({
      message:
        "Password changed successfully",
    });

  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(401).json({
      message:
        "Invalid or expired token",
    });
  }
});

// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;