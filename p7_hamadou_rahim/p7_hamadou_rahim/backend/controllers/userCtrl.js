// ---------------------------------Imports

// chiffrement du password
// npm install --save bcrypt
const bcrypt = require("bcrypt");
// module qui génère le token
// npm install --save jsonwebtoken
const jwtUtils = require("../utils/jwt.utils");
// importation du modele d'element
const models = require("../models");
// importation du module async qui sert a ordonée les fonctions
const asyncLib = require("async");

// --------------------------------REGEX
// via emailregex.com & regexlib.com
const email_regex =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const password_regex = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
const username_regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
// --------------------------------Fonctions

// Creation d'un user
exports.signup = async (req, res) => {
	// params
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const bio = req.body.bio;

	// verification des champs
	if (!email || !username || !password || !bio) {
		return res.status(400).json({ error: "Tous les champs doivent être bien renseignés" });
	}

	// Permet de contrôler la longueur du pseudo
	if (username.length <= 3 || username.length >= 15) {
		return res.status(400).json({ error: "Le pseudo doit contenir 3 à 15 caractères" });
	}

	// Permet de contrôler la validité de l'adresse mail
	if (!email_regex.test(email)) {
		return res.status(400).json({ error: "Adresse mail invalide" });
	}

	// Permet de contrôler la validité du mot de passe
	if (!password_regex.test(password)) {
		return res.status(400).json({
			error: "Le mot de passe doit contenir entre 8 et 20 caractères dont au moins une lettre majuscule, une lettre minusucle, un chiffre et un symbole",
		});
	}

	models.User.findOne({
		attributes: ["username" || "email"],
		where: { username: username, email: email },
	}).then((userExist) => {
		if (!userExist) {
			bcrypt.hash(password, 5, function (err, bcryptedPassword) {
				const newUser = models.User.create({
					username: req.body.username,
					email: req.body.email,
					password: bcryptedPassword,
					bio: req.body.bio,
					isAdmin: 0,
				})
					.then(function (newUser) {
						return res.status(201).json({ message: "Votre compte a bien été créé !", userId: newUser.id });
					})
					.catch(function (err) {
						return res
							.status(500)
							.json({ error: "Une erreur s'est produite lors de la création de votre compte" });
					});
			});
		} else {
			return res.status(404).json({ error: "Cet utilisateur existe déjà" });
		}
	});
};

// Connexion d'un user
exports.login = async (req, res) => {
	// params
	const email = req.body.email;
	const password = req.body.password;

	// verification du remplissage des champs
	if (email == null || password == null) {
		return res.status(400).json({ error: "⚠ Oops, une erreur s'est produite! Veuillez remplir les champs" });
	}
	models.User.findOne({
		where: { email: email },
	})
		.then(function (userFound) {
			if (userFound) {
				bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
					if (resBycrypt) {
						return res.status(200).json({
							userId: userFound.id,
							token: jwtUtils.generateTokenForUser(userFound),
							message: "Bonjour " + userFound.username + " !",
						});
					} else {
						return res.status(403).json({ error: "mot de passe incorrect" });
					}
				});
			} else {
				return res.status(404).json({ error: "utilisateur non trouvé dans la base" });
			}
		})
		.catch(function (err) {
			return res.status(500).json({ error: "impossible de verifier les identifiants" });
		});
};

// Recherche user
exports.getUserProfile = function (req, res) {
	// params
	// verif du token avnat la req base de donnée
	const headerAuth = req.headers["authorization"];
	const userId = jwtUtils.getUserId(headerAuth);

	if (userId < 0) {
		return res.status(400).json({ error: "Mauvais token" });
	}

	models.User.findOne({
		attributes: ["id", "email", "username", "bio", "isAdmin"],
		where: { id: userId },
	})
		.then(function (user) {
			if (user) {
				res.status(201).json(user);
			} else {
				res.status(404).json({
					error: "utilisateur introuvable",
				});
			}
		})
		.catch(function (err) {
			res.status(500).json({ error: "User non chargé" });
		});
};

// Update user via l'utilisation de asyncLib

exports.updateUserProfile = function (req, res) {
	// Getting auth header
	var headerAuth = req.headers["authorization"];
	var userId = jwtUtils.getUserId(headerAuth);

	// Params
	var bio = req.body.bio;

	asyncLib.waterfall(
		[
			function (done) {
				models.User.findOne({
					attributes: ["id", "bio"],
					where: { id: userId },
				})
					.then(function (userFound) {
						done(null, userFound);
					})
					.catch(function (err) {
						return res.status(500).json({ error: "unable to verify user" });
					});
			},
			function (userFound, done) {
				if (userFound) {
					userFound
						.update({
							bio: bio ? bio : userFound.bio,
						})
						.then(function () {
							done(userFound);
						})
						.catch(function (err) {
							res.status(500).json({ error: "cannot update user" });
						});
				} else {
					res.status(404).json({ error: "user not found" });
				}
			},
		],
		function (userFound) {
			if (userFound) {
				return res.status(201).json(userFound);
			} else {
				return res.status(500).json({ error: "cannot update user profile" });
			}
		},
	);
};
