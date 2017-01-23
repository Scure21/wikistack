var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging:false
});

var Page = db.define('page', {
  title: {type: Sequelize.STRING, allowNull: false},
  url_title: {type: Sequelize.STRING, allowNull: false, isUrl: true},
  content: {type: Sequelize.TEXT },
  status: {type: Sequelize.ENUM('open', 'closed')},
  date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, {
  getterMethods : {
    route : function() { return '/wiki/' + this.url_title }
  },
});
Page.hook('beforeValidate', function (page) {

  if (page.title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    page.url_title = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
    //console.log(page.url_title)
    // return page.url_title
  } else {
    // Generates random 5 letter string
    page.url_title = Math.random().toString(36).substring(2, 7);
  }
})


var User = db.define('user', {
  name: {type: Sequelize.STRING, allowNull: false,  is: /^[a-z]+$/i },
  email: {type: Sequelize.STRING, allowNull: false, isEmail: true}
});



module.exports = {
  Page: Page,
  User: User
};
