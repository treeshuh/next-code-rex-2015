/* Functions that interact with Firebase */

var Firebase = require('firebase');
var root = new Firebase('https://next-code-golf.firebaseIO.com');

/*
 * Schema
 *
 * next-code-golf
 *   users
 *     1 [user id]
 *       id: 1
 *       username: sample-user
 *       pwHash: cf7d51e028...
 *       problems
 *         problem1 [problem name]
 *           score: 57
 *         problem2
 *         problem3
 *         ...
 *     2
 *     3
 *     ...
 *   problems
 *     problem1 [problem name]
 *       name: sample-problem
 *     problem2
 *     problem3
 *     ...
 */

var userID = 0;  // ID of most recent user created
root.child('users').on('value', function(data) {
  userID = data.numChildren();
});

function createUser(username, pwHash) {
  userID++;
  root.child('users').child(userID).set({'id': userID, 'username': username, 'pwHash': pwHash});
};

function getPassword(username, callback) {
  root.child('users').on('value', function(data) {
    var users = data.val();
    for (var userKey in users) {
      user = users[userKey];
      if (user.username == username) {
        callback(false, user);
        return;
      }
    }
    callback(false, false);
  });
};

function findUser(id, callback) {
  root.child('users').child(id).on('value', function(data) {
    callback(false, data.val());
  });
}

function getSolvedProblems(user, callback) {
  root.child('users').child(user.id).child('problems').on('value', function(data) {
    callback(data.val());
  });
};

function getProblems(user, callback) {
  root.child('problems').on('value', function(data) {
    callback(false, data.val());
  });
};

function solveProblem(user, problem, score) {
  root.child('users').child(user.id).child('problems').child(problem.name).set({'score': score});
};

exports.createUser = createUser;
exports.getPassword = getPassword;
exports.findUser = findUser;
exports.getSolvedProblems = getSolvedProblems;
exports.getProblems = getProblems;
exports.solveProblem = solveProblem;

