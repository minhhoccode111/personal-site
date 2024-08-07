const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { verifyInputUserLogin } = require("../middleware/verifyInput");

const authsController = require("../controller/authsController");
const Credential = require("../model/Credential");
const User = require("../model/User");

const debug = require("../constants/debug");

require("dotenv").config({ path: "google.env" });

const ID = process.env.GOOGLE_CLIENT_ID;
const SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_REDIRECT_URL =
  process.env.CLIENT_REDIRECT_URL || "http://localhost:5173/user/login";

// debug(`ID: `, ID);
// debug(`SECRET: `, SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: ID,
      clientSecret: SECRET,
      // this must match with the Google Credential Consent
      // or mismatch error will be thrown the route handler is below
      callbackURL: "/api/auth/login/google/callback",
    },

    async function verify(accessToken, refreshToken, profile, done) {
      // profile fields belike:  {
      //   provider: 'google',
      //   _json: {
      //     sub: '918739817929182739182',
      //     name: 'Example name',
      //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocLYhb6TSQnhrCe7egFS5fZMeRkWUIwJ7wM8cWWZzHbcVGfj_A=s96-c',
      //     email: 'example@gmail.com',
      //   }
      // }

      const profileIdString = String(profile._json.sub);
      const username = profile._json?.name;
      const email = profile._json?.email;
      const image = profile._json?.image;

      try {
        // find credential match that Google profile and user with that email
        const [credential, user] = await Promise.all([
          Credential.findOne({
            provider: profile.provider,
            profileid: profileIdString,
          }).exec(),

          User.findOne({ email }).exec(),
        ]);

        // if used Google auth before
        if (credential && user) {
          // else mark them success login
          return done(null, user.toUserResponse());
        }

        // if email logged in before but first use Google Auth
        // NOTE: Google Auth should have higher prioritize than email + password
        // and the Google Auth will by-pass password of existed password
        if (!credential && user) {
          // make Google auth connect with that user
          user.isGoogleAuth = true;

          const newCredential = new Credential({
            userid: user._id, // old user
            provider: profile.provider,
            profileid: profileIdString,
          });

          await Promise.all([user.save(), newCredential.save()]);
          return done(null, user.toUserResponse());
        }

        // if email not logged in before and first use Google auth
        if (!credential && !user) {
          // create both Google auth and user
          const SALT = Number(process.env.SALT) || 13;

          // auto-generate a password
          const newUserPassword = await bcrypt.hash(
            profileIdString + Math.random(), // no need to keep track of this
            SALT,
          );

          // create new user with that Google profile
          const newUser = new User({
            email,
            image,
            username,
            isGoogleAuth: true,
            password: newUserPassword,
          });

          // create new credential with that new user with that Google profile
          const newCredential = new Credential({
            userid: newUser._id,
            provider: profile.provider,
            profileid: profileIdString,
          });

          await Promise.all([newUser.save(), newCredential.save()]);

          // mark them success login
          return done(null, newUser.toUserResponse());
        }

        // else
        return done(null, false);
      } catch (err) {
        debug(`Error during Google Auth`, err);

        return done(err);
      }
    },
  ),
);

// determine which data from the user should be store in the session
passport.serializeUser((user, done) => {
  // the process.nextTick is used to defer the execution of the callback to the next event loop cycle
  // which can help prevent potential issues with asynchronous operations
  process.nextTick(function () {
    return done(null, {
      user,
    });
  });
});

// deserialize the user data from the session and turn it back into a user object
passport.deserializeUser((obj, done) => {
  process.nextTick(function () {
    return done(null, obj);
  });
});

// handle callbackURL from passport setup above
router.get(
  "/login/google/callback",
  passport.authenticate("google", {
    failureRedirect: CLIENT_REDIRECT_URL + "/failure",
  }),
  // handle both success and failure in this middleware
  // if success: req.user truthy if failure: !req.user falsy
  authsController.googleCallback,
);

// handle login with google from front client
router.get(
  "/login/google",
  passport.authenticate("google", {
    // extract these two info from the profile
    scope: ["profile", "email"],
  }),
);

// normal login needs to be validated input fields
router.post("/login", verifyInputUserLogin, authsController.userLogin);

module.exports = router;
