const RateLimit = require("express-rate-limit");
const createError = require("http-errors");
const compression = require("compression");
const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const debug = require("debug")(
  "xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx",
);

// connect database
const mongoose = require("mongoose");
// not throw an error when we try to query the property that not explicitly defined on Schema
mongoose.set("strictQuery", false);
// development database string
const dev_db_url =
  "mongodb+srv://minhhoccode111:xImH0F6m9Rg4EIQX@cluster0.qqat537.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// if production db is not defined then use the development
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main()
  .then(() => debug("connected to database"))
  .catch((err) => debug("an error occur: ", err));

async function main() {
  await mongoose.connect(mongoDB);
}

// db models, for authentication
const User = require("./src/models/user");

const app = express();

// reduce fingerprinting
app.disable("x-powered-by");

// rate limit // TODO change to 20 in production
const limiter = RateLimit({ windowMs: 1 * 60 * 1000, max: 60 }); // max 20/min
app.use(limiter);

// compress responses for performance
app.use(compression());

// security HTTP header
app.use(helmet());

// setup CORS (Cross-origin Resources Sharing) to allow request from any origin
const cors = require("cors");
// app.use(cors()); // TODO is used for development
app.use(
  cors({
    origin: [
      "http://localhost:5173", // development frontend
      "http://localhost:3000", // development postman
      "https://minhhoccode.vercel.app", // production
    ],
    methods: "GET,POST,PUT,DELETE", // simple CRUD actions
  }),
);

// basic setup
app.use(logger("dev")); // logger
app.use(express.json()); // parse json to js object
app.use(express.urlencoded({ extended: false })); //  parse form data
app.use(express.static(path.join(__dirname, "public"))); // server things in public

// passport to authenticate a jwt
const passport = require("passport");
// a passport strategy to authentication by passport.use(new JwtStrategy(options, verify))
const JwtStrategy = require("passport-jwt").Strategy;
// to choose ways to extract json web token from request
const ExtractJwt = require("passport-jwt").ExtractJwt;
// option jwt
const options = {
  // extract json web token using Bearer in header
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // secret
  secretOrKey: process.env.SECRET,
};

// init passport within express application
app.use(passport.initialize());

// This is called when passport.authenticate() middleware is called
passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      debug(`the payload object in passport.use: `, payload);
      const user = await User.findOne(
        { username: payload.username },
        "-password -username -__v",
      ).exec();

      debug(`the user object in passport.use: `, user);
      if (!user) return done(null, false);

      // success and make req.user available after passport.authenticate() middlewares chain
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);

// only mark req.user, don't throw a 401 response immediately
const passportWrapper = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) return next(err);
    req.user = user;
    debug(`the info object in wrapper: `, info);
    debug(`the user object in wrapper: `, user);

    next();
  })(req, res, next);
};

// handle api request
const routes = require("./src/routes"); // modular
// these routes only need to know the authorization
// login and signup may not need to know authorization but why not
app.use("/api/v1/", passportWrapper, routes.unauthenticated);

// these routes need a 401 response immediately
app.use(
  "/api/v1/",
  passport.authenticate("jwt", { session: false }),
  routes.authenticated,
);

// if no route handle the request mean it a 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // we can only access the err object in res.locals.error if development, else it's an empty object
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // log the error
  debug(`the error object: `, err);

  // send the error json to client
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
