const express = require("express");
const router = express.Router();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { verifyInputUserLogin } = require("../middleware/verifyInput");

const authController = require("../controller/authController");
// const Credential = require("../model/Credential");
// const User = require("../model/User");

require("dotenv").config({ path: "google.env" });

const ID = process.env.GOOGLE_CLIENT_ID;
const SECRET = process.env.GOOGLE_CLIENT_SECRET;

// console.log(`ID: `, ID);
// console.log(`SECRET: `, SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: ID,
      clientSecret: SECRET,
      // NOTE: change in production
      callbackURL: "http://localhost:3000/api/auth/login/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  process.nextTick(function () {
    return done(null, {
      user,
    });
  });
});

passport.deserializeUser((obj, done) => {
  process.nextTick(function () {
    return done(null, obj);
  });
});

// handle callback login with google fail from callback below
router.get("/login/google/failure", authController.googleFailure);

// handle callback login with google success from callback below
router.get("/login/google/success", authController.googleSuccess);

// handle callbackURL from passport setup above
router.get(
  "/login/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login/google/failure",
    successRedirect: "/api/auth/login/google/success",
  }),
);

// handle login with google from front client
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// @desc login for a user
// @required fields user{email, password}
router.post("/login", verifyInputUserLogin, authController.userLogin);

module.exports = router;
