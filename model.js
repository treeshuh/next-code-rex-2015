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

exports.getProblems = function(user, callback) {
  // Returns a resource of the following form:
  // root
  //   algProblems
  //     alg1 [problem name]
  //       name: alg1
  //       score: 57 [or 'unsolved']
  //     alg2
  //     alg3
  //     ...
  //   chalProblems
  //     chal1
  //     chal2
  //     chal3
  //     ...
  firebase.getProblems(user, function(err, problems) {
    firebase.getSolvedProblems(user, function(err, solvedProblems) {
      if (!solvedProblems) {
        solvedProblems = [];
      }
      resource = new Object();
      resource.algProblems = [];
      resource.chalProblems = [];
      for (var problemName in problems) {
        var problem = problems[problemName];
        if (problemName in solvedProblems) {
          problem.score = solvedProblems[problemName].score;
        } else {
          problem.score = 'unsolved';
        }
        if (problem.type === 'alg') {
          resource.algProblems.push(problem);
        } else {  // 'chal'
          resource.chalProblems.push(problem);
        }
      }
      callback(resource);
    });
  });
}
