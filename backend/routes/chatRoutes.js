const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");


// route for accessing or creating one-on-one chat..
router.route("/").post(protect, accessChat); // 1. used in HeaderSideDrawer.js
// route to get all the chat from the database for that perticular user..
router.route("/").get(protect, fetchChats); // 2. used in MyChats.js
// route to create a group chat...
router.route("/group").post(protect, createGroupChat); // 3. used in GroupChatModal
// route to rename the group...
router.route("/renamegroup").put(protect, renameGroup); // 4. used in UpdatedGroupChatModal
// route to add the user in the group....
router.route("/addtogroup").put(protect, addToGroup); // 5. used in UpdatedGroupChatModal
// route to remove the user from group...
router.route("/removefromgroup").put(protect, removeFromGroup); // 6. used in UpdatedGroupChatModal

module.exports = router;