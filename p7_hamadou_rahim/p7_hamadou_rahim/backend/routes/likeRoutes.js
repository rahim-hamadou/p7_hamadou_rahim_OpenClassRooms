//----------------------------- Imports

// appel de express
const express = require("express");
// importation du controller likeCtrl
const likeCtrl = require("../controllers/likeCtrl");
// creation du router via la methode express
const router = express.Router();

// ----------------------------Routes

// ajout de :messageID dasn l'url pour le nom du message choisit

// route pour liker un message
router.post("/messages/:messageId/vote/like/", likeCtrl.likePost);

// route pour dislike un message
router.post("/messages/:messageId/vote/dislike/", likeCtrl.dislikePost);

// ----------------------------Export
module.exports = router;
