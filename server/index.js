'use strict';

let app, admin, http, io;

app = require('express')();

admin = require('sriracha');

http = require('http').Server(app);

io = require('socket.io')(http);

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
  secret: 'keyboard cat'
}));

let User = require(__dirname + '/mongo')(app, events);
require(__dirname + '/client-interact')(io, User);

app.get('/', (req, res) => {
  if (req.session.user && req.session.user.username) res.render('../views/dashboard.ejs', {
    user: req.session.user
  });
  else res.render('../views/index.ejs');
  console.log('Home Activated.');
});
app.get('/logout', (req, res) => {
  if (req.session.user) {
    console.log(req.session.user.username + ' has logged out.\n\n');
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
app.use('/robots.txt', (req, res) => {
  res.sendFile(require('path').resolve('views/robots.txt'));
  console.log('Robots Activated.');
});
app.get('/license', (req, res) => {
  res.sendFile(require('path').resolve('views/LICENSE.txt'));
  console.log('License Activated.');
});
app.get('/img/Grove-logos/Grove-logo-2.png', (req, res) => {
  res.sendFile(require('path').resolve('/img/Grove-logos/Grove-logo-2.png'));
  console.log('Image Activated.');
});
app.get('/img/Grove-logos/Grove-logo-1.png', (req, res) => {
  res.sendFile(require('path').resolve('/img/Grove-logos/Grove-logo-1.png'));
  console.log('Image Activated.');
});
app.get('/img/Grove-logos/Grove-logo-3.png', (req, res) => {
  res.sendFile(require('path').resolve('/img/Grove-logos/Grove-logo-3.png'));
  console.log('Image Activated.');
});
app.get('/img/Grove-logos/Grove-logo.png', (req, res) => {
  res.sendFile(require('path').resolve('/img/Grove-logos/Grove-logo.png'));
  console.log('Image Activated.');
});
app.get('/img/Grove-logos/Grove-logo-4.png', (req, res) => {
  res.sendFile(require('path').resolve('/img/Grove-logos/Grove-logo-4.png'));
  console.log('Image Activated.');
});
app.get('/img/Grove-logos/Grove-logo-1.png', (req, res) => {
  res.sendFile(require('path').resolve('/img/Grove-logos/Grove-logo-1.png'));
  console.log('Image Activated.');
});
app.get('/admin', (req, res) => {
  console.log('Admin Activated.');
});

app.use('/admin', admin({
  username: 'admin',
  password: 'porpose'
}));

app.use(require('express')['static']('public'));

http.listen(process.env.PORT || 8080, (listening) => {
  if (!process.env.NODE_ENV) {
    console.log('Server running! ( View license at https://grove-mmo.herokuapp.com/license )');
  }
});

console.log('Login Initializing');
console.log('Register Initializing.');
console.log('Play Initializing.');
console.log('Dashboard Initializing.');
console.log('Siracha Initializing.');
console.log('Admin Initializing.');
console.log('Siracha Initializing.');
console.log('Robots Initializing.');
console.log('License Initializing.');
console.log('App Initializing.');
console.log('Login Started');
console.log('Register Started.');
console.log('Play Started.');
console.log('Dashboard Started.');
console.log('Siracha Started.');
console.log('Admin Started.');
console.log('Siracha Started.');
console.log('Robots Started.');
console.log('License Started.');
console.log('App Started.');