const colors = require("colors");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// files-imports
// const { chats } = require("../backend/data/data");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("../backend/middleware/errorMiddleware");
// const connectDB = require("../backend/config/db");
const path = require("path");


// constants
const app = express();
dotenv.config();
// connectDB();
// middleware
app.use(express.json()); // to accept json data

// app.get("/", (req, res) => {
//     res.send("Server is running at 5000 Successfully");
// });

app.use("/api/user", userRoutes); // api for user related..
app.use("/api/chat", chatRoutes); // api for chat related..
app.use("/api/message", messageRoutes); // api for message related..

// -------------------------- deployment -------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    // statblishing the path to current working directory to build directory
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
    // // api to get connent of html frontend folder
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    });
}
else {
    app.get("/", (req, res) => {
        res.send("Server is Running...");
    });
}

// -------------------------- deployment -------------------------


// middleware for error handling..
app.use(notFound);
app.use(errorHandler);


// connecting mongoDB(dababase) with app
mongoose
    .connect(process.env.MONGODB_URI)
    .then((conn) => console.log(`MongoDB is connected: ${conn.connection.host}`.cyan.underline))
    .catch((err) => console.log(`Error: ${err.message}`.red.bold));



// server connection..   
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`.yellow.bold));


// NOTE:- we install two different socket.io one is for backend and other is for client(frontend)
// backend = npm i socket.io
// frontend = npm i socket.io-client

// socket.io..
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000", // this is frontend ENDPOINT
        methods: ["GET", "POST"] // recently added code..

    }
});
// pingTimeout is used for saving bandwidth. Suppose if someone is not using/chatting for some time in our example 60000=60second, it will switch off the connection to save bandwidth.

// to create connection we use .on() function of socket.io and it takes two thing as a parameter 1. connection name (anything), 2. callback function
// we created different sockets for different purpose inside this..
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    // 1. creating socket for users
    socket.on("setup", (userData) => {
        socket.join(userData._id); // creating room for perticular user...
        socket.emit("connected");
        // console.log(userData._id);
    });
    // 2. creating socket for chats..
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    });
    // 3. creating socket to send new message to their related chat room..
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        // chat doesn't have any user then return..
        if (!chat.users) {
            console.log("Chat.users is not defined");
            return;
        }
        // here comes the interesting part of socket..
        // this is logic to send message to opposite users except the user who is sending the message
        chat.users.forEach(user => {
            // if user and sender is same then just return dont send msg..
            if (user.id === newMessageReceived.sender._id) return;
            // if not..
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });
    // 4. creating socket for showing if other user typing..
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    // 5. creating socket for stop showing typing indicator if user is not typing
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // 6. if user is not on chat socket switch-off the "setup" socket..
    // clean up socket
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

