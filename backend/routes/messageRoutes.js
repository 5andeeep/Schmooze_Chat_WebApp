const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allMessages } = require("../controllers/messageControllers");

const router = express.Router();

// this route is to send the messages
router.post("/", protect, sendMessage); // used in SingleChat.js file (sendMessage)

// this route is to get all the messages for logged in user...
router.get("/:chatId", protect, allMessages); // used in SingleChat.js file (fetch all messages of selected chat..)


// export our router...
module.exports = router;