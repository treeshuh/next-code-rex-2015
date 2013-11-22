var express = require('express');
var http = require('http');
var passport = require('passport');
var hbs = require('hbs');

var routes = require('./routes');
var initialize = require('./model/initialize');
var user = require('./model/user');

var app = express();

// all environments

app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.cookieParser());
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

passport.use(initialize.strategy);
passport.serializeUser(initialize.serializeUser);
passport.deserializeUser(initialize.deserializeUser);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.login);
app.get('/login', routes.login);
app.post('/login',
  passport.authenticate('local', {
  	failureRedirect: '/login'
  }), routes.problems);
app.get('/problems', routes.problems);
app.get('/submit', routes.ready_submit);
app.post('/submit', routes.submit);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
