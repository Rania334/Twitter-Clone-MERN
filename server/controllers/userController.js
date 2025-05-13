const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
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
    const user = await User.findOne({ username: req.params.username })
      .populate("followers", "username name profilePic")
      .populate("following", "username name profilePic")
      .select("-password");

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

    const { name, username, email, password, bio } = req.body;
    let updatedData = {};

    if (name) updatedData.name = name;
    if (bio) updatedData.bio = bio;

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

    if (req.files?.profilePic) {
      const profilePicResult = await uploadToCloudinary(req.files.profilePic[0].buffer);
      updatedData.profilePic = profilePicResult.secure_url;
    }

    if (req.files?.wallpaper) {
      const wallpaperResult = await uploadToCloudinary(req.files.wallpaper[0].buffer);
      updatedData.wallpaper = wallpaperResult.secure_url;
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
    let profilePicUrl = "", wallpaperUrl = "";

    if (req.files?.profilePic) profilePicUrl = (await uploadToCloudinary(req.files.profilePic[0].buffer)).secure_url;
    if (req.files?.wallpaper) wallpaperUrl = (await uploadToCloudinary(req.files.wallpaper[0].buffer)).secure_url;

    // Check existing user
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random 5-character verification key (e.g., "5HN85")
    const verificationKey = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a 6-character string
    const verificationKeyExpiry = Date.now() + 2 * 60 * 60 * 1000; // Expiration time in 2 hours

    // Create user with key and expiration
    const user = new User({
      name, username, email,
      password: hashedPassword,
      profilePic: profilePicUrl,
      wallpaper: wallpaperUrl,
      verificationKey,
      verificationKeyExpiry,
    });

    await user.save();

    // Send verification email with the key
    const emailHtml = `
      <h2>Verify your account</h2>
      <p>Use the following verification key to verify your email:</p>
      <p><strong>${verificationKey}</strong></p>
    `;
    await sendEmail(email, "Verify your Email", emailHtml);

    res.status(201).json({ message: "User registered! Please verify your email." });
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

const verifyEmail = async (req, res) => {
  try {
    const { verificationKey, email } = req.body; // User sends the key and email to verify

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the verification key matches and if it hasn't expired
    if (user.verificationKey !== verificationKey) {
      return res.status(400).json({ message: "Invalid verification key" });
    }

    if (Date.now() > user.verificationKeyExpiry) {
      return res.status(400).json({ message: "Verification key expired. Please request a new one." });
    }

    // If the user is already verified, notify the user
    if (user.isVerified) {
      return res.status(400).json({ message: "Your email is already verified." });
    }

    // Mark the user as verified and clear the verification key
    user.isVerified = true;
    user.verificationKey = undefined;  // Clear the verification key
    user.verificationKeyExpiry = undefined;  // Clear the expiration time
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { registerUser, loginUser, updateUser, getUserByUsername, logoutUser, refreshToken, followUnfollowUser, verifyEmail };
