import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PythonCompiler.css";

function PythonCompiler() {
  const navigate = useNavigate();

  const [code, setCode] = useState(
`name = "Educare"

print("Hello", name)

for i in range(5):
    print(i)`
  );

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================================
  // RUN CODE
  // ======================================

  const runCode = async () => {
    if (!code.trim()) {
      setOutput(
        "Please enter some Python code."
      );
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/compiler/run",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to run code."
        );
      }

      setOutput(
        data.error
          ? `${data.output || ""}\n${data.error}`
          : data.output ||
            "Program finished without output."
      );
    } catch (error) {
      setOutput(
        error.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // CLEAR
  // ======================================

  const clearCode = () => {
    setCode("");
    setOutput("");
  };

  // ======================================
  // EXAMPLE
  // ======================================

  const loadExample = () => {
    setCode(
`numbers = [10, 20, 30, 40, 50]

total = sum(numbers)

print("Numbers:", numbers)
print("Total:", total)
print("Average:", total / len(numbers))`
    );

    setOutput("");
  };

  return (
    <div className="compiler-page">

      {/* ======================================
          BACK TO DASHBOARD
      ====================================== */}

      <button
        className="compiler-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="compiler-header">

        <div>

          <p className="compiler-label">
            EDUCARE LAB
          </p>

          <h1>
            Python Compiler
          </h1>

          <p>
            Write, run and test Python code
            directly inside Educare.
          </p>

        </div>

        <div className="python-badge">
          🐍 Python
        </div>

      </div>

      {/* ======================================
          TOOLBAR
      ====================================== */}

      <div className="compiler-toolbar">

        <button
          className="run-button"
          onClick={runCode}
          disabled={loading}
        >
          {loading
            ? "Running..."
            : "▶ Run Code"}
        </button>

        <button
          className="example-button"
          onClick={loadExample}
        >
          Example
        </button>

        <button
          className="clear-button"
          onClick={clearCode}
        >
          Clear
        </button>

      </div>

      {/* ======================================
          WORKSPACE
      ====================================== */}

      <div className="compiler-workspace">

        {/* ======================================
            CODE EDITOR
        ====================================== */}

        <div className="editor-panel">

          <div className="panel-header">

            <span>
              main.py
            </span>

            <span>
              Python
            </span>

          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            spellCheck="false"
          />

        </div>

        {/* ======================================
            OUTPUT
        ====================================== */}

        <div className="output-panel">

          <div className="panel-header">

            <span>
              Output
            </span>

            {loading && (
              <span className="running-text">
                Running...
              </span>
            )}

          </div>

          <pre className="output-content">
            {output ||
              "Run your Python code to see the output here."}
          </pre>

        </div>

      </div>

      {/* ======================================
          TIPS
      ====================================== */}

      <div className="compiler-tips">

        <div>

          <strong>
            💡 Tip
          </strong>

          <span>
            Use print() to display results.
          </span>

        </div>

        <div>

          <strong>
            ⌨️ Editor
          </strong>

          <span>
            Write Python code in the editor.
          </span>

        </div>

        <div>

          <strong>
            ▶ Run
          </strong>

          <span>
            Click Run Code to execute your program.
          </span>

        </div>

      </div>

    </div>
  );
}

export default PythonCompiler;