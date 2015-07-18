var model = require('./model');

exports.initialRouter = function(req, res, next) {
    if (req.url === '/login' || req.url === '/register' || req.url === '/rules') {
        next();
    } else if (req.user) {
        console.log(req.user.username + " " + req.url);
        next();
    } 
    //temporary
    else if (req.url === '/index') {
        res.render('index.html');
    } else {
        res.redirect('/login');
    }
};

exports.localStrategy = model.localStrategy;

exports.findUser = model.findUser;

exports.login = function(req, res) {
    if (req.user) {
        res.redirect('/challenges');
    } else {
        res.render('login.html');
    }
};

exports.logout = function(req, res) {
    req.session.regenerate(function() {
        req.logout();
        res.redirect('/login');
    });
}

exports.readyRegister = function(req, res) {
    res.render('ready_register.html', {
        user: req.user
    });
}

exports.register = function(req, res) {
    model.createUser(req.body.username, req.body.password, req.body.passwordconfirm, function(err) {
        if (err) {
            res.render('ready_register.html', {
                user: req.user,
                error: err
            });
        } else {
            res.render('register.html', {
                user: req.user,
                error: err
            });
        }
    });
}

exports.rules = function(req, res) {
    res.render('rules.html', {
        user: req.user
    });
}

exports.getChallenges = function(req, res) {
    model.getChallenges(req.user, function(resource) {
        res.render('challenges.html', {
            user: req.user,
            speedChallenges: resource.speed,
            codeChallenges: resource.code,
            puzzleChallenges: resource.puzzle,
            stats: resource.stats
        });
    });
}

exports.displayChallenge = function(req, res) {
    var challengeId = req.params.challengeId.split(".")[0];
    var type = challengeId.replace(/\d/g, "");
    model.listChallenges(req.user, function(err, challenges) {
        bestSubmission = undefined;
        previousScore = 0;
        if (req.user.challenges && req.user.challenges[challengeId]) {
            previousScore = req.user.challenges[challengeId].score;
            if (type == "code") {
                bestSubmission = (req.user.challenges[challengeId].best).replace(/\\/g, "\\");
            }
        }
        if (challenges[type] && challenges[type][challengeId]) {
            res.render(type + '.html', {
                user: req.user,
                previousScore: previousScore,
                bestSubmission: bestSubmission,
                type: type,
                challengeId: challengeId,
                challenge: challenges[type][challengeId],
                challenges: challenges
            });
        } else {
            res.redirect("/challenges");
        }
    });
}

exports.submit = function(req, res) {
    // req.body = {challengeId: "code1", data: ..., input: ...}
    var challengeId = req.body.challengeId;
    if (/code/.test(challengeId)) {
        submitCode(req, res);
    } else if (/puzzle/.test(challengeId)) {
        submitPuzzle(req, res);
    } else if (/speed/.test(challengeId)) {
        submitSpeed(req, res);
    } else {
        res.json({
            error: "Invalid challenge ID."
        });
    }
}

submitSpeed = function(req, res) {
    // data = {score: 147, completion: 95 (%), time: 42 (s)}
    model.submitSpeed(req.user, req.body.challengeId, req.body.data, function(err, result) {
        res.json({
            user: req.user,
            challenge: req.body.challengeId,
            error: err,
            result: result
        });
    });
}

submitCode = function(req, res) {
    model.submitCode(req.user, req.body.challengeId, req.body.data, req.body.ext, function(err, result) {
        if (err) {
            console.log(result);
        }
        res.json({
            user: req.user,
            challenge: req.body.challengeId,
            error: err,
            result: result
        });
    });
}

submitPuzzle = function(req, res) {
    model.submitPuzzle(req.user, req.body.challengeId, req.body.input, function(err, result) {
        res.json({
            user: req.user,
            challenge: req.body.challenge,
            error: err,
            result: result
        })
    })
}

exports.scoreboard = function(req, res) {
    res.render('scoreboard.html', {
        user: req.user,
        globalScoreboard: model.getGlobalScoreboard(),
        maxScores: model.getMaxScores()
    });
}