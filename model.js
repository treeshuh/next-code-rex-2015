var firebase = require('./firebase');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
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
  if(/[^a-zA-Z0-9_]/.test(username)) {
    callback('Invalid characters in username');
    return;
  }
  if (user.length < 4) {
    callback('Username must be at least 4 characters long');
    return;
  }
  if (password !== passwordconfirm) {
    callback('Passwords don\'t match');
    return;
  }
  firebase.getUser(username, function(err, user) {
    if (user) {
      callback('Username already exists');
    } else {
      firebase.createUser(username, bcrypt.hashSync(password, 10), function(err) {
        callback(err);
      });
    }
  });
}

exports.findUser = firebase.findUser;

exports.listChallenges = firebase.listChallenges;

exports.getChallenges = function(user, callback) {
  // Returns a resource of the following form:
  // root
  //   speed
  //     1 
  //       id: "speed1"
  //       title: "Next House, Best House!"
  //       score: 57 [or 'unsolved']
  //       maxScore: 200
  //       detail:
  //         timeLimit: 45
  //         passage: "To be or not to be, that is the question..."
  //     2
  //     3
  //     ...
  //   code
  //     1 
  //       id: "code1"
  //       title: "Prime numbers"
  //       score: 120 [or 'unsolved']
  //       maxScore: 180
  //       detail:
  //         charCount: 36 // our charCount to beat
  //         baseScore: 120
  //         statement: "Return true if a given positive integer is prime, and false otherwise..."
  //     2
  //     3
  //     ...
  //    puzzle
  //      1 
  //        id: "puzzle1"
  //        title: "Nonogram"
  //        score: 200 or ['unsolved']
  //        maxScore: 200
  //        detail:
  //          url: "puzzles/p1.pdf" (relative to "public" directory)
  //          statement: (optional flavor)

  firebase.listChallenges(user, function(err, challenges) {
    firebase.getSolvedChallenges(user, function(err, solvedChallenges) {
      if (!solvedChallenges) {
        solvedChallenges = [];
      }
      resource = new Object();
      resource.speed = [];
      resource.code = [];
      resource.puzzle = [];
      for (var challengeType in challenges) {
        for (var challengeId in challenges[challengeType]) {
          var challenge = challenges[challengeType][challengeId];
          if (challengeId in solvedChallenges) {
            challenge.score = solvedChallenges[challengeId].score;
          } else {
            challenge.score = 'unsolved';
          }
          resource[challengeType].push(challenge);
        }
      }
      callback(resource);
    });
  });
}

exports.submitSpeed = function(user, challengeId, data, callback) {

  firebase.findChallenge(challengeId, function(err, challenge) {
    if (err || !challenge) {
      callback(true, "Invalid challenge");
      return;
    } 
    firebase.getSolvedChallenges(user, function(err, solvedChallenges) {
      improved = false;
      if (!solvedChallenges || !(challengeId in solvedChallenges)) {
        previousScore = 0;
        improved = true;
      } else {
        previousScore = solvedChallenges[challengeId].score;
        improved = (data.score > previousScore);
      }
      achievedMaxScore = (Math.max(previousScore, data.score) == challenge.maxScore);
      if (improved) {
        firebase.solveChallenge(user, challengeId, data.score, data);
      }
      callback(false, {improved: improved, achievedMaxScore: achievedMaxScore, score: data.score, previousScore: previousScore})
    });
  });
}

exports.submitPuzzle = function(user, challengeId, input, callback) {
  const INCORRECT = "Sorry, your solution " + input.toUpperCase().trim() + " was incorrect.";
  const CORRECT = "Congratuations! You have solved this puzzle."
  const SOLVED = "You've already solved this puzzle."

  firebase.findChallenge(challengeId, function(err, challenge) {
    if (err || !challenge) {
      callback(true, "Invalid challenge");
      return;
    } 
    var correct = (userInput.toLowerCase().trim() == challenge.judge);
    firebase.getSolvedProblems(user, function(err, solvedChallenges) {
      if (!correct) {
        message = INCORRECT;
      } else if (!solvedChallenges || !(challengeId in solvedChallenges)){
        firebase.solveChallenge(user, challengeId, challenge.maxScore, input);
        message = CORRECT;
      } else {
        message = SOLVED;
      }
      callback(false, {input: input, correct: correct, message: message});
    });
  });
}

