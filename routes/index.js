const express = require('express');
const router = express.Router();
const model = require('../models');


router.get('/wiki', function(req, res, next){
  res.render('index')
});

router.get('/wiki/add', function(req, res, next){
  res.render('addpage.html');
});

router.post('/wiki', function(req, res, next){
  
  model.Page.create({
    title: req.body.title,
    content: req.body.pageContent,
  }).then(function(instance){
    res.json(instance);
  });

  // res.json new page instance 
   // page.save();
  //.then(function(){
  //   res.json(page);
  // });

});

router.get('/wiki/:urlTitle', function(req, res, next){
  
  model.Page.findOne({ 
    where: { 
      url_title: req.params.urlTitle 
    } 
  })
  .then(function(foundPage){
    res.render('wikipage.html', {
      title: foundPage.title,
      content: foundPage.content
    });
  })
  .catch(next);


});

module.exports= router;
