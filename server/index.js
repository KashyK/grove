'use strict';

let app, compression, helmet, admin, http, io;

app = require('express')();

http = require('http').Server(app);

helmet = require('helmet');

admin = require('sriracha-admin');

io = require('socket.io')(http);

compression = require('compression');

let postal = require('postal');
let events = postal.channel();

let bodyParser = require('body-parser');
let session = require('express-session');

app.engine('ejs', require('ejs-locals'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'ziggity zaggity',
  name: 'A Pretty Cool Session',
  secure: true
}));
app.use(compression());
app.use(helmet());

app.use(require('express')['static']('public'));

function ensureSecure(req, res, next) {
  if (req.secure) return next();
  if (req.headers["x-forwarded-proto"] === "https") return next();
  res.redirect('https://' + req.hostname + req.url); // express 4.x
}

app.all('*', ensureSecure); // at top of routing calls

const User = require(__dirname + '/mongo')(app, events);
require(__dirname + '/client-interact')(io, User);

app.use('/admin', admin({
  User: {
    searchField: 'username'
  }
}));

app.get('/', (req, res) => {
  if (req.session.user && req.session.user.username) res.render('../views/dashboard.ejs', {
    user: req.session.user
  });
  else res.render('../views/index.ejs');
  console.log('Home Activated.');
});
app.get('/logout', (req, res) => {
  if (req.session.user) {
    console.log(req.session.user.username + ' has logged out.  ');
    delete req.session.user;
  }
  res.redirect('/');
});
app.get('/login', (req, res) => {
  res.render('../views/login.ejs');
  console.log('Login Activated.');
  
});
app.get('/register', (req, res) => {
  res.render('../views/register.ejs');
  console.log('Register Activated.');
});
app.get('/play', (req, res) => {
  console.log('Play Activated.');

  if (req.session.user && req.session.user.username) res.render('../views/play.ejs', {
    user: req.session.user
  });
  else res.redirect('/login');
});
app.use('/robots', (req, res) => {
  res.sendFile(require('path').resolve('/views/robots.txt'));
  console.log('Robots Activated.');
});
app.get('/license', (req, res) => {
  res.sendFile(require('path').resolve('views/LICENSE.html'));
  console.log('License Activated.');
});
app.get('/settings', (req, res) => {
  res.render(require('path').resolve('views/settings.ejs'));
  console.log('Settings Activated.');
});
app.get('/pwreset', (req, res) => {
  res.render(require('path').resolve('views/pwreset.ejs'));
  console.log('Password Reset Activated.');
});

http.listen(process.env.PORT || 8080, (listening) => {
  if (!process.env.NODE_ENV) {
    console.log('Listening For conections on 0.0.0.0');
    console.log('Server running! ( View license at https://grove-mmo.herokuapp.com/license )');
  }
});

console.log('Login Initializing');
console.log('Register Initializing.');
console.log('Play Initializing.');
console.log('Dashboard Initializing.');
console.log('Robots Initializing.');
console.log('License Initializing.');
console.log('Siracha-Admin Initilizing.');
console.log('Multiplayer server Initilizing.');
console.log('App Initializing.');
console.log('Login Started');
console.log('Register Started.');
console.log('Play Started.');
console.log('Dashboard Started.');
console.log('Robots Started.');
console.log('License Started.');
console.log('Siracha-Admin Started.');
console.log('Multiplayer server Started.');
console.log('App Started.');
