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

//SEARCH
router.get('/search/:tag', function(req, res, next){
  Page.findByTag(req.params.tag)
      .then(function (pages){
        res.render('index', {
          pages: pages
        })
      })
      .catch(next);
});

//POST
router.post('/', function(req, res, next){

  User.findOrCreate({
    where: {
      email: req.body.authorEmail,
      name: req.body.authorName
    }
  })
    .spread(function(user, wasCreatedBool){
      //var splitTags = req.body.tags.split(',').map((str) => str.trim());
      return Page.create({
        title:req.body.title,
        content: req.body.content,
        status: req.body.status,
        tags: req.body.tags
      }).then(function(createdPage){
        return createdPage.setAuthor(user);
      })
    }).then(function(createdPage){
      res.redirect(createdPage.route);
    })
    .catch(next);

    // var newPage = Page.build(req.body);
    // console.log(req.body)
    // //using Synchronous .build with .save
    // newPage.save()
    // .then(function(savedPage){
    //   console.log(savedPage)
    //   res.redirect(savedPage.route)
    // })
    // .catch(function (err){
    //   next(err);
    // });
});

router.get('/:urlTitle', function(req, res, next){
  //console.log(req.params)
  var urlTitleOfPage = req.params.urlTitle;
  Page.findOne({
    where: {
      url_title: urlTitleOfPage
    }

  })
  .then(function(page){
    if(page === null){
      return next(new Error('That page was not found!'));
    }else{
      return page.getAuthor()
        .then(function(author){
          page.author = author;
          res.render('wikipage', {
            page: page
          });
        })
      }
    })
    .catch(next);
});

//SIMILAR
router.get('/:urlTitle/similar', function(res, req, next){
  urlTitleOfPage = req.params.urlTitle;

  Page.findOne({
    where: {
      urlTitle: urlTitleOfPage
    }
  })
  .then(function (page){

    if(page === null){
      return next(new Error('that page wat not found!'))
    }
    return page.findSimilar();
  })
  .then(function (similarPages){
    res.render('index', {
      pages: similarPages
    });
  })
  .catch(next)
})

module.exports= router;
