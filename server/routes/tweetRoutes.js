const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { createTweet, getTweets, deleteTweet,likeTweet,retweetTweet ,getTweetById,getUserTimelineTweets} = require("../controllers/tweetController");
const router = express.Router();

const upload = require("../middleware/upload"); // new line

router.post("/", authenticateToken, upload.single("image"), createTweet);
router.get("/", getTweets);
router.delete("/:id", authenticateToken, deleteTweet);
router.put("/:id/like", authenticateToken, likeTweet);
router.put("/:id/retweet", authenticateToken, retweetTweet);
router.get("/:id", authenticateToken, getTweetById);
router.get("/:username/timeline", authenticateToken, getUserTimelineTweets);



module.exports = router;
