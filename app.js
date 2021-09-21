var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

cors = require('cors');
bodyParser = require('body-parser');

// var indexRouter = require('./routes/index');
// var router = express.Router(); 

var app = express();
var apiRoutes = require('./routes/api-routes');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use('/api', apiRoutes);

module.exports = app;
