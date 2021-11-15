// Imports
var models = require("../models");
var jwtUtils = require("../utils/jwt.utils");
var asyncLib = require("async");

// Constants
const DISLIKED = 0;
const LIKED = 1;

// Routes

exports.likePost = function (req, res) {
	// Getting auth header
	var headerAuth = req.headers["authorization"];
	var userId = jwtUtils.getUserId(headerAuth);

	// Params
	// recuperation de l'id du message
	var messageId = parseInt(req.params.messageId);
	// si id n'existe pas, message d'erreur
	if (messageId <= 0) {
		return res.status(400).json({ error: "invalid parameters" });
	}
	// mise en place du waterfall ( chaien de fonction pour instruction global)
	asyncLib.waterfall(
		[
			// verification de l'existence du message par l'id saisi dans la route
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
			// verification de l'existence du message
			function (messageFound, done) {
				if (messageFound) {
					models.User.findOne({
						where: { id: userId },
					})
						// recuperation de l'user dans la variable userFound
						.then(function (userFound) {
							done(null, messageFound, userFound);
						})
						.catch(function (err) {
							return res.status(500).json({ error: "unable to verify user" });
						});
				} else {
					res.status(404).json({ error: "Message unfound" });
				}
			},
			// verification de l'existence de l'user dans la base de donnee
			function (messageFound, userFound, done) {
				if (userFound) {
					// si user existe on verifie si il n'a pas deja liké
					models.Like.findOne({
						where: {
							userId: userId,
							messageId: messageId,
						},
					})
						// si c'est le cas , on l'ajoute a la variable userAlreadyLikedFound
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
			// on verifie encore si user n'est pas dans le userAlreadyLikedFound
			function (messageFound, userFound, userAlreadyLikedFound, done) {
				if (!userAlreadyLikedFound) {
					// on lie le message et l'user a ce like
					messageFound
						.addUser(userFound, { isLike: LIKED })
						.then(function (alreadyLikeFound) {
							done(null, messageFound, userFound);
						})
						.catch(function (err) {
							return res.status(500).json({ error: "Message already liked" });
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
			// Maj du message avec une incrementation de like
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
		function (messageFound) {
			if (messageFound) {
				return res.status(201).json(messageFound);
			} else {
				return res.status(500).json({ error: "cannot update message" });
			}
		},
	);
};

exports.dislikePost = function (req, res) {
	// Getting auth header
	var headerAuth = req.headers["authorization"];
	var userId = jwtUtils.getUserId(headerAuth);

	// Params
	var messageId = parseInt(req.params.messageId);

	if (messageId <= 0) {
		return res.status(400).json({ error: "invalid parameters" });
	}
	// mise en place du waterfall ( chaien de fonction pour instruction global)
	asyncLib.waterfall(
		[
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
					res.status(404).json({ error: "post already disliked" });
				}
			},
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
			// ici on decremente les likes
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
		function (messageFound) {
			if (messageFound) {
				return res.status(201).json(messageFound);
			} else {
				return res.status(500).json({ error: "cannot update message" });
			}
		},
	);
};
