//var model = require('./model');
var firebase = require('./firebase');

exports.initialRouter = function(req, res, next) {
  if (req.url === '/login' || req.url === '/createUser') {
    next();
  } else if (req.user) {
    console.log(req.user.username + " " + req.url);
    next();
  } else {
    res.redirect('/login');
  }
};

exports.login = function(req, res) {
  if (req.user) {
    res.redirect('/problems');
  } else {
    res.render('login.html');
  }
};

exports.readyRegister = function(req, res) {
  res.render('ready_register.html', {user: req.user});
}

exports.register = function(req, res) {
  res.render('register.html', {user: req.user});
}

exports.getProblems = function(req, res) {
  res.render('problems.html', {user: req.user});
}

exports.readySubmit = function(req, res) {
  res.render('ready_submit.html', {user: req.user});
}

exports.submit = function(req, res) {
  res.render('submit.html', {user: req.user});
}

