//----------------------------- Imports

// appel de express
const express = require("express");
// importation du controller
const userCtrl = require("../controllers/userCtrl");
// creation du router via la methode express
const router = express.Router();

// ----------------------------Routes

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// ----------------------------Export

module.exports = router;
