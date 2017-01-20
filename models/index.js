var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = sequelize.define('page', {
  title: sequelize.STRING,
  url_title: sequelize.STRING,
  content: sequelize.TEXT,
  status: sequelize.ENUM('open', 'closed')
};

var User = sequelize.define('user', {
  name: sequelize.STRING,
  email: sequelize.STRING
})