var firebase = require('./firebase');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

exports.localStrategy = new LocalStrategy(function(username, password, callback) {
  firebase.getUser(username, function(err, user) {
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

exports.createUser = function(username, password, passwordconfirm, callback) {
  if (password === passwordconfirm) {
    firebase.getUser(username, function(err, user) {
      if (user) {
        callback('Username already exists');
      } else {
        firebase.createUser(username, bcrypt.hashSync(password, 10));
        callback(false);
      }
    });
  } else {
    callback('Passwords don\'t match');
  }
}

exports.findUser = firebase.findUser;
