var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');
var makeRouter = require('./routes');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');



app.use(morgan('dev'));

// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);



app.use(express.static(path.join(__dirname, '/public')));

app.listen(3000, function(){
  console.log('server is listening');
});

module.exports = app;