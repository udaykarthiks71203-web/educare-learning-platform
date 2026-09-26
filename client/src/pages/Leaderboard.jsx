import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

function Leaderboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Leaderboard error:", error);
        setError("Unable to load leaderboard.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="leaderboard-page">

      {/* HEADER */}
      <div className="leaderboard-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h1>🏆 Educare Leaderboard</h1>

        <p>
          See how learners are progressing through Educare
          using learning points.
        </p>
      </div>

      {/* CONTENT */}
      <div className="leaderboard-container">

        {loading && (
          <div className="leaderboard-message">
            Loading leaderboard...
          </div>
        )}

        {error && (
          <div className="leaderboard-message error">
            {error}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="leaderboard-message">
            No learners found.
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="leaderboard-table">

            {/* TABLE HEADER */}
            <div className="leaderboard-row leaderboard-title">
              <div>Rank</div>
              <div>Learner</div>
              <div>Points</div>
            </div>

            {/* USERS */}
            {users.map((user) => (
              <div
                className={`leaderboard-row ${
                  user.rank <= 3
                    ? `top-${user.rank}`
                    : ""
                }`}
                key={user.rank}
              >
                <div className="rank">
                  {user.rank === 1 && "🥇"}
                  {user.rank === 2 && "🥈"}
                  {user.rank === 3 && "🥉"}
                  {user.rank > 3 && user.rank}
                </div>

                <div className="learner-name">
                  {user.name}
                </div>

                <div className="learner-points">
                  ⭐ {user.points} XP
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Leaderboard;