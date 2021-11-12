//----------------------------- Imports

// appel de express
const express = require("express");
// importation du controller
const messageCtrl = require("../controllers/messageCtrl");
// creation du router via la methode express
const router = express.Router();
// ----------------------------Routes

// poster un nouveau message
router.post("/messages/new", messageCtrl.createMessage);

// lister les messages
router.get("/messages/", messageCtrl.listMessages);
// ----------------------------Export
module.exports = router;
