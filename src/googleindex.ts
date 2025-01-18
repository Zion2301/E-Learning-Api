import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.json({
      message: 'Google login successful!',
      user: req.user,
    });
  }
);

// GitHub OAuth Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    res.json({
      message: 'GitHub login successful!',
      user: req.user,
    });
  }
);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
