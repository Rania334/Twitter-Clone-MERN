const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { updateUser,getUserByUsername,followUnfollowUser } = require("../controllers/userController");

const router = express.Router();

router.put("/update", authenticateToken,updateUser);
router.get("/getUser/:username", authenticateToken,getUserByUsername);

router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

router.put('/follow/:id', authenticateToken, followUnfollowUser);


module.exports = router;
