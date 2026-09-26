const express = require("express");
const User = require("../models/user");

const router = express.Router();

// ==========================================
// EDUCARE AI KNOWLEDGE
// ==========================================

const EDUCARE_CONTEXT = `
You are Educare AI, an AI assistant inside the Educare learning platform.

Help students with:
- Using Educare
- Courses and enrollment
- Lessons
- Progress
- Quizzes
- Certificates
- Programming and technology

EDUCARE FEATURES:

Enrollment:
1. Open Courses.
2. Select a course.
3. Open course details.
4. Click Enroll Now.
5. The course becomes available in Dashboard.

Lessons:
- Courses contain lessons.
- Completing lessons increases progress.
- Continue Learning opens the next incomplete lesson.

Quizzes:
- Courses can contain a final quiz.
- Students need to complete required lessons and pass the quiz for course completion.

Certificates:
- Certificates become available after completing the required course requirements.
- Certificates can be downloaded.
- Certificate IDs can be verified using Verify Certificate.

IMPORTANT:
Use the student's actual data when it is provided.
Never invent personal information.
Never invent Educare features.

Keep answers concise and useful.
Use numbered steps when explaining how to use Educare.
For simple questions, answer in 2-5 sentences.
`;

// ==========================================
// GET USER DATA
// ==========================================

const getUserEducareData = async (userId) => {
  const user = await User.findById(userId)
    .populate("enrolledCourses");

  if (!user) {
    return null;
  }

  const enrolledCourses =
    user.enrolledCourses || [];

  const courseProgress =
    user.courseProgress || [];

  const courses =
    enrolledCourses.map((course) => {

      const progress =
        courseProgress.find(
          (item) =>
            String(item.course) ===
            String(course._id)
        );

      const completedLessons =
        progress?.completedLessons || [];

      let nextLesson = null;

      if (
        course.lessonList &&
        course.lessonList.length > 0
      ) {
        nextLesson =
          course.lessonList.find(
            (lesson) =>
              !completedLessons.some(
                (completedLesson) =>
                  String(completedLesson) ===
                  String(lesson._id)
              )
          );
      }

      return {
        title: course.title,

        progress:
          progress?.progress || 0,

        completedLessons:
          completedLessons.length,

        totalLessons:
          course.lessonList?.length ||
          course.lessons ||
          0,

        quizCompleted:
          progress?.quizCompleted || false,

        quizScore:
          progress?.quizScore ?? null,

        courseCompleted:
          progress?.courseCompleted || false,

        nextLesson:
          nextLesson?.title || null,
      };
    });

  return {
    name: user.name,
    points: user.points || 0,
    courses,
  };
};

// ==========================================
// CHAT
// POST /api/ai/chat
// ==========================================

router.post(
  "/chat",
  async (req, res) => {

    try {

      const { message } = req.body;

      if (
        !message ||
        !message.trim()
      ) {
        return res.status(400).json({
          message:
            "Please enter a message.",
        });
      }

      // ====================================
      // GET LOGGED-IN USER
      // ====================================

      let userData = null;

      const authHeader =
        req.headers.authorization;

      if (
        authHeader &&
        authHeader.startsWith("Bearer ")
      ) {

        try {

          const token =
            authHeader.split(" ")[1];

          const jwt =
            require("jsonwebtoken");

          const decoded =
            jwt.verify(
              token,
              process.env.JWT_SECRET
            );

          userData =
            await getUserEducareData(
              decoded.userId
            );

        } catch (error) {

          console.log(
            "No valid user session for AI."
          );

        }
      }

      // ====================================
      // STUDENT CONTEXT
      // ====================================

      let studentContext = "";

      if (userData) {

        studentContext = `
CURRENT STUDENT DATA:

Name: ${userData.name}
Points: ${userData.points}

Enrolled Courses:
${
  userData.courses.length
    ? userData.courses
        .map(
          (course) => `
- ${course.title}
  Progress: ${course.progress}%
  Lessons: ${course.completedLessons}/${course.totalLessons}
  Quiz completed: ${
    course.quizCompleted
      ? "Yes"
      : "No"
  }
  Quiz score: ${
    course.quizScore !== null
      ? course.quizScore + "%"
      : "Not attempted"
  }
  Course completed: ${
    course.courseCompleted
      ? "Yes"
      : "No"
  }
  Next lesson: ${
    course.nextLesson ||
    "None"
  }
`
        )
        .join("")
    : "No courses enrolled."
}
`;
      }

      // ====================================
      // PROMPT
      // ====================================

      const systemPrompt = `
${EDUCARE_CONTEXT}

${studentContext}
`;

      console.log(
        "User:",
        message
      );

      // ====================================
      // OLLAMA STREAM
      // ====================================

      const response =
        await fetch(
          "http://127.0.0.1:11434/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              model:
                "llama3.2:latest",

              messages: [

                {
                  role: "system",

                  content:
                    systemPrompt,
                },

                {
                  role: "user",

                  content:
                    message,
                },

              ],

              stream: true,

              options: {
                temperature: 0.3,
                num_predict: 300,
              },

            }),
          }
        );

      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Ollama error:",
          errorText
        );

        return res.status(500).json({
          message:
            "Unable to communicate with Ollama.",
        });
      }

      // ====================================
      // STREAM RESPONSE TO FRONTEND
      // ====================================

      res.setHeader(
        "Content-Type",
        "text/plain; charset=utf-8"
      );

      res.setHeader(
        "Cache-Control",
        "no-cache"
      );

      res.setHeader(
        "Connection",
        "keep-alive"
      );

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let buffer = "";

      while (true) {

        const {
          done,
          value,
        } =
          await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(
          value,
          {
            stream: true,
          }
        );

        const lines =
          buffer.split("\n");

        buffer =
          lines.pop() || "";

        for (const line of lines) {

          if (!line.trim()) {
            continue;
          }

          try {

            const json =
              JSON.parse(line);

            const content =
              json.message?.content;

            if (content) {
              res.write(content);
            }

          } catch (error) {

            console.log(
              "Stream parsing error:",
              error.message
            );

          }

        }
      }

      res.end();

    } catch (error) {

      console.error(
        "AI streaming error:",
        error
      );

      if (!res.headersSent) {

        return res.status(500).json({
          message:
            "Something went wrong while contacting Educare AI.",
        });

      }

      res.end();
    }
  }
);

module.exports = router;