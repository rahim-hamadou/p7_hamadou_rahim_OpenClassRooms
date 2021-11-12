// MODULES

// creation de notre app qui appelle la methode express
const express = require("express");

const app = express();

const bodyParser = require("body-parser");

// appel de path qui donne acces au chemin de fichier
// Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const path = require("path");

// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
// il sécurise nos requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// et ajoute une protection XSS mineure et protège contre le reniflement de TYPE MIME
// cross-site scripting, sniffing et clickjacking
// ce pluggin colmate les faille de securité courante
const helmet = require("helmet");
//pluggin pour  la mise en cache du navigateur
const nocache = require("nocache");

const expressSanitizer = require("express-sanitizer");

// FIN MODULES

// --------------------------------------IMPORTATION ROUTES

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

// FIN IMPORTATIONS

// PARAMETRAGE DES HEADERS
// creation  d'une exception CORS pour autoriser la lecture de la reponse par le client
app.use((req, res, next) => {
	// Evite les erreurs CORS
	// on indique que les ressources peuvent être partagées depuis n'importe quelle origine
	res.setHeader("Access-Control-Allow-Origin", "*");
	// on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
	);
	// on indique les méthodes autorisées pour les requêtes HTTP
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// HELMET
app.use(helmet()); // Protège l'app en paramétrant des Headers (notamment contre les failles XSS)
// FIN HELMET

// FIN PARAMETRAGE

// BODYPARSER
// appel de la methode body parser pour rendre exploitable toutes les requetes en object js utilisable json
// Transforme le corps de la requête en objet JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// FIN BODYPARSER

// Sécuriser Express en définissant divers en-têtes HTTP - https://www.npmjs.com/package/helmet#how-it-works
// On utilise helmet pour plusieurs raisons notamment la mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs web
app.use(helmet());

//Désactive la mise en cache du navigateur
app.use(nocache());

// Protège contre les failles XSS
app.use(expressSanitizer());

// -----------------------------------------ROUTES

// // permet via express de choisir le dossier source des images via la methode path
// app.use("/images", express.static(path.join(__dirname, "images")));
// Va servir les routes dédiées aux utilisateurs
app.use("/", userRoutes);

// Va servir les routes dédiées aux messages
app.use("/", messageRoutes);

// // Va servir les routes dédiées aux posts
// app.use("/api/post", postRoutes);

// FIN ROUTES

// TEST APP

// app.post("/api/stuff", (req, res, next) => {
// 	console.log(req.body);
// 	res.status(201).json({
// 		message: "Objet créé !",
// 	});
// });

// app.use((req, res, next) => {
// 	console.log("Requête reçue !");
// 	next();
// });

// app.use((req, res, next) => {
// 	res.status(201);
// 	next();
// });

// app.use((req, res, next) => {
// 	res.json({ message: "Votre requête a bien été reçue !!!" });
// 	next();
// });

// app.use((req, res, next) => {
// 	console.log("Réponse envoyée avec succès !");
// });

// FIN TEST APP

// Export de l'application express pour déclaration dans server.js
module.exports = app;
