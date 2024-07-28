// routes/authRoutes.js
const express = require("express");
const {
    login,
    refreshAccessToken,
    logout,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", authMiddleware, logout);

module.exports = router;
