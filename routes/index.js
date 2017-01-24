const express = require('express');
const router = express.Router();
const model = require('../models');
const Page = model.Page;
const User = model.User;

router.get('/', function(req, res, next){
  Page.findAll({})
  .then(function (pages){
    res.render('index', {
      pages: pages
    });
  })
  .catch(next);
});

router.get('/add', function(req, res, next){
  res.render('addpage.html');
});

router.post('/', function(req, res, next){
var newPage = Page.build(req.body);
    //using Synchronous .build with .save
    newPage.save()
    .then(function(savedPage){
      res.redirectr(savedPage.route)
    })
    .catch(function (err){
      next(err);
    });

});

router.get('/:urlTitle', function(req, res, next){
  var urlTitleOfPage = req.body.urlTitle;

  Page.findOne({
    where: {
      url_title: req.params.urlTitle
    }
  })
  .then(function(page){
    if(page === null){
      res.status(404).send();
    }else{
    res.render('wikipage', {
      page: page
    });
    }
  })
  .catch(next);


});

module.exports= router;
