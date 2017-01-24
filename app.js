var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');
var makeRouter = require('./routes');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var models = require('./models')
var routes = require('./routes')


app.use(morgan('dev'));

// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

app.use('/wiki', routes);

app.use(express.static(path.join(__dirname, '/public')));

//error handler
app.use(function(err, req, res, next){
  console.error(err)
  res.status(500).send(err.message)
})

models.User.sync({})
  .then(function (){
    return models.Page.sync({})
  })
  .then(function(){
    app.listen(3000, function(){
    console.log('server is listening');
    });
  })
  .catch(console.error);


module.exports = app;
