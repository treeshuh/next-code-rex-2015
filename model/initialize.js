var LocalStrategy = require('passport-local').Strategy;
var user = require('./user');

// Do things that are common to every HTTP request
// e.g. log the request, store the permissions
module.exports.router = function(req, res, next) {
  if (req.user) {
    logger.info(req.user.name + " " + req.url);
  } else {
    logger.info("[Unknown user] " + req.url);
  }
  next();  // call app.router
};


// Functions used by passport.
module.exports.strategy = new LocalStrategy(user.login);

module.exports.serializeUser = function(user, done) {
  done(null, user.id);
};

module.exports.deserializeUser = function(id, done) {
  user.findUser(id, function(error, user) {
    return done(null, user);
  });
};
