var firebase = require('./firebase');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

exports.localStrategy = new LocalStrategy(function(username, password, callback) {
  firebase.getPassword(username, function(err, user) {
    if (user) {
      bcrypt.compare(password, user.pwHash, function(err, authenticated) {
        if (authenticated) {
          callback(null, user);
        } else {
          callback(null, false);
        }
      });
    } else {
      callback(null, false);
    }
  });
});

exports.createUser = function(username, password) {
  firebase.createUser(username, bcrypt.hashSync(password, 10));
}

exports.findUser = firebase.findUser;
