const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { verifyInputUserLogin } = require("../middleware/verifyInput");

const authController = require("../controller/authController");
const Credential = require("../model/Credential");
const User = require("../model/User");

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
      // this must match with the Google Credential Consent or mismatch error will be thrown
      // the route handler is below
      callbackURL: "/api/auth/login/google/callback",
    },

    async function verify(accessToken, refreshToken, profile, done) {
      // profile fields belike:  {
      //   provider: 'google',
      //   _json: {
      //     sub: '114192593333485248876',
      //     name: 'Dân Dân',
      //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocLYhb6TSQnhrCe7egFS5fZMeRkWUIwJ7wM8cWWZzHbcVGfj_A=s96-c',
      //     email: 'danghoangminh011@gmail.com',
      //   }
      // }

      try {
        // get a credential with that profile
        const credential = await Credential.findOne({
          provider: profile.provider,
          profileid: profile._json?.sub,
        });
        // if user haven't logged in before
        if (!credential) {
          // their auto-generate password will be their google profile'id
          // TODO: send this back to their gmail with forgot password feature
          const newUserPassword = await bcrypt.hash(profile._json?.sub, SALT);
          const session = await mongoose.startSession();
          session.startTransaction();
          // TODO: work on this, move outside of try catch block

          // create a user using that profile info, with 3 required fields
          const newUser = new User({
            username: profile._json?.name,
            email: profile._json?.email,
            password: newUserPassword,
            image: profile._json?.picture,
          });

          // TODO: make this acid transaction, both must success or fail all if one fail
          // in case username or email conflict
          const [_, __] = await Promise.all([
            newUser.save({ session }),
            // create a credential associate with that user and save
            new Credential({
              userid: newUser._id,
              provider: profile.provider,
              profileid: profile._json?.sub, // this also their password...safe?
            }).save({ session }),
          ]);

          await session.commitTransaction();

          console.log(`transaction commited succesfully`);

          // mark them success login
          return;
        }
        // if user logged in before then find the user associate with the profile credential
        // if profile credential exist but somehow can't find the user associate it
        // then mark them failure login
        // else mark them success login
        done(null, profile);
      } catch (err) {
        // catch every error and pass to next
        console.log(`error occurs during google auth process: `, err);
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
    failureRedirect: false, // assign value will redirect the client
  }),
  // handle both success and failure in this middleware
  // if success: req.user truthy if failure: !req.user falsy
  authController.googleCallback,
);

// handle login with google from front client
router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.post("/login", verifyInputUserLogin, authController.userLogin);

module.exports = router;
