'use strict';
var path = require('path');
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var appLogger = global.appLogger;

// HTTP Request Logging
app.use(morgan(':remote-addr :method :url :status :response-time ms', {stream: appLogger}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// app.use(express.static(__dirname + '/public'));

/***************************************************
 * Models and Routes Setup
 ***************************************************/
app.locals.getCtrlPath = function(pCtrlName) {
  return path.join(__dirname, 'src', 'controllers', pCtrlName);
};
require('./src/routes')(app);

/***************************************************
 * Exception Handling Setup
 ***************************************************/
/* Handle router level uncaught exceptions */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({success: false, data: err.message});
  appLogger.error(err);
});

app.listen(8080, function(){
  appLogger.info('Express server listening on port 8080');
});

module.exports = app;