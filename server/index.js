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
});
app.get('/logout', (req, res) => {
  if (req.session.user) {
    console.log(req.session.user.username + ' has logged out!\n\n');
    delete req.session.user;
  }
  res.redirect('/');
});
app.get('/login', (req, res) => {
  res.render('../views/login.ejs');
});
app.get('/register', (req, res) => {
  res.render('../views/register.ejs');
});
app.get('/play', (req, res) => {
  if (req.session.user && req.session.user.username) res.render('../views/play.ejs', {
    user: req.session.user
  });
  else res.redirect('/login');
});
app.use('/robots.txt', (req, res) => {
  res.sendFile(require('path').resolve('views/robots.txt'));
});
app.get('/license', (req, res) => {
  res.sendFile(require('path').resolve('views/LICENSE.txt'));
});
app.get('/ArtifexLISC', (req, res) => {
  res.sendFile(require('path').resolve('views/ArtifexLISC.txt'));
});
app.get('/HALISC', (req, res) => {
  res.sendFile(require('path').resolve('views/HALISC.txt'));
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