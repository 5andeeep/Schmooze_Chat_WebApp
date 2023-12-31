const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// constroller for user registration...
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    // if any field is empty, we will get this condition
    if (!name || !email || !password) {
        res.status(400).send({
            status: 400,
            message: "Please fill all the details!"
        })
    }

    // check if user already exists....
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).send({
            status: 400,
            message: "User already exists!"
        })
    }

    // if not exists, Create new user instead
    // and we will send json response with user data..
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });
    // sending user data...
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400).send({
            status: 400,
            message: "Failed to create user!"
        })
    }
});


// controller for user login..
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // if user exsits
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(400).send({
            status: 400,
            message: "Invalid Email or Password!"
        })
    }
});

// api for all users...
// /api/user?search=sandeep
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        // mongodb "or" condition to find user by email or by user name..
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});


module.exports = { registerUser, loginUser, allUsers }

