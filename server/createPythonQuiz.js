const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Quiz = require("./models/quiz");

dotenv.config();

const courseId = "6ab4c0f2d3dc102dacdd4a4c";

const questions = [
  {
    question: "Which keyword is used to define a function in Python?",
    options: ["function", "def", "func", "define"],
    correctAnswer: "def",
    points: 10,
  },

  {
    question: "Which of the following is a Python list?",
    options: [
      "(1, 2, 3)",
      "[1, 2, 3]",
      "{1, 2, 3}",
      "<1, 2, 3>",
    ],
    correctAnswer: "[1, 2, 3]",
    points: 10,
  },

  {
    question: "Which symbol is used for a single-line comment in Python?",
    options: ["//", "/*", "#", "--"],
    correctAnswer: "#",
    points: 10,
  },

  {
    question: "Which data type is used to store True or False?",
    options: ["String", "Integer", "Boolean", "Float"],
    correctAnswer: "Boolean",
    points: 10,
  },

  {
    question: "Which loop is commonly used to iterate through a list?",
    options: ["repeat", "for", "loop", "iterate"],
    correctAnswer: "for",
    points: 10,
  },

  {
    question: "What is the output of 10 % 3?",
    options: ["3", "1", "0", "10"],
    correctAnswer: "1",
    points: 10,
  },

  {
    question: "Which method adds an item to the end of a Python list?",
    options: ["add()", "insert()", "append()", "push()"],
    correctAnswer: "append()",
    points: 10,
  },

  {
    question: "Which keyword is used to handle exceptions?",
    options: ["catch", "error", "try", "exceptonly"],
    correctAnswer: "try",
    points: 10,
  },

  {
    question: "Which of these is a Python dictionary?",
    options: [
      "[1, 2, 3]",
      "(1, 2, 3)",
      '{"name": "Uday"}',
      "{1, 2, 3}",
    ],
    correctAnswer: '{"name": "Uday"}',
    points: 10,
  },

  {
    question: "Which keyword is used to return a value from a function?",
    options: ["send", "return", "output", "result"],
    correctAnswer: "return",
    points: 10,
  },
];

async function createQuiz() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully ✅");

    // Check whether quiz already exists
    const existingQuiz = await Quiz.findOne({
      course: courseId,
    });

    if (existingQuiz) {
      console.log("Quiz already exists ❗");

      await mongoose.connection.close();

      return;
    }

    const quiz = await Quiz.create({
      course: courseId,

      title: "Python Course Final Quiz",

      description:
        "Test your knowledge of Python fundamentals covered throughout the course.",

      questions,

      passingScore: 60,
    });

    console.log("Python quiz created successfully 🎉");

    console.log("Quiz ID:", quiz._id);

    console.log(
      "Questions:",
      quiz.questions.length
    );

    await mongoose.connection.close();
  } catch (error) {
    console.error("Quiz creation failed ❌");
    console.error(error);

    await mongoose.connection.close();
  }
}

createQuiz();