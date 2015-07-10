// require default node modules
var path = require('path');
var fs = require('fs'); // file reader

// require third party modules
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var viewEngine = require('ejs-mate'); // https://www.npmjs.com/package/ejs-mate

// require custom modules

var port = process.env.PORT || 8080;

// database
var configDB = {
  'url': 'mongodb://localhost/FiscalNote-Social'
}

mongoose.connect(configDB.url);

var app = express();

// set up middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'anystringoftext', saveUninitialized: true, resave: true }));
app.use('/', require(__dirname + '/routes')); // router

// set view engine
app.engine('ejs', viewEngine);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// public/static files
app.use(express.static(__dirname + '/public'));

// listen
app.listen(port);
console.log('Server running on port: ' + port);
