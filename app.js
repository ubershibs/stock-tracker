var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connect(process.env.MONGODB_URI);
require('./models/datasetSchema');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
var logger = require('morgan');
var stockCtrl = require('./controllers/stock.js');
var StockCtrl = new stockCtrl();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile('index');
});

app.get('/stocks/all', function(req, res) {
  StockCtrl.loadAll().then(function(dataset) {
    res.json(dataset);
  });
});

io.on('connection', function(socket){
  socket.on('lookup stock', function(symbol){
    StockCtrl.retrieveStockData(symbol).then(function(dataset) {
      io.emit('add stock', dataset);
    });
  });
  
  socket.on('remove stock', function(symbol){
    StockCtrl.removeStock(symbol);
    io.emit('remove stock', symbol);
  });
});

var port = process.env.PORT || 8080;

var server = http.listen(port, function(){  
  console.log('listening on *:' + port);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: {}
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

module.exports = app;