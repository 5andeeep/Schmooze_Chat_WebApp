const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            next();
        }
        catch (err) {
            res.status(400).send({
                status: 400,
                message: "Some error while checking authorization!"
            })
        }
    }
    if (!token) {
        res.status(401).send({
            status: 401,
            message: "Not authorized, token failed!"
        })
    }
});

module.exports = { protect };