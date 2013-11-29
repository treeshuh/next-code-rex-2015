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

/*
 * Schema:
 *
 * scoreboard
 *   topscores
 *     1 [rank]
 *       username: sample-user
 *       score: 57
 *     2 [rank]
 *     3 [rank]
 *     ...
 *   problems
 *     problem1 [problem name]
 *       1 [rank]
 *         username: sample-user
 *         score: 29
 *       2 [rank]
 *       3 [rank]
 *       ...
 *     problem2
 *     problem3
 *     ...
 */
var scoreboard;
firebase.listener(function(users) {  // listener that updates scoreboard when firebase changes
  // Fill in the new scoreboard data
  var newScoreboard = {topscores: [], problems: new Object()};
  for (var userKey in users) {
    var user = users[userKey];
    var userScore = 0;
    for (var problemName in user.problems) {
      var problem = user.problems[problemName];
      if (!(problemName in newScoreboard.problems)) {
        newScoreboard.problems[problemName] = [];
      }
      newScoreboard.problems[problemName].push({username: user.username, score: problem.score}); userScore += 1000 - Math.min(500, problem.score);  // arbitrary score aggregator
    }
    newScoreboard.topscores.push({username: user.username, score: userScore});
  }

  // Now sort all the lists in the scoreboard
  for (var problemName in newScoreboard.problems) {
    newScoreboard.problems[problemName].sort(function(item1, item2) {
      return item2.score - item1.score;  // smaller score is better
    });
  }
  newScoreboard.topscores.sort(function(item1, item2) {
    return item1.score - item2.score;  // larger score is better
  });
  scoreboard = newScoreboard;  // copy to global var; hopefully almost atomic
});

exports.getProblemScoreboard = function(problem) {
  return scoreboard.problems[problem];
}

exports.getGlobalScoreboard = function() {
  return scoreboard.topscores;
}

