const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { registerUser, loginUser, allUsers } = require("../controllers/userControllers");

const router = express.Router();

// router.route("/").get(allUsers)  // or we make a chain of same url("/") routes
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", loginUser);

module.exports = router;