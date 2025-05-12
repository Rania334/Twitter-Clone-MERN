const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationKey: { type: String },  // Store the verification key
  verificationKeyExpiry: { type: Number },  // Store the expiration time as a timestamp
  profilePic: { type: String, default: "" }, // Profile image
  wallpaper: { type: String, default: "" },  // Background image
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
