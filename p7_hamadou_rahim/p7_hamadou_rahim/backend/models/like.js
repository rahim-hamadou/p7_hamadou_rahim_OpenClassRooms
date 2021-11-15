"use strict";
module.exports = (sequelize, DataTypes) => {
	var Like = sequelize.define(
		"Like",
		{
			// reference des clés
			messageId: {
				type: DataTypes.INTEGER,
				references: {
					// reference le modele Message et la clé: id
					model: "Message",
					key: "id",
				},
			},
			userId: {
				type: DataTypes.INTEGER,
				references: {
					// reference le modele User et la clé: id
					model: "User",
					key: "id",
				},
			},
			isLike: DataTypes.INTEGER,
		},
		{},
	);
	Like.associate = function (models) {
		// associations can be defined here

		// declaration de la relation entre les tables Message et User
		models.User.belongsToMany(models.Message, {
			through: models.Like,
			foreignKey: "userId",
			otherKey: "messageId",
		});

		// declaration de la relation entre les tables User et Message
		models.Message.belongsToMany(models.User, {
			through: models.Like,
			foreignKey: "messageId",
			otherKey: "userId",
		});

		// liaison entre les clé etrangeres et la table de reference
		models.Like.belongsTo(models.User, {
			foreignKey: "userId",
			as: "user",
		});

		models.Like.belongsTo(models.Message, {
			foreignKey: "messageId",
			as: "message",
		});
	};
	return Like;
};
