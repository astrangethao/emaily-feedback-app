const passport = require('passport');

module.exports = (app) => {
  //route handler for login with google
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  //route handler to resend code to google oauth
  app.get('/auth/google/callback', passport.authenticate('google'));

  //handler for logging out
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
