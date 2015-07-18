var express = require('express');
var http = require('http');
var passport = require('passport');
var hbs = require('hbs');
var routes = require('./routes');

var app = express();

// all environments

app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.cookieParser());
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.session({
    secret: 'SECRET',
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes.initialRouter);
app.use(app.router);

passport.use(routes.localStrategy);
passport.serializeUser(function(user, done) {
    done(null, user.id)
});
passport.deserializeUser(routes.findUser);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// handlebars
hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

app.get('/', routes.home);
app.post('/login', routes.login);
app.get('/logout', routes.logout);
app.post('/register', routes.register);
app.get('/rules', routes.rules);
app.get('/challenge', function(req, res) {
    res.redirect("/challenges");
});
app.get('/challenges', routes.getChallenges);
app.get('/challenge/:challengeId', routes.displayChallenge);
app.get('/challenges/:challengeId', routes.displayChallenge);
app.post('/submit', routes.submit);
app.get('/scoreboard', routes.scoreboard);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
