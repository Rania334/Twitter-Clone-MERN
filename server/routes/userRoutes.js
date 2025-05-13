const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { updateUser,getUserByUsername,followUnfollowUser } = require("../controllers/userController");

const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put(
  "/update",
  authenticateToken,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "wallpaper", maxCount: 1 }
  ]),
  updateUser
);

router.get("/getUser/:username", authenticateToken,getUserByUsername);

router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

router.put('/follow/:id', authenticateToken, followUnfollowUser);


module.exports = router;
