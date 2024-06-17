const express = require("express");
const router = express.Router();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");

const User = require("./../model/User");
const Credential = require("./../model/Credential");

const googleController = require("../controller/googleController");

require("dotenv").config({ path: "google.env" }); // Load google.env file

console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      // config google strategy
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/oauth2/redirect/google", // NOTE: change in production
      scope: ["profile", "email"],
    },
    // verify callback, should be synchronous
    async function verify(issuer, profile, cb) {
      console.log(`issuer belike: `, issuer);
      console.log(`profile belike: `, profile);
      // check for profile.id existence in Credential table

      try {
        const credential = await Credential.findOne({
          provider: issuer,
          subject: profile.id,
        }).exec();

        if (!credential) {
          // the account at google has not logged in to this app before, create a
          // new user record and associate it with the google account
          const user = new User({
            username: profile.displayName,
          });
        }
      } catch (err) {
        // catch everything and pass to cb
        cb(err);
      }

      // if don't have then creat a new user and insert into both User and Credential
      // if there is a user's credential with the profile.id then select that credential to use the userid field to actually find the user
      // then pass with cb to finish
    },
  ),
);

// full route "/api/users/login/federated/google",
router.get(
  "/users/login/federated/google",
  passport.authenticate("google"),
  // googleController.
);

// full route "/api/oauth2/redirect/google",
router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
);

module.exports = router;
