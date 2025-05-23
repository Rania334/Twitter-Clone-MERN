const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: String,
        img: { type: String },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    },
    { timestamps: true }
);

module.exports = mongoose.model("Tweet", TweetSchema);
