var model = require('./model');

exports.initialRouter = function(req, res, next) {
  if (req.url === '/login' || req.url === '/register' || req.url === '/rules') {
    next();
  } else if (req.user) {
    console.log(req.user.username + " " + req.url);
    next();
  } else {
    res.redirect('/login');
  }
};

exports.localStrategy = model.localStrategy;

exports.findUser = model.findUser;

exports.login = function(req, res) {
  if (req.user) {
    res.redirect('/problems');
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
  res.render('ready_register.html', {user: req.user});
}

exports.register = function(req, res) {
  model.createUser(req.body.username, req.body.password, req.body.passwordconfirm, function(err) {

    if (err) {
      res.render('ready_register.html', {user: req.user, error: err});
    } else {
      res.render('register.html', {user: req.user, error: err});
    }
  });
}

exports.rules = function(req, res) {
  res.render('rules.html', {user: req.user});
}

exports.getProblems = function(req, res) {
  model.getProblems(req.user, function(resource) {
    res.render('problems.html', {
      user: req.user,
      algProblems: resource.algProblems,
      chalProblems: resource.chalProblems
    });
  });
}

exports.readySubmit = function(req, res) {
  var problem = req.query.problem;
  model.listProblems(req.user, function(err, problems) {
    res.render('ready_submit.html', {
      user: req.user,
      problem: problems[problem],
      problems: problems,
      problemScoreboard: model.getProblemScoreboard(problem)
    });
  });
}

exports.submit = function(req, res) {
  model.submitProblem(req.user, req.body.problem, req.files.file, function(err, result) {
    res.render('submit.html', {
      user: req.user,
      problem: req.body.problem,
      error: err,
      result: result
    });
  });
}

exports.scoreboard = function(req, res) {
  res.render('scoreboard.html', {
    user: req.user,
    globalScoreboard: model.getGlobalScoreboard()
  });
}

