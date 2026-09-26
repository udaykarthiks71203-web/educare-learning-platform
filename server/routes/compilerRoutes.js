const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { spawn } = require("child_process");

const router = express.Router();

// ======================================
// RUN PYTHON CODE
// ======================================

router.post("/run", async (req, res) => {
  const { code } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({
      message: "Python code is required.",
    });
  }

  // Basic safety protection for this local demo.
  const blockedPatterns = [
    /\bimport\s+os\b/,
    /\bfrom\s+os\b/,
    /\bimport\s+subprocess\b/,
    /\bfrom\s+subprocess\b/,
    /\bimport\s+socket\b/,
    /\bfrom\s+socket\b/,
    /\bimport\s+shutil\b/,
    /\bfrom\s+shutil\b/,
    /\bimport\s+ctypes\b/,
    /\bfrom\s+ctypes\b/,
    /\bimport\s+requests\b/,
    /\bfrom\s+requests\b/,
    /\bimport\s+urllib\b/,
    /\bfrom\s+urllib\b/,
    /\bimport\s+pathlib\b/,
    /\bfrom\s+pathlib\b/,
    /\b__import__\b/,
    /\beval\s*\(/,
    /\bexec\s*\(/,
  ];

  const isBlocked = blockedPatterns.some(
    (pattern) => pattern.test(code)
  );

  if (isBlocked) {
    return res.status(400).json({
      message:
        "This code contains a restricted operation.",
    });
  }

  const fileName = `educare_${crypto
    .randomBytes(8)
    .toString("hex")}.py`;

  const filePath = path.join(
    os.tmpdir(),
    fileName
  );

  try {
    // Create temporary Python file
    fs.writeFileSync(
      filePath,
      code,
      "utf8"
    );

    let pythonCommand = "python";

    // Windows Python launcher fallback
    if (process.platform === "win32") {
      pythonCommand = "python";
    }

    const pythonProcess = spawn(
      pythonCommand,
      ["-I", filePath],
      {
        shell: false,
        windowsHide: true,
      }
    );

    let output = "";
    let errorOutput = "";

    // ======================================
    // OUTPUT
    // ======================================

    pythonProcess.stdout.on(
      "data",
      (data) => {
        output += data.toString();

        // Prevent huge output
        if (output.length > 100000) {
          pythonProcess.kill();

          errorOutput =
            "Output exceeded the maximum allowed size.";
        }
      }
    );

    pythonProcess.stderr.on(
      "data",
      (data) => {
        errorOutput += data.toString();

        if (errorOutput.length > 50000) {
          pythonProcess.kill();
        }
      }
    );

    // ======================================
    // TIMEOUT
    // ======================================

    const timeout = setTimeout(() => {
      pythonProcess.kill();

      errorOutput =
        "Execution timed out. Your program must finish within 5 seconds.";
    }, 5000);

    // ======================================
    // PROCESS FINISHED
    // ======================================

    pythonProcess.on(
      "close",
      (exitCode) => {
        clearTimeout(timeout);

        // Delete temporary file
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          // Ignore cleanup error
        }

        if (errorOutput.trim()) {
          return res.json({
            output: output.trim(),
            error: errorOutput.trim(),
          });
        }

        return res.json({
          output: output.trim(),
          error: "",
          exitCode,
        });
      }
    );

    // ======================================
    // PROCESS ERROR
    // ======================================

    pythonProcess.on(
      "error",
      (error) => {
        clearTimeout(timeout);

        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          // Ignore cleanup error
        }

        console.error(
          "Python execution error:",
          error
        );

        return res.status(500).json({
          message:
            "Python could not be started. Make sure Python is installed and available in PATH.",
        });
      }
    );
  } catch (error) {
    console.error(
      "Compiler error:",
      error
    );

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      // Ignore cleanup error
    }

    return res.status(500).json({
      message:
        "Unable to execute Python code.",
    });
  }
});

module.exports = router;