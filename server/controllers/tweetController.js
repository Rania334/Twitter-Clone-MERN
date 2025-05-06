const Tweet = require("../models/Tweet");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const User = require("../models/User");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: Cloudinary upload as Promise
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

const createTweet = async (req, res) => {
  try {
    const { content } = req.body;
    const tweet = new Tweet({
      user: req.user.id,
      content,
    });

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        tweet.img = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    await tweet.save();
    res.status(201).json(tweet);
  } catch (err) {
    console.error("Error creating tweet:", err);
    res.status(500).json({ error: err.message });
  }
};

const getTweets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name username profilePic")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name username" },
      });

    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    if (tweet.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await tweet.deleteOne();
    res.json({ message: "Tweet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    const userId = req.user.id;

    if (tweet.likes.includes(userId)) {
      tweet.likes = tweet.likes.filter((id) => id.toString() !== userId);
      await tweet.save();
      return res.json({ message: "Tweet unliked", tweet });
    }

    tweet.likes.push(userId);
    await tweet.save();
    res.json({ message: "Tweet liked", tweet });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const retweetTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    const userId = req.user.id;

    if (tweet.retweets.includes(userId)) {
      tweet.retweets = tweet.retweets.filter((id) => id.toString() !== userId);
      await tweet.save();
      return res.json({ message: "Retweet removed", tweet });
    }

    tweet.retweets.push(userId);
    await tweet.save();
    res.json({ message: "Tweet retweeted", tweet });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getTweetById = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
      .populate("user", "name username")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name username" },
      });

    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    res.status(200).json(tweet);
  } catch (error) {
    console.error("Error fetching tweet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getUserTimelineTweets = async (req, res) => {
  try {
    const username = req.params.username;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userId = user._id;

    const originalTweets = await Tweet.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name username profilePic");

    const retweetedTweets = await Tweet.find({ retweets: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name username profilePic");

    const taggedOriginals = originalTweets.map((tweet) => ({
      ...tweet.toObject(),
      isRetweet: false,
    }));

    const taggedRetweets = retweetedTweets.map((tweet) => ({
      ...tweet.toObject(),
      isRetweet: true,
    }));

    const allTweets = [...taggedOriginals, ...taggedRetweets];
    allTweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(allTweets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getLikedTweets = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tweets = await Tweet.find({ likes: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name username profilePic");

    res.status(200).json(tweets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTweet,
  getTweets,
  deleteTweet,
  likeTweet,
  retweetTweet,
  getTweetById,
  getUserTimelineTweets,
  getLikedTweets,
  upload, // Export this if you're using multer in your routes
};
