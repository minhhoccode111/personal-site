require("dotenv").config();

const RateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const mongoose = require("mongoose");
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");

const corsOptions = require("../config/corsOptions");
const connectDB = require("../config/dbConnect");

const app = express();

const PORT = process.env.PORT || 3000;

connectDB(); // connect to database

const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 60 }); // max res/min
app.use(limiter); // rate limite
app.use(helmet()); // security HTTP header
app.use(compression()); // compress responses performant
app.use(express.json()); // middleware to parse json
app.use(cookieParser()); // middleware to parse cookie
app.use(cors(corsOptions)); // set cors withj options
app.disable("x-powered-by"); // reduce fingerprinting
// app.use(express.urlencoded({ extended: false }));

// static route
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("../routes/root"));

// user routes - for testing
app.use("/test", require("../routes/testRoutes"));

// user routes - for /api/users and /api/user
app.use("/api", require("../routes/userRoutes"));

// user routes - for profiles
app.use("/api/profiles", require("../routes/profileRoutes"));

// article routes
app.use("/api/articles", require("../routes/articleRoutes"));

// tag routes
app.use("/api/tags", require("../routes/tagRoutes"));

// comment routes
app.use("/api/articles", require("../routes/commentRoutes"));

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on port: `, PORT);
  });
});

mongoose.connection.on("error", (err) => console.error(`db error: `, err));

module.exports = app;
