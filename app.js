var express = require('express');
var app = express();
var morgan = require('morgan');

app.use(morgan('dev'));


app.listen(3000, function(){
  console.log('server is listening');
});

module.exports = app;