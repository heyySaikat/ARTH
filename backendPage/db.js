const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const Auth0Strategy = require("passport-auth0");

const app = express();

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/auth0-mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema with additional fields
const userSchema = new mongoose.Schema({
  auth0Id: String, // Store Auth0 User ID
  name: String, // Store user's full name
  email: String, // Store email address
  emailVerified: Boolean, // Store email verified status
  profilePicture: String, // Store user's profile picture URL
  createdAt: {
    // Track when the user is created
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Auth0 Strategy Configuration
passport.use(
  new Auth0Strategy(
    {
      domain: "sagniksarkar.jp.auth0.com", // Replace with your Auth0 domain
      clientID: "2i7pKcFsjbzzjPHYiE1IVmDYtLK90byz", // Replace with your Auth0 Client ID
      clientSecret:
        "0ZZQtWkCXIDMKdCv4xI0D9qw57Mn-0m1R3m1t_VD3VokrB9_VX_y36wMkVAMyfr7", // Replace with your Auth0 Client Secret
      callbackURL: "http://localhost:3000/callback", // Replace with your Auth0 callback URL
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
      try {
        // Use async/await to find the user in MongoDB
        const user = await User.findOne({ auth0Id: profile.id });

        if (!user) {
          // Create a new user if not found
          const newUser = new User({
            auth0Id: profile.id,
            name: profile.displayName, // Store the name from profile
            email: profile.emails[0].value, // Store the email from profile
            emailVerified: profile.emails[0].verified, // Store email verification status
            profilePicture: profile.picture, // Store the profile picture URL
          });

          await newUser.save(); // Save the new user asynchronously
          return done(null, newUser); // Pass the newly created user to the next function
        } else {
          // If user exists, return the existing user
          return done(null, user);
        }
      } catch (err) {
        return done(err); // Catch any errors and pass them to the next handler
      }
    }
  )
);

// Serialize and deserialize user for session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Express session and Passport initialization
app.use(
  session({
    secret: "your-session-secret", // Replace with your session secret
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Route to start the Auth0 login process
app.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid profile email", // Request these user details from Auth0
  })
);

// Auth0 callback route
app.get(
  "/callback",
  passport.authenticate("auth0", {
    failureRedirect: "/login", // If login fails, redirect to the login page
  }),
  (req, res) => {
    res.redirect("/profile"); // Redirect to profile after successful login
  }
);

// Protected route for logged-in user
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login"); // If user is not authenticated, redirect to login
  }

  // Send user data as a response (JSON format)
  res.json({
    name: req.user.name,
    email: req.user.email,
    profilePicture: req.user.profilePicture,
    emailVerified: req.user.emailVerified,
  });
});

// Route to log out the user and redirect to the homepage
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error during logout");
    res.redirect("/"); // Redirect to homepage after logout
  });
});

// Start the server
app.listen(3000, () => {
  console.log("App is running on http://localhost:3000");
});

// Route to log out the user and redirect to Auth0 logout endpoint
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error during logout");

    // Redirect to Auth0 logout endpoint to clear the Auth0 session
    const logoutUrl = `https://sagniksarkar.jp.auth0.com/logout?client_id=2i7pKcFsjbzzjPHYiE1IVmDYtLK90byz&returnTo=http://localhost:3000/`;

    // Redirect to the Auth0 logout page
    res.redirect(logoutUrl);
  });
});
