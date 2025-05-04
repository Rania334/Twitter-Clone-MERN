const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader); // 👈 Add this

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) {
            console.log("JWT Verification Error:", err.message); // 👈 Add this
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    });
};


module.exports = authenticateToken;
