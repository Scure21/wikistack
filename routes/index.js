const express = require('express');
const router = express.Router();
const model = require('../models');


router.get('/wiki', function(req, res, next){
  res.render('index')
})

router.get('/wiki/add', function(req, res, next){
  res.render('addpage.html')
})

router.post('/wiki', function(req, res, next){
   var page = model.Page.build({
    title: req.body.title,
    content: req.body.pageContent,
  });

  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  res.json(page.save());
})

module.exports= router;
