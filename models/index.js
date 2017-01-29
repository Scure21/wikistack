var Sequelize = require("sequelize");
var marked = require('marked');
var db = new Sequelize("postgres://localhost:5432/wikistack", {
	logging:false
});

var Page = db.define("page", {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	url_title: {
		type: Sequelize.STRING,
		allowNull: false,
		isUrl: true
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false,
    get: function (){
      return marked(this.content);
    }
	},
	status: {
		type: Sequelize.ENUM("open", "closed")
	},
	tags: {
	  type: Sequelize.ARRAY(Sequelize.TEXT),
		set: function (value){
			var arrayOfTags;
			if(typeof value === "string"){
				arrayOfTags = value.split(",").map(function (str)
        {
					return str.trim();
				});
				this.setDataValue("tags", arrayOfTags);
			}else{
				this.setDataValue("tags", value);
			}
		}
	},
	date: {
		type: Sequelize.DATE, defaultValue: Sequelize.NOW
	}
},
	{
		getterMethods : {
			route : function() {
				return "/wiki/" + this.url_title;
			}
		},
		classMethods: {
			findByTag: function (tag){

				return Page.findAll({
					where: {
						tags: {
							$overlap: [tag]
						}
					}
				});
			}
		},
		instanceMethods: {
			findSimilar: function (){
				return Page.findAll({
					where: {
						tags: {
							$overlap: this.tags
						},
						id: {
							$ne: this.id
						}
					}
				});
			}
		}
	});
Page.hook("beforeValidate", function (page) {

	if (page.title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
		page.url_title = page.title.replace(/\s+/g, "_").replace(/\W/g, "");
    //console.log(page.url_title)
    // return page.url_title
	} else {
    // Generates random 5 letter string
		page.url_title = Math.random().toString(36).substring(2, 7);
	}
});


var User = db.define("user", {
	name: {type: Sequelize.STRING, allowNull: false,  is: /^[a-z]+$/i },
	email: {type: Sequelize.STRING, allowNull: false, isEmail: true}
});

Page.belongsTo(User, {as: "author"});

module.exports = {
	Page: Page,
	User: User
};
