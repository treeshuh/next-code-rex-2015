var firebase = require('./firebase');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var fs = require('fs');
var exec = require('child_process').exec;

const SUBMISSION_DIRECTORY = 'submissions/';

if (!fs.existsSync(SUBMISSION_DIRECTORY)) {
  fs.mkdirSync(SUBMISSION_DIRECTORY);
}

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

exports.listProblems = firebase.listProblems;

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
  firebase.listProblems(user, function(err, problems) {
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

var submissionID = 0;

exports.submitProblem = function(user, problem, file, callback) {
  // Copy file
  fs.readFile(file.path, function(err, data) {
    submissionID++;
    var dest = SUBMISSION_DIRECTORY + 's' + submissionID + '-' + user.username + '.py';
    fs.writeFile(dest, data, function(err) {
      // Check for forbidden constructs
      exec('python modules/sanitizer.py < ' + dest, function(error, stdout, stderr) {
        if (stdout) {
          callback(true, "Forbidden constructs: " + stdout);
          return;
        }
        // Run program on judge input
        exec('python ' + dest, function(error, stdout, stderr) {
          if (stderr) {
            callback(true, stderr);
            return;
          }
          var success = true;  // TODO change this, obviously
          if (success) {
            // Do modified character count
            exec('go run modules/charcount.go < ' + dest, function(error, stdout, stderr) {
              if (stderr) {
                callback(true, stderr);
                return;
              }
              var score = parseInt(stdout);
              if (score <= 0) {
                callback(true, "System error: charcount");
                return;
              }
              firebase.getSolvedProblems(user, function(problems) {
                if (!problems || !(problem in problems) || score < problems[problem].score) {
                  firebase.solveProblem(user, problem, score);
                }
                callback(false, 'Program successful. Score: ' + score);
              });
            });
          } else {
            callback(false, 'Program incorrect.');
          }
        });
      });
    });
  });
}
