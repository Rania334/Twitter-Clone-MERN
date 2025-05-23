const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username }, 
        process.env.ACCESS_SECRET, 
        { expiresIn: "5m" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id }, 
        process.env.REFRESH_SECRET, 
        { expiresIn: "7d" }
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
