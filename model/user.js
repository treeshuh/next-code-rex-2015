/* User functions */

var bcrypt = require('bcrypt');
var Firebase = require('firebase');
var root = new Firebase('https://nextchallenge.firebaseIO.com');

var userID = -1;

exports.login = function(username, password, callback) {
  root.child('users').on('value', function(data) {
    console.log(data.val());
  });
};

exports.finduser = function(id, callback) {
  root.child('users').child(id).on('value', function(data) {
    return data;
  });
};
