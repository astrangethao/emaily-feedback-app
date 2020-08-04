const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

//the user argument is from the User.findOne call back function which retrieved the user from the database
passport.serializeUser((user, done) => {
  done(null, user.id); //the user.id is the id that mongo has assigned to the record
});

//turns the cookie back into a model instance/record
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

//instantiates new google strategy for google oauth
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      //check for already existing users
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        //tells passport that oauth is done
        return done(null, existingUser);
      }

      //create a new user record
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
