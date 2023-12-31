const jwt = require("jsonwebtoken");

// adding jwt token with user details for valid authorized user
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = generateToken;