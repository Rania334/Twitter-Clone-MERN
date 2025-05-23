const express = require("express");
const multer = require("multer");
const { registerUser, loginUser, logoutUser, refreshToken,verifyEmail,verifyUser,resendVerify } = require("../controllers/userController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Apply multer for handling profilePic and wallpaper
router.post("/register", upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "wallpaper", maxCount: 1 },
]), registerUser);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);
router.post("/verify-email", verifyEmail);
router.post("/verify", verifyUser);
router.post("/resend-verify", resendVerify);


module.exports = router;
