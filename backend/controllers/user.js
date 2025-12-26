const userModal = require("../models/userModel");
const sessionModal = require("../models/sessionModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
// const mongoose = require("mongoose")
const { getLocalIPv4 } = require("../utils/ipfetcher");
const getDeviceInfo = require("../utils/getDeviceInfo");
const generateTokenAndSetCookie = require("../utils/generateToken");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/emails");
const userModel = require("../models/userModel");

module.exports.userSignup = async (req, res) => {
  // res.json({msg:"hi"})
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required.");
    }

    const userAlreadyExists = await userModal.findOne({ email });
    //    console.log(userAlreadyExists)
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ sucess: "false", message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await userModal.create({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });

    await user.save();

    // now we get the device data
    const deviceInfo = getDeviceInfo(req);

    // create a session in db
    const session = await sessionModal.create({
      user: user._id,
      ipAddress: deviceInfo.ip,
      device: deviceInfo.device,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
    });

    await session.save();

    // Create user folder
    const userFolderPath = path.join(
      __dirname,
      "..",
      "uploads",
      user._id.toString()
    );

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    generateTokenAndSetCookie(res, user._id, session.sessionId);

    //    send mail

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: "false", message: error.message });
  }
};

module.exports.verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await userModal.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: "false",
        message: "Invalid and expired verification code.",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: "true",
      message: "Email verified successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: "false", message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  await sessionModal.findOneAndDelete({ sessionId: req.sessionId });
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: "true", message: "Logged out successfully." });
};

module.exports.userLogin = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await userModal.findOne({
      $or: [{ name: identifier }, { email: identifier }],
    });
    // console.log(user)
    if (!user) {
      return res
        .status(400)
        .json({ success: "false", message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: "false", message: "password credentials" });
    }

    // now we get the device data
    const deviceInfo = getDeviceInfo(req);

    // create a session in db
    const session = await sessionModal.create({
      user: user._id,
      ipAddress: deviceInfo.ip,
      device: deviceInfo.device,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
    });

    await session.save();

    // Create user folder
    const userFolderPath = path.join(
      __dirname,
      "..",
      "uploads",
      user._id.toString()
    );

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    generateTokenAndSetCookie(res, user._id, session.sessionId);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: "true",
      message: "Logged in successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login", error);
    res.status(400).json({ success: "false", message: error.message });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModal.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token.
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //Get the correct local IPv4 address dynamically
    const localIP = await getLocalIPv4();

    await sendPasswordResetEmail(
      user.email,
      `http://${localIP}:${process.env.PORT}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await userModal.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.save();

    // Send the email
    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log("Error to send password reset success email", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.checkAuth = async (req, res) => {
  try {
    const user = await userModal.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in check auth", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.userId;
    const currentSessionId = req.sessionId; // Extracted from your JWT via middleware

    // Find all sessions for this user
    const sessions = await sessionModal.find({ user: userId }).lean();

    // Mark the current session
    const formattedSessions = sessions.map((session) => ({
      ...session,
      isCurrent: session.sessionId === currentSessionId,
    }));

    res.status(200).json({
      success: true,
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching sessions.",
    });
  }
};

exports.terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId._id;

    // Ensure the session belongs to the logged-in user
    const sessionToDelete = await sessionModal.findOne({ sessionId, userId });
    if (!sessionToDelete) {
      return res
        .status(404)
        .json({ message: "Session not found or does not belong to you" });
    }

    await sessionModal.findOneAndDelete({ sessionId });
    const sessions = await sessionModal.find({ userId });
    res
      .status(200)
      .json({ sessions: sessions, message: "Session terminated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.UpdateProfile = async (req, res) => {
  const { username, newPassword, currentPassword } = req.body;
  try {
    const user = await userModal.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect current password. Profile update failed.",
      });
    }

    if (username !== undefined && username !== null) {
      user.name = username;
    }

    if (newPassword) {
      // Generate a salt (random string) for hashing.
      const salt = await bcrypt.genSalt(10);
      // Hash the new password with the generated salt.
      user.password = await bcrypt.hash(newPassword, salt);
    }
    // Save the updated user document to the database.
    await user.save();

    res.status(200).json({
      success: "true",
      message: "User Updated successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error to update profile" });
  }
};

exports.uploadDP = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await userModal.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🧹 DELETE OLD AVATAR (IF NOT DEFAULT)
    if (user.avatar && user.avatar !== "/uploads/default-avatar.png") {
      const oldAvatarPath = path.join(__dirname, "..", "uploads", user.avatar);

      // check file exists before deleting
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // 🆕 SAVE NEW AVATAR
    const avatarPath = `/avatars/${req.file.filename}`;
    user.avatar = avatarPath;
    await user.save();

    res.status(200).json({
      message: "Avatar updated successfully",
      avatarUrl: avatarPath,
      user,
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};
