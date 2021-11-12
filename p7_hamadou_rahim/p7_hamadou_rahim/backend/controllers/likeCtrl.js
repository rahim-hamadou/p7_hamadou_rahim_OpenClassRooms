// -------------------------imports

// importation des modeles
var models = require("../models");
// importation du module de verification des token
var jwtUtils = require("../utils/jwt.utils");
// importation du module async qui sert a ordonée les fonctions
var asyncLib = require("async");
// -------------------------constants

// -------------------------Fonctions

// fonction pour liker des posts
exports.likePost = function (req, res) {
	// Getting auth header
	let headerAuth = req.headers["authorization"];
	let userId = jwtUtils.getUserId(headerAuth);

	// params
	let messageId = parseInt(req.params.messageId);

	if (messageId <= 0) {
		return res.status(400).json({ error: "invalid parameters" });
	}
	// application de la fonction
	asyncLib.waterfall(
		[
			// verification de l'existence du message
			function (done) {
				models.Message.findOne({
					where: { id: messageId },
				})
					.then(function (messageFound) {
						done(null, messageFound);
					})
					.catch(function (err) {
						return res.status(500).json({ error: "unable to verify message" });
					});
			},
			// verification complete du message
			function (messageFound, done) {
				if (messageFound) {
					models.User.findOne({
						where: { id: userId },
					})
						.then(function (userFound) {
							done(null, messageFound, userFound);
						})
						.catch(function (err) {
							return res.status(500).json({ error: "unable to verify user" });
						});
				} else {
					res.status(404).json({ error: "message not found" });
				}
			},
			// verification de l'existence du user, verification des likes de celui ci
			function (messageFound, userFound, done) {
				if (userFound) {
					models.Like.findOne({
						where: {
							userId: userId,
							messageId: messageId,
						},
					})
						.then(function (userAlreadyLikedFound) {
							done(null, messageFound, userFound, userAlreadyLikedFound);
						})
						.catch(function (err) {
							return res.status(500).json({ error: "unable to verify is user already liked" });
						});
				} else {
					res.status(404).json({ error: "user not exist" });
				}
			},
			// verification de si l'user a deja liker sinon ajout d'un lien entre le message et l'user
			function (messageFound, userFound, userAlreadyLikedFound, done) {
				if (!userAlreadyLikedFound) {
					messageFound
						.addUser(userFound, { isLike: LIKED })
						.then(function (alreadyLikeFound) {
							done(null, messageFound, userFound);
						})
						.catch(function (err) {
							return res.status(500).json({ error: "unable to set user reaction" });
						});
				} else {
					if (userAlreadyLikedFound.isLike === DISLIKED) {
						userAlreadyLikedFound
							.update({
								isLike: LIKED,
							})
							.then(function () {
								done(null, messageFound, userFound);
							})
							.catch(function (err) {
								res.status(500).json({ error: "cannot update user reaction" });
							});
					} else {
						res.status(409).json({ error: "message already liked" });
					}
				}
			},
			// maj du message en ajoutant un like
			function (messageFound, userFound, done) {
				messageFound
					.update({
						likes: messageFound.likes + 1,
					})
					.then(function () {
						done(messageFound);
					})
					.catch(function (err) {
						res.status(500).json({ error: "cannot update message like counter" });
					});
			},
		],

		// affiche la propriete like
		function (messageFound) {
			if (messageFound) {
				return res.status(201).json(messageFound);
			} else {
				return res.status(500).json({ error: "cannot update message" });
			}
		},
	);
};

// fonction pour disliker des posts
exports.dislikePost = function (req, res) {
	// Getting auth header
	let headerAuth = req.headers["authorization"];
	let userId = jwtUtils.getUserId(headerAuth);

	// Params
	let messageId = parseInt(req.params.messageId);

	if (messageId <= 0) {
		return res.status(400).json({ error: "invalid parameters" });
	}
	asyncLib.waterfall(
		[
			// verification de l'existence du message
			function (done) {
				models.Message.findOne({
					where: { id: messageId },
				})
					.then(function (messageFound) {
						done(null, messageFound);
					})
					.catch(function (err) {
						return res.status(500).json({ error: "unable to verify message" });
					});
			},
			// verification complete du message
			function (messageFound, done) {
				if (messageFound) {
					models.User.findOne({
						where: { id: userId },
					})
						.then(function (userFound) {
							done(null, messageFound, userFound);
						})
						.catch(function (err) {
							return res.status(500).json({ error: "unable to verify user" });
						});
				} else {
					res.status(404).json({ error: "post already liked" });
				}
			},
			// verification de l'existence du user, verification des likes de celui ci
			function (messageFound, userFound, done) {
				if (userFound) {
					models.Like.findOne({
						where: {
							userId: userId,
							messageId: messageId,
						},
					})
						.then(function (userAlreadyLikedFound) {
							done(null, messageFound, userFound, userAlreadyLikedFound);
						})
						.catch(function (err) {
							return res.status(500).json({ error: "unable to verify is user already liked" });
						});
				} else {
					res.status(404).json({ error: "user not exist" });
				}
			},
			// maj de l'objet userAlreadyLikedFound
			function (messageFound, userFound, userAlreadyLikedFound, done) {
				if (!userAlreadyLikedFound) {
					messageFound
						.addUser(userFound, { isLike: DISLIKED })
						.then(function (alreadyLikeFound) {
							done(null, messageFound, userFound);
						})
						.catch(function (err) {
							return res.status(500).json({ error: "unable to set user reaction" });
						});
				} else {
					if (userAlreadyLikedFound.isLike === LIKED) {
						userAlreadyLikedFound
							.update({
								isLike: DISLIKED,
							})
							.then(function () {
								done(null, messageFound, userFound);
							})
							.catch(function (err) {
								res.status(500).json({ error: "cannot update user reaction" });
							});
					} else {
						res.status(409).json({ error: "message already disliked" });
					}
				}
			},

			// maj du compteur de like
			function (messageFound, userFound, done) {
				messageFound
					.update({
						likes: messageFound.likes - 1,
					})
					.then(function () {
						done(messageFound);
					})
					.catch(function (err) {
						res.status(500).json({ error: "cannot update message like counter" });
					});
			},
		],
		// affiche la propriete like
		function (messageFound) {
			if (messageFound) {
				return res.status(201).json(messageFound);
			} else {
				return res.status(500).json({ error: "cannot update message" });
			}
		},
	);
};
