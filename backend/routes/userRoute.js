const express = require("express");
const route = express.Router();
const {
  userSignup,
  verifyEmail,
  logout,
  userLogin,
  forgotPassword,
  resetPassword,
  checkAuth,
  getUserSessions,
  terminateSession,
  UpdateProfile,
  uploadDP,
} = require("../controllers/user");
const { verifyToken } = require("../middleware/verifyToken");
const upload = require("../middleware/avatarUpload");

route.get("/check-auth", verifyToken, checkAuth);

route.post("/signup", userSignup);

route.post("/verify-email", verifyEmail);

route.post("/login", userLogin);

route.post("/logout", verifyToken, logout);

route.post("/forgot-password", forgotPassword);

route.post("/reset-password/:token", resetPassword);

route.get("/sessions", verifyToken, getUserSessions);

route.delete("/sessions/:sessionId", verifyToken, terminateSession);

route.put("/update-profile", verifyToken, UpdateProfile);

route.post("/upload-avatar", verifyToken, upload.single("avatar"), uploadDP);

module.exports = route;
