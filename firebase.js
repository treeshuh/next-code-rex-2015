/* Functions that interact with Firebase */

var Firebase = require('firebase');
var root = new Firebase('https://next-code-rex-2015.firebaseIO.com');

/*
 * Schema
 *
 * next-code-rex-2015
 *   counters
 *     userID: 15 [ID of most recent user created]
 *     submissionID: 29 [ID of most recent submission]
 *   users
 *     1 [user id]
 *       id: 1
 *       username: sample-user
 *       pwHash: cf7d51e028...
 *       challenges
 *         speed1 [challenge id]
 *           id: "speed1"
 *           score: 57
 *           timestamp: 12304592813
 *           type: speed or code or puzzlea
 *         code2
 *         puzzle1
 *         ...
 *     2
 *     3
 *     ...
 *   challenges
 *       speed1 [challenge Id]
 *         id: "speed1"
 *         title: "Next House, Best House!"
 *         maxScore:
 *         type: "speed"
 *         detail:
 *           timeLimit:
 *           passage:
 *       speed2
 *       ...
 *
 *       code1 [challenge Id]
 *         id: "code1"
 *         title: "Primality Check"
 *         maxScore: 100
 *         type: "code"
 *         judge
 *           1 [judge input Id]
 *             input: 42
 *             expected: false
 *           2
 *           ...
 *         detail:
 *           baseScore:
 *           statement:
 *       code2
 *       ...
 *
 *       puzzle1 [challenge Id]
 *         title: "Nonogram"
 *         maxScore: 200
 *         type: "puzzle"
 *         judge: "colombo" [solution]
 *         detail:
 *           url:
 *           statement: (optional flavor)
 *       puzzle2
 *       ...
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

function getSolvedChallenges(user, callback) {
    root.child('users').child(user.id).child('challenges').once('value', function(data) {
        callback(false, data.val());
    });
};

function listChallengesByType(user, callback) {
    root.child('challenges').once('value', function(data) {
        var challenges = data.val();
        var challengesByType = {
            code: {},
            speed: {},
            puzzle: {}
        };
        for (challengeId in challenges) {
            var challenge = challenges[challengeId];
            challengesByType[challenge.type][challengeId] = challenge;
        }
        callback(false, challengesByType);
    });
};

function allChallenges(callback) {
    root.child('challenges').on('value', function(data) {
        callback(false, data.val())
    })
}

function findChallenge(challengeId, callback) {
    root.child('challenges').child(challengeId).once('value', function(data) {
        callback(false, data.val());
    });
};

function submitCode(callback) {
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

function judgeSubmission(user, challengeId, tester, callback) {
    root.child('challenges').child(challengeId).child('judge').once('value', function(data) {
        var counter = data.numChildren();
        var error = undefined;
        for (var judgeInput in data.val()) {
            tester(judgeInput, data.val()[judgeInput], function(err, success) {
                if (err) {
                    error = err;
                }
                if (!success) {
                    error = {
                        message: "You program returned an incorrect output for one of our test cases. That's all we know."
                    };
                }
                counter--;
                if (counter == 0) {
                    callback(error);
                }
            });
        }
    });
};

function solveChallenge(user, challengeId, score, data) {
    var type = challengeId.slice(0, -1);
    root.child('users').child(user.id).child('challenges').child(challengeId).set({
        'id': challengeId,
        'score': score,
        'timestamp': new Date().getTime(),
        'type': type,
        'best': data
    });
    root.child('solves').child("last").set({
        'id': challengeId,
        'timestamp': new Date().getTime(),
        'score': score,
        'type': type,
        'user': user
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
exports.getSolvedChallenges = getSolvedChallenges;
exports.listChallenges = listChallengesByType;
exports.allChallenges = allChallenges;
exports.findChallenge = findChallenge;
exports.submitCode = submitCode;
exports.judgeSubmission = judgeSubmission;
exports.solveChallenge = solveChallenge;
exports.listener = listener;
