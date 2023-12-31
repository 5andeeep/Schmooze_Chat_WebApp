const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// controller for accessing the EXISTING chat or CREATING new chat API(one-on-one chat API)
const accessChat = asyncHandler(async (req, res) => {
    // check if login user has any chat then access it if not then create one
    const { userId } = req.body

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    // if chat exists of the user
    // fetching data from mongodb one-on-one chat of current user and the user that we are searching for...
    var isChat = await Chat.find({
        isGroupChat: false, // it should not be group chat
        // mongodb "and" condition to fetch chat of both users if available in db
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } }, // current user
            { users: { $elemMatch: { $eq: userId } } }, // searching user
        ],
    }).populate("users", "-password").populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    // .populate() function is used to get other collection data just like we have 
    // joins in SQL, so here mongoose we have populate function

    // checking if chat exists...
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } // if not then create exixts...
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        // send data..
        try {
            const createChat = await Chat.create(chatData);

            // again send this create chat to user back even if it is newly created
            const FullChat = await Chat.findOne({ _id: createChat._id }).populate("users", "-password");
            res.status(200).send(FullChat);
        }
        catch (err) {
            res.status(400).send({
                status: 400,
                message: err.message
            })
        }
    }
});


// controller for fetching one-on-one chat data..
// what we need to do here is that we have to check who is logged in and...
// query all the chats which are related to the current user
const fetchChats = asyncHandler(async (req, res) => {
    try {
        const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ udpatedAt: -1 });

        const newResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        res.status(200).send(newResults);
    } catch (error) {
        res.send(error.message);
    }
});


// creating groupchat controller for api
const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({
            status: 400,
            message: "Please fill all the details!"
        });
    }

    // from client side we will get users Array which we have to stringify to send backend. And here we have to parse the data...
    var users = JSON.parse(req.body.users);

    // in case someone try to form a group with single user...
    if (users.length < 2) {
        return res.status(400).send({
            status: 400,
            message: "We need at least 2 users to form a group chat."
        });
    }

    // adding all users plus currently logged in user in the group chat creation
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user

        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(201).json(fullGroupChat);

    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        });
    }
});

// controller to change the name of the group..
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    // updatedChat did not found
    if (!updatedChat) {
        res.status(404).send({
            status: 404,
            message: "Chat Not Found"
        });
    }
    else {
        res.json(updatedChat);
    }
});


// controller to Add user in a group API..
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body; // from client side..

    const userAdded = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        {
            new: true
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    // checking we are getting updated users array or not. If not give an error, else show the users..
    if (!userAdded) {
        res.status(400).send({
            status: 400,
            message: "Error: Failed to add user in the group!"
        });
    }
    else {
        res.json(userAdded);
    }
});


// controller to Remove user in a group API..
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body; // from client side..

    const userRemoved = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        },
        {
            new: true
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    // checking whether we are getting updated users array after removing from the group, if not give error, else show users..
    if (!userRemoved) {
        res.status(400).send({
            status: 400,
            message: "Error: Failed to remove user from the group!"
        });
    }
    else {
        res.json(userRemoved);
    }
});




module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };