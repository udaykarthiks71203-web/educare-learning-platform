import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // ======================================
  // NOTIFICATIONS
  // ======================================

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] =
    useState(false);

  // ======================================
  // GET USER
  // ======================================

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
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

        if (!response.ok) {
          localStorage.removeItem("token");
          setUser(null);
          return;
        }

        const data = await response.json();

        setUser(data);
      } catch (error) {
        console.error(
          "Navbar user error:",
          error
        );
      }
    };

    fetchUser();
  }, []);

  // ======================================
  // GET NOTIFICATIONS
  // ======================================

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setNotifications(
          data.notifications || []
        );

        setUnreadCount(
          data.unreadCount || 0
        );
      } catch (error) {
        console.error(
          "Notification loading error:",
          error
        );
      }
    };

    fetchNotifications();
  }, [user]);

  // ======================================
  // MARK ONE NOTIFICATION AS READ
  // ======================================

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );

      setUnreadCount((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );
    }
  };

  // ======================================
  // OPEN NOTIFICATION
  // ======================================

  const handleNotificationClick = async (
    notification
  ) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }

    setNotificationOpen(false);

    if (notification.link) {
      navigate(notification.link);
      return;
    }

    if (notification.type === "quiz") {
      navigate("/courses");
      return;
    }

    if (notification.type === "course") {
      navigate("/dashboard");
      return;
    }

    if (notification.type === "certificate") {
      navigate("/dashboard");
      return;
    }
  };

  // ======================================
  // MARK ALL AS READ
  // ======================================

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setNotifications([]);
    setUnreadCount(0);

    setProfileOpen(false);
    setNotificationOpen(false);

    navigate("/login");
  };

  // ======================================
  // NOTIFICATION ICON
  // ======================================

  const getNotificationIcon = (type) => {
    if (type === "course") {
      return "📚";
    }

    if (type === "quiz") {
      return "🎯";
    }

    if (type === "certificate") {
      return "🏆";
    }

    return "🔔";
  };

  // ======================================
  // FORMAT DATE
  // ======================================

  const formatNotificationDate = (date) => {
    const notificationDate =
      new Date(date);

    return notificationDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <nav className="main-navbar">

      <div className="main-navbar-inner">

        {/* ======================================
            LOGO
        ====================================== */}

        <Link
          to={user ? "/dashboard" : "/"}
          className="main-logo"
        >
          Edu<span>care</span>
        </Link>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <div className="main-nav-links">

          {user ? (
            <>
              <Link to="/courses">
                Courses
              </Link>

              <Link to="/dashboard">
                Dashboard
              </Link>

              {/* ======================================
                  LEADERBOARD
              ====================================== */}

              <Link to="/leaderboard">
                Leaderboard
              </Link>

              <Link to="/compiler">
                Python Compiler
              </Link>
            </>
          ) : (
            <>
              <Link to="/">
                Home
              </Link>

              <Link to="/courses">
                Courses
              </Link>

              <Link to="/verify-certificate">
                Verify Certificate
              </Link>

              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="main-get-started"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

        {/* ======================================
            RIGHT SIDE
        ====================================== */}

        {user && (

          <div className="main-navbar-right">

            {/* ======================================
                NOTIFICATION
            ====================================== */}

            <div className="main-notification-wrapper">

              <button
                className="main-notification-button"
                onClick={() => {
                  setNotificationOpen(
                    (previous) =>
                      !previous
                  );

                  setProfileOpen(false);
                }}
              >

                <span className="main-notification-icon">
                  🔔
                </span>

                {unreadCount > 0 && (
                  <span className="main-notification-badge">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}

              </button>

              {/* ======================================
                  NOTIFICATION DROPDOWN
              ====================================== */}

              {notificationOpen && (

                <div className="main-notification-dropdown">

                  <div className="main-notification-header">

                    <div>
                      <strong>
                        Notifications
                      </strong>

                      {unreadCount > 0 && (
                        <span>
                          {unreadCount} unread
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (

                      <button
                        onClick={
                          markAllAsRead
                        }
                      >
                        Mark all as read
                      </button>

                    )}

                  </div>

                  <div className="main-notification-list">

                    {notifications.length === 0 ? (

                      <div className="main-no-notifications">

                        <div>
                          🔔
                        </div>

                        <strong>
                          No notifications
                        </strong>

                        <p>
                          You're all caught up!
                        </p>

                      </div>

                    ) : (

                      notifications.map(
                        (notification) => (

                          <div
                            key={
                              notification._id
                            }
                            className={`main-notification-item ${
                              !notification.read
                                ? "unread"
                                : ""
                            }`}
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                          >

                            <div className="main-notification-item-icon">

                              {getNotificationIcon(
                                notification.type
                              )}

                            </div>

                            <div className="main-notification-content">

                              <strong>
                                {notification.title}
                              </strong>

                              <p>
                                {notification.message}
                              </p>

                              <small>
                                {formatNotificationDate(
                                  notification.createdAt
                                )}
                              </small>

                            </div>

                            {!notification.read && (

                              <span className="main-unread-dot"></span>

                            )}

                          </div>

                        )
                      )

                    )}

                  </div>

                </div>

              )}

            </div>

            {/* ======================================
                PROFILE
            ====================================== */}

            <div className="main-profile-wrapper">

              <button
                className="main-profile-button"
                onClick={() => {
                  setProfileOpen(
                    (previous) =>
                      !previous
                  );

                  setNotificationOpen(false);
                }}
              >

                <span className="main-profile-avatar">

                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase()}

                </span>

                <span className="main-profile-name">
                  {user?.name}
                </span>

                <span className="main-profile-arrow">
                  ▼
                </span>

              </button>

              {/* ======================================
                  PROFILE DROPDOWN
              ====================================== */}

              {profileOpen && (

                <div className="main-profile-dropdown">

                  <div className="main-profile-header">

                    <strong>
                      {user?.name}
                    </strong>

                    <span>
                      {user?.email}
                    </span>

                  </div>

                  <div className="main-profile-divider"></div>

                  <Link
                    to="/profile"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    👤 My Profile
                  </Link>

                  <Link
                    to="/courses"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    🔎 Browse Courses
                  </Link>

                  <Link
                    to="/leaderboard"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    🏆 Leaderboard
                  </Link>

                  <Link
                    to="/compiler"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    🐍 Python Compiler
                  </Link>

                  <div className="main-profile-divider"></div>

                  <button
                    className="main-logout-button"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>

                </div>

              )}

            </div>

          </div>

        )}

      </div>

    </nav>
  );
}

export default Navbar;