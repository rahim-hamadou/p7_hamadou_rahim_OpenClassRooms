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
				// expiration du token en heures
				expiresIn: "3h",
			},
		);
	},
	// fonction qui recupere le token
	parseAuthorization: function (authorization) {
		return authorization != null ? authorization.replace("Bearer ", "") : null;
	},
	// fonction qui recupere le userID
	getUserId: function (authorization) {
		let userId = -1;
		let token = module.exports.parseAuthorization(authorization);
		if (token != null) {
			try {
				// verification du token parse
				let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
				if (jwtToken != null)
					// recuperation du userID a partir du token qui contien isAdmin aussi
					userId = jwtToken.userId;
				isAdmin = jwtToken.isAdmin;
			} catch (err) {}
		}
		return userId;
	},
};
