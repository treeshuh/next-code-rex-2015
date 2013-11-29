var model = require('./model');

exports.initialRouter = function(req, res, next) {
  if (req.url === '/login' || req.url === '/register') {
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
  model.listProblems(req.user, function(err, problems) {
      console.log(problems);
      console.log(req.query.problem);
    res.render('ready_submit.html', {
      user: req.user,
      problem: problems[req.query.problem],
      problems: problems
    });
  });
}

exports.submit = function(req, res) {
  res.render('submit.html', {user: req.user});
}
