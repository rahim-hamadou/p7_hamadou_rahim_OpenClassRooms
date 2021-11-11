// Imports
const jwt = require("jsonwebtoken");

const JWT_SIGN_SECRET = "montokensecret";
// Fonctions

module.exports = {
	generateTokenForUser: function (userData) {
		return jwt.sign(
			{
				userId: userData.id,
				isAdmin: userData.isAdmin,

				// ne rien mettre de confidentiel ici car avec https://jwt.io/ on decode les token
				// test: "bienvenue",
			},
			JWT_SIGN_SECRET,
			{
				expiresIn: "3h",
			},
		);
	},
};
