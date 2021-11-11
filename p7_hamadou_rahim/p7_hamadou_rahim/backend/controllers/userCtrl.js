// ---------------------------------Imports

// chiffrement du password
// npm install --save bcrypt
const bcrypt = require("bcrypt");
// module qui génère le token
// npm install --save jsonwebtoken
const jwtUtils = require("../utils/jwt.utils");
// importation du modele d'element
const models = require("../models");

// --------------------------------REGEX

const email_regex =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const password_regex = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
const username_regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
// --------------------------------Fonctions

// creation d'un user

exports.signup = async (req, res) => {
	// params
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const bio = req.body.bio;
	// try {
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
