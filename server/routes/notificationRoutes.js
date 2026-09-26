const express = require("express");

const Notification = require("../models/notification");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================
// GET USER NOTIFICATIONS
// ======================================

router.get("/", protect, async (req, res) => {
  try {
    const notifications =
      await Notification.find({
        user: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(20);

    const unreadCount =
      await Notification.countDocuments({
        user: req.user._id,
        read: false,
      });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Fetch notifications error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});


// ======================================
// MARK ONE NOTIFICATION AS READ
// ======================================

router.put(
  "/:id/read",
  protect,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOne({
          _id: req.params.id,
          user: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      notification.read = true;

      await notification.save();

      res.json({
        message:
          "Notification marked as read",
        notification,
      });
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update notification",
      });
    }
  }
);


// ======================================
// MARK ALL AS READ
// ======================================

router.put(
  "/read-all",
  protect,
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          user: req.user._id,
          read: false,
        },
        {
          $set: {
            read: true,
          },
        }
      );

      res.json({
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update notifications",
      });
    }
  }
);


// ======================================
// DELETE ONE NOTIFICATION
// ======================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOneAndDelete({
          _id: req.params.id,
          user: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete notification",
      });
    }
  }
);


module.exports = router;