exports.submitCode = function(user, challengeId, input, callback) {
  firebase.findChallenge(challengeId, function(err, challenge) {
    if (err || !challenge) {
      callback(true, "Invalid challenge");
      return;
    }
    // Copy file
      firebase.submitCode(function(err, submissionID) {
        if (err) {
          callback(true, err);
          return;
        }
        var dest = SUBMISSION_DIRECTORY + 's' + submissionID + '-' + user.username + '-' + challengeId + '.py';
        fs.writeFile(dest, input + "\n" + challenge.detail.tester, function(err) {
            // Run program on judge input
            firebase.judgeSubmission(user, challengeId, function(input, expected, callback) {
              if (/win/.test(process.platform)) {
                command =  'python ' + dest + ' ' + input; // Windows + Mac
              } else {
                command =  'timeout 3s python ' + dest + ' ' + input; // Linux
              }
              //console.log(command);
              exec(command, function(error, stdout, stderr) {
                if (error) {
                  callback(error, true);
                  return;
                }
                if (stderr) {
                  callback(stderr, true);
                  return;
                }
                console.log("Output: " + stdout.trim())
                console.log("Expected: " + String(expected).trim())
                callback(false, stdout.trim() == String(expected).trim());
              });
            }, function(err) {
              if (err) {
                if (err.code === 124) {
                  err = {message: 'Time Limit Exceeded!'};
                }
                callback(false, err);
                return;
              }
              // Do modified character count
              exec('go run modules/charcount.go < ' + dest, function(error, stdout, stderr) {
                if (stderr) {
                  callback(true, stderr);
                  return;
                }
                if (parseInt(stdout) <= 0) {
                  callback(true, "System error: charcount");
                  return;
                }
                var maxBonus = challenge.maxScore - challenge.detail.baseScore;
                var bonusScore = setBonus(parseInt(stdout), challenge.detail.charCount, maxBonus);
                score = challenge.detail.baseScore + bonusScore;
                firebase.getSolvedChallenges(user, function(err, solvedChallenges) {
                  if (!solvedChallenges || !(challengeId in solvedChallenges)) {
                    previousScore = 0;
                    improved = true;
                  } else {
                    previousScore = solvedChallenges[challengeId].score;
                    improved = (score > previousScore);
                  }
                  achievedMaxScore = (Math.max(previousScore, score) == challenge.maxScore);
                  if (improved) {
                    firebase.solveChallenge(user, challengeId, score, input);
                  }
                  callback(false, {
                    success: true, 
                    improved: improved, 
                    achievedMaxScore: achievedMaxScore, 
                    score: score, 
                    previousScore: previousScore
                  });
                });
              });
            });
          });
        });
  });
}

function setBonus(userCharCount, ourCharCount, maxBonus) {
  if (userCharCount <= ourCharCount) {
    return maxBonus;
  }
  return Math.round(ourCharCount/userCharCount*maxBonus);
}

/*
 * Schema:
 *
 * scoreboard
 *   topscores
 *     1 [rank]
 *       username: sample-user
 *       score:
 *         speed: 400
 *         code: 600
 *         puzzle: 200
 *         total: 1200
 *     2 [rank]
 *     3 [rank]
 *     ...
 */
var scoreboard;
firebase.listener(function(users) {  // listener that updates scoreboard when firebase changes
  // Fill in the new scoreboard data
  var newScoreboard = {topscores: []};
  for (var userKey in users) {
    var user = users[userKey];
    var score = {speed: 0, code: 0, puzzle: 0, total: 0}
    for (var challengeId in user.challenges) {
      var challenge = user.challenges[challengeId]
      score.total += challenge.score;
      score[challenge.type] += challenge.score
    }
    newScoreboard.topscores.push({username: user.username, score: score});
  }
  newScoreboard.topscores.sort(function(item1, item2) {
    return item2.score.total - item1.score.total;  // larger score is better
  });
  scoreboard = newScoreboard;  // copy to global var; hopefully almost atomic
});

exports.getGlobalScoreboard = function() {
  return scoreboard.topscores;
}

