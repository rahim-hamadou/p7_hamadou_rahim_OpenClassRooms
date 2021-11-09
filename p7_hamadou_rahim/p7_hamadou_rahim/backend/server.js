// creation du server

// Chemin d'accès pour le fichier .env
require("dotenv").config({ path: "./config/.env" });

// MODULES
const http = require("http"); // Import du package http - https requiert un certificat SSL à obtenir avec un nom de domaine
const app = require("./app"); // Import de app pour utilisation de l'application sur le serveur
//FIN MODULES

// FONCTION NORMALIZEPORT
// renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
	// Renvoie un port valide
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
//FIN FONCTION

// DEFINITION DU PORT
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
// FIN DEFINITION

// FONCTION ERRORHANDLER
// recherche les différentes erreurs et les gère de manière appropriée.
const errorHandler = (error) => {
	// Gère les erreurs
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};
// FIN FONCTION

// CREATION SERVEUR

// https requiert un certificat SSL à obtenir avec un nom de domaine
// creation d'une methode createServer pour les requete vers le server
const server = http.createServer(app);

server.on("error", errorHandler); // Gère les erreurs
server.on("listening", () => {
	// Consigne le port ou canal dans la console
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});

// Le serveur écoute le port définit plus haut
//on fait ecouter le server sur le port dedié ou si l'environnement le defini
server.listen(port);
console.log(`Listen on port ${port}`);
// FIN CREATION

// ------------------------------MYSQL-----------------------------------

// importation de mysql
const mysql = require("mysql");
// connecter à votre base MySQL, renseignez l’hôte, l’utilisateur et le mot de passe spécifié lors de l’installation de MySQL
const db = mysql.createConnection({
	host: "localhost",
	user: "p7admin",
	password: "password",
	// database: "groupomania",
});

const con = mysql.createConnection({
	host: "localhost",
	user: "p7admin",
	password: "password",
	database: "groupomania",
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connecté à la base de données MySQL!");
	con.query("show databases;", function (err, result) {
		if (err) throw err;
		console.log(result);
	});
});

// ------------------------------MYSQL-----------------------------------
