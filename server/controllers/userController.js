const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/auth");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");



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
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};


const followUnfollowUser = async (req, res) => {
  const userId = req.user.id;
  const targetId = req.params.id;

  if (userId === targetId)
    return res.status(400).json({ message: "Can't follow yourself" });

  try {
    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!user || !target)
      return res.status(404).json({ message: "User not found" });

    const isFollowing = target.followers.includes(userId);

    if (isFollowing) {
      target.followers.pull(userId);
      user.following.pull(targetId);
    } else {
      target.followers.push(userId);
      user.following.push(targetId);
    }

    await target.save();
    await user.save();

    res.status(200).json({
      followers: target.followers,
      following: user.following
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updateUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, username, email, password } = req.body;
    let updatedData = {};

    if (name) updatedData.name = name;
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      updatedData.username = username;
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Email is already taken" });
      }
      updatedData.email = email;
    }

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    let profilePicUrl = "";
    let wallpaperUrl = "";
    console.log("Incoming request body:", req.body);
    console.log("Incoming files:", req.files);

    if (req.files?.profilePic) {
      profilePicUrl = (await uploadToCloudinary(req.files.profilePic[0].buffer)).secure_url;
    }

    if (req.files?.wallpaper) {
      const wallpaperUploadResult = await uploadToCloudinary(req.files.wallpaper[0].buffer);
      wallpaperUrl = wallpaperUploadResult.secure_url;
      console.log("Wallpaper uploaded to:", wallpaperUrl);
    }



    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      profilePic: profilePicUrl,
      wallpaper: wallpaperUrl,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Send both the access token and user data (including userId)
    res.json({ accessToken, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
  res.json({ message: "Logged out successfully" });
};
const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    try {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const accessToken = generateAccessToken(user); // Reuse your util function
      res.json({ accessToken });
    } catch (err) {
      res.status(500).json({ message: "Failed to refresh token" });
    }
  });
};


module.exports = { registerUser, loginUser, updateUser, getUserByUsername, logoutUser, refreshToken,followUnfollowUser };
