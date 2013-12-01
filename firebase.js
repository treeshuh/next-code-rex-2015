/* Functions that interact with Firebase */

var Firebase = require('firebase');
var root = new Firebase('https://next-code-golf.firebaseIO.com');

/*
 * Schema
 *
 * next-code-golf
 *   counters
 *     userID: 15 [ID of most recent user created]
 *     submissionID: 29 [ID of most recent submission]
 *   users
 *     1 [user id]
 *       id: 1
 *       username: sample-user
 *       pwHash: cf7d51e028...
 *       problems
 *         problem1 [problem name]
 *           score: 57
 *           timestamp: 12304592813
 *           type: alg [or example]
 *           path: submissions/'best-submission'
 *         problem2
 *         problem3
 *         ...
 *     2
 *     3
 *     ...
 *   problems
 *     problem1 [problem name]
 *       judge
 *         1 [judge input id]
 *           input: 5
 *           expected: 5
 *         2
 *         3
 *         ...
 *       name: sample-problem
 *       statement: Print out the input.
 *       type: alg [or example]
 *     problem2
 *     problem3
 *     ...
 */

function createUser(username, pwHash, callback) {
  root.child('counters').child('userID').transaction(function(userID) {
    return userID + 1;
  }, function(err, committed, data) {
    if (err) {
      callback(err);
      return;
    }
    if (!committed) {
      callback('System error: create user');
      return;
    }
    var userID = data.val();
    root.child('users').child(userID).set({
      'id': userID,
      'username': username,
      'pwHash': pwHash
    });
    callback(false);
  });
};

function getUser(username, callback) {
  root.child('users').once('value', function(data) {
    var users = data.val();
    for (var userKey in users) {
      var user = users[userKey];
      if (user.username == username) {
        callback(false, user);
        return;
      }
    }
    callback(false, false);
  });
};

function findUser(id, callback) {
  root.child('users').child(id).once('value', function(data) {
    callback(false, data.val());
  });
}

function getSolvedProblems(user, callback) {
  root.child('users').child(user.id).child('problems').once('value', function(data) {
    callback(false, data.val());
  });
};

function listProblems(user, callback) {
  root.child('problems').once('value', function(data) {
    callback(false, data.val());
  });
};

function findProblem(problemName, callback) {
  root.child('problems').child(problemName).once('value', function(data) {
    callback(false, data.val());
  });
};

function submitProblem(callback) {
  root.child('counters').child('submissionID').transaction(function(submissionID) {
    return submissionID + 1;
  }, function(err, committed, data) {
    if (err) {
      callback(err);
    } else if (!committed) {
      callback('System error: submit problem');
    } else {
      callback(false, data.val());
    }
  });
};

function judgeSubmission(user, problem, tester, callback) {
  root.child('problems').child(problem.name).
    child('judge').once('value', function(data) {
      var counter = data.numChildren();
      var error = undefined;
      for (var judgeInputKey in data.val()) {
        tester(data.val()[judgeInputKey], function(err, success) {
          if (err) {
            error = err;
          }
          if (!success) {
            error = 'Incorrect output.';
          }
          counter--;
          if (counter == 0) {
            callback(error);
          }
        });
      }
    });
};

function solveProblem(user, problem, score, path) {
  root.child('users').child(user.id).child('problems').child(problem.name).set({
    'name': problem.name,
    'score': score,
    'timestamp': new Date().getTime(),
    'type': problem.type,
    'path': path
  });
};

// callback is called whenever the firebase data changes
function listener(callback) {
  root.child('users').on('value', function(data) {
    callback(data.val());
  });
}

exports.createUser = createUser;
exports.getUser = getUser;
exports.findUser = findUser;
exports.getSolvedProblems = getSolvedProblems;
exports.listProblems = listProblems;
exports.findProblem = findProblem;
exports.submitProblem = submitProblem;
exports.judgeSubmission = judgeSubmission;
exports.solveProblem = solveProblem;
exports.listener = listener;

