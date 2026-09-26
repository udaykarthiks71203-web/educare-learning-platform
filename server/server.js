const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const leaderboardRoutes = require("./routes/leaderboardRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const quizRoutes = require("./routes/quizRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const compilerRoutes = require("./routes/compilerRoutes");

dotenv.config();

const app = express();

// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());
app.use(express.json());

// ==============================
// ROUTES
// ==============================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/courses",
  courseRoutes
);

app.use(
  "/api/quizzes",
  quizRoutes
);

app.use(
  "/api/certificates",
  certificateRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

// ==============================
// LEADERBOARD
// ==============================

app.use(
  "/api/leaderboard",
  leaderboardRoutes
);

// ==============================
// AI CHATBOT
// ==============================

app.use(
  "/api/ai",
  aiRoutes
);

// ==============================
// PYTHON COMPILER
// ==============================

app.use(
  "/api/compiler",
  compilerRoutes
);

// ==============================
// MONGODB CONNECTION
// ==============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully ✅"
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed ❌"
    );

    console.error(error.message);
  });

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.json({
    message:
      "Educare API is running 🚀",
  });
});

// ==============================
// SERVER
// ==============================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Educare server running on port ${PORT}`
  );
});