import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Profile information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editing, setEditing] = useState(false);

  // Loading / profile saving
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");


  // ======================================
  // GET USER
  // ======================================

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setUser(data);

        setName(data.name);
        setEmail(data.email);

      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );

        setError("Unable to load profile.");

      } finally {
        setLoading(false);
      }
    };

    fetchUser();

  }, [navigate]);


  // ======================================
  // SAVE PROFILE
  // ======================================

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim() || !email.trim()) {
      setError(
        "Name and email are required."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/update-profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to update profile."
        );
        return;
      }

      // Update displayed user
      setUser((previousUser) => ({
        ...previousUser,
        name: data.user.name,
        email: data.user.email,
      }));

      setName(data.user.name);
      setEmail(data.user.email);

      setEditing(false);

      setMessage(
        "Profile updated successfully!"
      );

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

    } finally {
      setSaving(false);
    }
  };


  // ======================================
  // CANCEL EDIT
  // ======================================

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);

    setEditing(false);

    setMessage("");
    setError("");
  };


  // ======================================
  // CHANGE PASSWORD
  // ======================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    // Check fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill all password fields."
      );
      return;
    }

    // Check new password length
    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    // Check password confirmation
    if (
      newPassword !== confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(
          data.message ||
            "Unable to change password."
        );
        return;
      }

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        "Password changed successfully!"
      );

    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setPasswordError(
        "Something went wrong. Please try again."
      );

    } finally {
      setChangingPassword(false);
    }
  };


  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="profile-loading">
          Loading profile...
        </div>
      </>
    );
  }


  // ======================================
  // PAGE
  // ======================================

  return (
    <div className="profile-page">

      <Navbar />

      <main className="profile-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="profile-header">

          <div>

            <p className="profile-label">
              ACCOUNT
            </p>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your Educare account
              information.
            </p>

          </div>

        </div>


        {/* ======================================
            PROFILE MESSAGES
        ====================================== */}

        {message && (
          <div className="profile-success">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            ⚠ {error}
          </div>
        )}


        {/* ======================================
            PROFILE CARD
        ====================================== */}

        <div className="profile-card">

          {/* PROFILE TOP */}

          <div className="profile-top">

            <div className="profile-avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>


            <div className="profile-user-info">

              <h2>
                {user?.name}
              </h2>

              <p>
                {user?.email}
              </p>

              <span className="profile-role">
                {user?.role || "Student"}
              </span>

            </div>

          </div>


          {/* ======================================
              ACCOUNT INFORMATION
          ====================================== */}

          {!editing ? (

            <div className="profile-information">

              <div className="profile-info-item">

                <span>
                  Full Name
                </span>

                <strong>
                  {user?.name}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Email Address
                </span>

                <strong>
                  {user?.email}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Account Type
                </span>

                <strong>
                  {user?.role || "Student"}
                </strong>

              </div>

            </div>

          ) : (

            <form
              className="profile-edit-form"
              onSubmit={handleSave}
            >

              <div className="profile-input-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                />

              </div>


              <div className="profile-input-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                />

              </div>


              <div className="profile-edit-buttons">

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>


                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>

          )}


          {/* ======================================
              EDIT BUTTON
          ====================================== */}

          {!editing && (

            <div className="profile-actions">

              <button
                className="profile-edit-button"
                onClick={() => {
                  setEditing(true);
                  setMessage("");
                  setError("");
                }}
              >
                ✏️ Edit Profile
              </button>

            </div>

          )}

        </div>


        {/* ======================================
            SECURITY
        ====================================== */}

        <div className="profile-section">

          <div className="profile-section-header">

            <div>

              <p className="profile-label">
                SECURITY
              </p>

              <h2>
                Change Password
              </h2>

            </div>

          </div>


          <div className="profile-security-card">

            {passwordMessage && (
              <div className="profile-success">

                ✓ {passwordMessage}

              </div>
            )}


            {passwordError && (
              <div className="profile-error">

                ⚠ {passwordError}

              </div>
            )}


            <form
              className="profile-password-form"
              onSubmit={handleChangePassword}
            >

              {/* CURRENT PASSWORD */}

              <div className="profile-input-group">

                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                />

              </div>


              {/* NEW PASSWORD */}

              <div className="profile-input-group">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="profile-input-group">

                <label>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                />

              </div>


              <button
                type="submit"
                className="profile-password-button"
                disabled={changingPassword}
              >

                {changingPassword
                  ? "Changing Password..."
                  : "🔒 Change Password"}

              </button>

            </form>

          </div>

        </div>


        {/* ======================================
            LEARNING OVERVIEW
        ====================================== */}

        <div className="profile-section">

          <div className="profile-section-header">

            <div>

              <p className="profile-label">
                LEARNING
              </p>

              <h2>
                Learning Overview
              </h2>

            </div>

          </div>


          <div className="profile-stats">

            {/* ENROLLED */}

            <div className="profile-stat-card">

              <span className="profile-stat-icon">
                📚
              </span>

              <strong>
                {user?.enrolledCourses?.length || 0}
              </strong>

              <span>
                Enrolled Courses
              </span>

            </div>


            {/* COMPLETED */}

            <div className="profile-stat-card">

              <span className="profile-stat-icon">
                🏆
              </span>

              <strong>
                {user?.courseProgress?.filter(
                  (course) =>
                    course.courseCompleted === true
                ).length || 0}
              </strong>

              <span>
                Completed Courses
              </span>

            </div>


            {/* POINTS */}

            <div className="profile-stat-card">

              <span className="profile-stat-icon">
                ⭐
              </span>

              <strong>
                {user?.points || 0}
              </strong>

              <span>
                Learning Points
              </span>

            </div>


            {/* PROGRESS */}

            <div className="profile-stat-card">

              <span className="profile-stat-icon">
                📈
              </span>

              <strong>
                {user?.progress || 0}%
              </strong>

              <span>
                Overall Progress
              </span>

            </div>

          </div>

        </div>


        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <div className="profile-section">

          <p className="profile-label">
            QUICK ACTIONS
          </p>

          <div className="profile-quick-actions">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              📊 Dashboard
            </button>


            <button
              onClick={() =>
                navigate("/courses")
              }
            >
              📚 Browse Courses
            </button>


            <button
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;