const mongoose = require("mongoose");
const colors = require("colors");

// connecting mongoDB(dababase) with app
mongoose
    .connect(process.env.MONGODB_URI)
    .then((conn) => console.log(`MongoDB is connected: ${conn.connection.host}`.cyan.underline))
    .catch((err) => console.log(`Error: ${err.message}`.red.bold));