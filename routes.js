/* Routes */

exports.login = function(req, res) {
  if (req.user) {
    res.redirect('/problems');
  } else {
    res.render('login.html');
  }
}

exports.logout = function(req, res) {
  req.session.regenerate(function() {
    req.logout();
    res.redirect('/');
  });
}

exports.problems = function(req, res) {
  if (req.user) {
    res.render('problems.html', {user: req.user.id});
  } else {
    res.redirect('/login');
  }
}

exports.ready_submit = function(req, res) {
  if (req.user) {
    res.render('ready_submit.html', {user: req.user.id});
  } else {
    res.redirect('/login');
  }
}

exports.submit = function(req, res) {
  if (req.user) {
    // TODO code to grade the file req.files
    res.render('submit.html', {user: req.user.id});
  } else {
    res.redirect('/login');
  }
}

