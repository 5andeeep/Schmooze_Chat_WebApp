const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");


// what we require to send a message..
// 1. chatId - which chat we need to send the messages
// 2. message - what message need to be sent..
// 3. sender - sender of the message

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    // if any of them does not there we will show an error..
    if (!content || !chatId) {
        console.log("Invalid data passed into request!");
        return res.sendStatus(400);
    };
    // since we require these three things in the message modal as well..
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };
    try {
        var message = await Message.create(newMessage)

        // we are going to populate the message between users (populate == share)
        // populate means that we are going to show details to both users...
        // exacPopulate does not work now...
        message = await message.populate("sender", "name pic"); // here we are sharing sender name and pic to receiver
        message = await message.populate("chat") // here we are sharing whole chat content to receiver...  

        // here we are going to share users details who so ever is involve in this chat/message...
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });
        // finding chat and updating it with latest messages..
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessages = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    try {
        const messages = await Message.find({ chat: chatId }).populate("sender", "name pic emai").populate("chat");
        // response...
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


module.exports = { sendMessage, allMessages };