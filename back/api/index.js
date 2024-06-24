require("dotenv").config();

const RateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

const debug = require("../constants/debug");

const app = express();

const corsOptions = require("../config/corsOptions");
const connectDB = require("../config/dbConnect");

// debug(`corsOptions belike: `, corsOptions);

const PORT = Number(process.env.PORT) || 3000;
const SECRET = process.env.JWT_SECRET || "SomeSuperSecretSecrets";

// for google authentication session
app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

connectDB(); // connect to database

const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 60 }); // max res/min
app.use(limiter); // rate limit
app.use(helmet()); // security HTTP header
app.use(logger("dev")); // better log
app.use(compression()); // compress responses performant
app.use(express.json()); // middleware to parse json
app.use(cookieParser()); // middleware to parse cookie
app.use(cors(corsOptions)); // set cors with options
app.disable("x-powered-by"); // reduce fingerprinting
app.use(express.urlencoded({ extended: false }));

// serve /public dir
app.use("/", express.static(path.join(__dirname, "/public")));
// for / and /index and /index.html
app.use("/", require("../route/root"));

// for /test and /api/test
app.use("/test", require("../route/testRoutes"));
app.use("/api/test", require("../route/testRoutes"));

// for /users and /user(current user)
app.use("/api", require("../route/userRoutes"));

// for /auth
app.use("/api/auth", require("../route/authRoutes"));

// for /tags
app.use("/api/tags", require("../route/tagRoutes"));

// for /profiles
app.use("/api/profiles", require("../route/profileRoutes"));

// for /contacts
app.use("/api/contacts", require("../route/contactRoutes"));

// for /skills
app.use("/api/skills", require("../route/skillRoutes"));

// for /works
app.use("/api/works", require("../route/workRoutes"));

// for /articles
app.use("/api/articles", require("../route/articleRoutes"));

// for articles/:articleid/comments
app.use("/api/articles", require("../route/commentRoutes"));

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    debug(`Server running on port: `, PORT);
  });
});

mongoose.connection.on("error", (err) => debug(`db error: `, err));

module.exports = app;
