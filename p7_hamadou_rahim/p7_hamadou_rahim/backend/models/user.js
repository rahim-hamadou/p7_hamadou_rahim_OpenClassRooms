"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			models.User.hasMany(models.Message);
		}
	}
	User.init(
		{
			email: DataTypes.STRING,
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			bio: DataTypes.STRING,
			isAdmin: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: "User",
		},
	);
	return User;
};

// test

// "use strict";
// module.exports = (sequelize, DataTypes) => {
// 	var User = sequelize.define(
// 		"User",
// 		{
// 			email: DataTypes.STRING,
// 			username: DataTypes.STRING,
// 			password: DataTypes.STRING,
// 			bio: DataTypes.STRING,
// 			isAdmin: DataTypes.BOOLEAN,
// 		},
// 		{
// 			classMethods: {
// 				associate: function (models) {
// 					// associations can be defined here
// 					models.User.hasMany(models.Message);
// 				},
// 			},
// 		},
// 	);
// 	return User;
// };

// test 2

// "use strict";
// module.exports = (sequelize, DataTypes) => {
// 	var User = sequelize.define(
// 		"User",
// 		{
// 			email: DataTypes.STRING,
// 			username: DataTypes.STRING,
// 			password: DataTypes.STRING,
// 			bio: DataTypes.STRING,
// 			isAdmin: DataTypes.BOOLEAN,
// 		},
// 		{
// 			classMethods: {
// 				associate: function (models) {
// 					// associations can be defined here
// 					models.User.hasMany(models.Message);
// 				},
// 			},
// 		},
// 	);
// 	return User;
// };
