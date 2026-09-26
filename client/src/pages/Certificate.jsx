import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./Certificate.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Certificate() {
  const { courseId } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // ======================================
  // LOAD CERTIFICATE
  // ======================================

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          setError(
            "Please login to view your certificate."
          );

          setLoading(false);
          return;
        }

        // ======================================
        // STEP 1: CHECK EXISTING CERTIFICATE
        // ======================================

        const getResponse = await fetch(
          `http://localhost:5000/api/certificates/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (getResponse.ok) {
          const existingCertificate =
            await getResponse.json();

          setCertificate(
            existingCertificate
          );

          setLoading(false);
          return;
        }

        // ======================================
        // STEP 2: CREATE CERTIFICATE
        // ======================================

        const createResponse =
          await fetch(
            `http://localhost:5000/api/certificates/course/${courseId}`,
            {
              method: "POST",

              headers: {
                Authorization: `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        const createData =
          await createResponse.json();

        if (!createResponse.ok) {
          throw new Error(
            createData.message ||
              "Unable to create certificate."
          );
        }

        // ======================================
        // STEP 3: SAVE CERTIFICATE
        // ======================================

        setCertificate(
          createData.certificate
        );
      } catch (error) {
        console.error(
          "Certificate error:",
          error
        );

        setError(
          error.message ||
            "Unable to load certificate."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCertificate();
  }, [courseId]);

  // ======================================
  // DOWNLOAD CERTIFICATE
  // ======================================

  const downloadCertificate = async () => {
    try {
      setDownloading(true);

      const certificateElement =
        document.querySelector(
          ".certificate-container"
        );

      if (!certificateElement) {
        alert(
          "Certificate could not be found."
        );

        setDownloading(false);
        return;
      }

      const canvas =
        await html2canvas(
          certificateElement,
          {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
          }
        );

      const imageData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf =
        new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [
            canvas.width,
            canvas.height,
          ],
        });

      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );

      const safeCourseName =
        certificate.courseName
          .replace(
            /[^a-z0-9]/gi,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          );

      const fileName =
        `${safeCourseName}-Certificate.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error(
        "Certificate download error:",
        error
      );

      alert(
        "Unable to download certificate."
      );
    } finally {
      setDownloading(false);
    }
  };

  // ======================================
  // FORMAT DATE
  // ======================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="certificate-page">

        <div className="certificate-loading">

          <div className="certificate-loading-icon">
            📜
          </div>

          <h2>
            Preparing your certificate...
          </h2>

          <p>
            Please wait while we prepare
            your certificate.
          </p>

        </div>

      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error) {
    return (
      <div className="certificate-page">

        <div className="certificate-error">

          <div className="certificate-error-icon">
            📜
          </div>

          <h2>
            Certificate Not Available
          </h2>

          <p>
            {error}
          </p>

          <Link
            to={`/courses/${courseId}`}
            className="certificate-back-button"
          >
            ← Back to Course
          </Link>

        </div>

      </div>
    );
  }

  // ======================================
  // CERTIFICATE
  // ======================================

  return (
    <div className="certificate-page">

      {/* ======================================
          CERTIFICATE
      ====================================== */}

      <div className="certificate-container">

        {/* DECORATIVE CORNERS */}

        <div className="certificate-corner top-left"></div>
        <div className="certificate-corner top-right"></div>
        <div className="certificate-corner bottom-left"></div>
        <div className="certificate-corner bottom-right"></div>

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="certificate-header">

          <div className="certificate-brand">

            <div className="certificate-brand-mark">
              E
            </div>

            <div>
              <div className="certificate-logo">
                Edu<span>care</span>
              </div>

              <div className="certificate-brand-subtitle">
                SMART LEARNING PLATFORM
              </div>
            </div>

          </div>

          <div className="certificate-header-right">

            <div className="certificate-label">
              CERTIFICATE
            </div>

            <div className="certificate-label-small">
              OF COMPLETION
            </div>

          </div>

        </div>

        {/* ======================================
            MAIN CONTENT
        ====================================== */}

        <div className="certificate-content">

          <div className="certificate-trophy">
            🏆
          </div>

          <p className="certificate-presented">
            THIS CERTIFICATE IS PROUDLY PRESENTED TO
          </p>

          <h1 className="student-name">
            {certificate.studentName}
          </h1>

          <div className="student-name-line"></div>

          <p className="certificate-description">
            This certificate recognizes the
            successful completion of
          </p>

          <h2 className="course-name">
            {certificate.courseName}
          </h2>

          <p className="certificate-description">
            The learner has successfully completed
            the required lessons, learning activities,
            and final assessment for this course.
          </p>

        </div>

        {/* ======================================
            CERTIFICATE DETAILS
        ====================================== */}

        <div className="certificate-details">

          <div className="certificate-detail">

            <span>
              Certificate ID
            </span>

            <strong>
              {certificate.certificateId}
            </strong>

          </div>

          <div className="certificate-detail">

            <span>
              Date of Completion
            </span>

            <strong>
              {formatDate(
                certificate.completedAt
              )}
            </strong>

          </div>

          <div className="certificate-detail">

            <span>
              Instructor
            </span>

            <strong>
              {certificate.course?.instructor ||
                "Educare Academy"}
            </strong>

          </div>

        </div>

        {/* ======================================
            FOOTER
        ====================================== */}

        <div className="certificate-footer">

          <div className="certificate-signature">

            <div className="signature-line"></div>

            <strong>
              Educare Academy
            </strong>

            <span>
              Authorized Signature
            </span>

          </div>

          <div className="certificate-seal">

            <div className="seal-inner">
              ✓
            </div>

            <span>
              VERIFIED
            </span>

          </div>

          <div className="certificate-signature">

            <div className="signature-line"></div>

            <strong>
              Course Completion
            </strong>

            <span>
              Educare Learning
            </span>

          </div>

        </div>

        {/* ======================================
            VERIFICATION
        ====================================== */}

        <div className="certificate-verification">

          <span>
            Certificate ID:{" "}
            <strong>
              {certificate.certificateId}
            </strong>
          </span>

          <span>
            •
          </span>

          <span>
            Issued by Educare
          </span>

        </div>

      </div>

      {/* ======================================
          ACTION BUTTONS
      ====================================== */}

      <div className="certificate-actions">

        <Link
          to={`/courses/${courseId}`}
          className="certificate-action secondary"
        >
          ← Back to Course
        </Link>

        <button
          onClick={downloadCertificate}
          className="certificate-action download-button"
          disabled={downloading}
        >
          {downloading
            ? "⏳ Preparing PDF..."
            : "📥 Download Certificate"}
        </button>

        <Link
          to={`/verify-certificate?certificateId=${certificate.certificateId}`}
          className="certificate-action verify-button"
        >
          ✓ Verify Certificate
        </Link>

        <Link
          to="/dashboard"
          className="certificate-action"
        >
          Go to Dashboard
        </Link>

      </div>

    </div>
  );
}

export default Certificate;