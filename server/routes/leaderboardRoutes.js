const express = require("express");
const User = require("../models/user");

const router = express.Router();

// ======================================
// GET LEADERBOARD
// ======================================

router.get("/", async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        points: 1,
      }
    )
      .sort({ points: -1, name: 1 })
      .limit(100);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.points || 0,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);

    res.status(500).json({
      message: "Failed to fetch leaderboard",
    });
  }
});

module.exports = router;