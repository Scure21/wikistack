const express = require('express');
const router = express.Router();
const model = require('../models');
const Page = model.Page;
const User = model.User;
const Promise = require('bluebird');
module.exports = router;

//GET /users
router.get('/', function(req, res, next){
  User.findAll()
      .then(function(users){
        res.render('users', {
          users: users
        });
      })
      .catch(next)
})

//GET /users/id
router.get('/:userId', function(req, res, next){
  var findingUsersPages = Page.findAll({
    where: {
      authorId : req.params.userId
    }
  });
  var findingUser =  User.findById(req.params.userId)

  Promise.all([
    findingUsersPages, findingUser
  ])
    .then(function(values){
        var pages = values[0];
        var user = values[1];

        user.pages = pages;

        res.render('userspage', {
          user : user
        });
    })
    .catch(next);
})
