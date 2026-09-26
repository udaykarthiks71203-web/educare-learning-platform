import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import "./VerifyCertificate.css";

function VerifyCertificate() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [certificateId, setCertificateId] =
    useState("");

  const [certificate, setCertificate] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================
  // CHECK LOGIN STATUS
  // ======================================

  const isLoggedIn =
    Boolean(localStorage.getItem("token"));

  // ======================================
  // VERIFY CERTIFICATE
  // ======================================

  const verifyCertificate = async (id) => {
    const cleanId = id.trim();

    if (!cleanId) {
      setError(
        "Please enter a Certificate ID."
      );
      return;
    }

    setError("");
    setCertificate(null);
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/certificates/verify/${encodeURIComponent(
          cleanId
        )}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Certificate not found."
        );
      }

      setCertificate(
        data.certificate
      );

    } catch (error) {
      console.error(
        "Verification error:",
        error
      );

      setError(
        error.message ||
          "Unable to verify certificate."
      );

    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // AUTOMATIC VERIFICATION FROM URL
  // ======================================

  useEffect(() => {
    const urlCertificateId =
      searchParams.get(
        "certificateId"
      );

    if (urlCertificateId) {
      setCertificateId(
        urlCertificateId
      );

      verifyCertificate(
        urlCertificateId
      );
    }
  }, [searchParams]);

  // ======================================
  // FORM SUBMIT
  // ======================================

  const handleSubmit = (e) => {
    e.preventDefault();

    verifyCertificate(
      certificateId
    );
  };

  // ======================================
  // VERIFY ANOTHER
  // ======================================

  const verifyAnother = () => {
    setCertificate(null);
    setCertificateId("");
    setError("");

    // Remove certificateId from URL
    navigate(
      "/verify-certificate",
      { replace: true }
    );
  };

  // ======================================
  // BACK BUTTON
  // ======================================

  const handleBack = () => {
    if (
      localStorage.getItem("token")
    ) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="verify-page">

      {/* ==================================
          HEADER
      ================================== */}

      <nav className="verify-navbar">

        <Link
          to="/"
          className="verify-logo"
        >
          Edu<span>care</span>
        </Link>

        <div className="verify-nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/courses">
            Courses
          </Link>

          {!isLoggedIn && (
            <Link to="/login">
              Login
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/dashboard">
              Dashboard
            </Link>
          )}

        </div>

      </nav>

      {/* ==================================
          MAIN
      ================================== */}

      <main className="verify-main">

        {/* ==================================
            LOADING
        ================================== */}

        {loading && !certificate ? (

          <div className="verify-card">

            <div className="verify-icon">
              🔍
            </div>

            <p className="verify-label">
              CERTIFICATE VERIFICATION
            </p>

            <h1>
              Verifying Certificate
            </h1>

            <p className="verify-description">
              Please wait while we verify
              the certificate with Educare.
            </p>

          </div>

        ) : !certificate ? (

          /* ==================================
             VERIFY FORM
          ================================== */

          <div className="verify-card">

            <div className="verify-icon">
              🏆
            </div>

            <p className="verify-label">
              CERTIFICATE VERIFICATION
            </p>

            <h1>
              Verify Your Certificate
            </h1>

            <p className="verify-description">
              Enter the Certificate ID
              shown on your Educare
              certificate to verify its
              authenticity.
            </p>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="verify-form"
            >

              <label>
                Certificate ID
              </label>

              <input
                type="text"
                placeholder="Example: EDU-A1B2C3D4E5"
                value={certificateId}
                onChange={(e) =>
                  setCertificateId(
                    e.target.value
                  )
                }
              />

              {error && (
                <div className="verify-error">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "🔍 Verify Certificate"}
              </button>

            </form>

            <p className="verify-help">
              The Certificate ID can be
              found at the bottom of your
              Educare certificate.
            </p>
            <button
  onClick={handleBack}
  className="verify-home-button"
>
  ← Back to Home
</button>

          </div>

        ) : (

          /* ==================================
             VERIFIED CERTIFICATE
          ================================== */

          <div className="verified-card">

            {/* VERIFIED ICON */}

            <div className="verified-icon">
              ✓
            </div>

            <h1>
              Certificate Verified
            </h1>

            <p className="verified-message">
              This certificate has been
              successfully verified and is
              registered with Educare.
            </p>

            {/* STATUS */}

            <div className="verified-status">

              <span>
                ✓
              </span>

              Authentic Certificate

            </div>

            {/* DETAILS */}

            <div className="verified-details">

              {/* STUDENT */}

              <div className="verified-detail">

                <span>
                  Student
                </span>

                <strong>
                  {certificate.studentName ||
                    "Not available"}
                </strong>

              </div>

              {/* COURSE */}

              <div className="verified-detail">

                <span>
                  Course
                </span>

                <strong>
                  {certificate.courseName ||
                    "Not available"}
                </strong>

              </div>

              {/* INSTRUCTOR */}

              <div className="verified-detail">

                <span>
                  Instructor
                </span>

                <strong>
                  {certificate.instructor ||
                    "Educare Academy"}
                </strong>

              </div>

              {/* CATEGORY */}

              <div className="verified-detail">

                <span>
                  Category
                </span>

                <strong>
                  {certificate.category ||
                    "Learning"}
                </strong>

              </div>

              {/* CERTIFICATE ID */}

              <div className="verified-detail">

                <span>
                  Certificate ID
                </span>

                <strong>
                  {certificate.certificateId}
                </strong>

              </div>

              {/* COMPLETION DATE */}

              <div className="verified-detail">

                <span>
                  Completed On
                </span>

                <strong>

                  {certificate.completedAt
                    ? new Date(
                        certificate.completedAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Not available"}

                </strong>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="verified-actions">

              {/* VERIFY ANOTHER */}

              <button
                onClick={
                  verifyAnother
                }
                className="verify-again-button"
              >
                🔍 Verify Another
              </button>

              {/* BACK BUTTON */}

              <button
                onClick={
                  handleBack
                }
                className="verify-home-button"
              >
                ← Back to{" "}
                {isLoggedIn
                  ? "Dashboard"
                  : "Home"}
              </button>

            </div>

          </div>

        )}

      </main>

      {/* ==================================
          FOOTER
      ================================== */}

      <footer className="verify-footer">

        ©{" "}
        {new Date().getFullYear()}{" "}
        Educare Academy. All rights
        reserved.

      </footer>

    </div>
  );
}

export default VerifyCertificate;