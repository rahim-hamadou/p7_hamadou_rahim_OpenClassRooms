"use strict";
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			email: DataTypes.STRING,
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			isAdmin: DataTypes.BOOLEAN,
			// bio: DataTypes.STRING,
		},
		{},
	);
	User.associate = function (models) {
		// associations can be defined here
		models.User.hasMany(models.Post);
	};
	return User;
};
