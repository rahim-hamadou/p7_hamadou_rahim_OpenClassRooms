//----------------------------- Imports

const models = require("../models");
const asyncLib = require("async");
const jwtUtils = require("../utils/jwt.utils")

// --------------------------------Fonctions

// -------------------------------Constantes
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;

// Creation d'un message
exports.createMessage = function (req, res) {


	// verif du token avnat la req base de donnée
	const headerAuth = req.headers["authorization"];
	const userId = jwtUtils.getUserId(headerAuth);

     // params
    let titre = req.body.title;
let content = req.body.content;

if(title==null || content ==null){
    return res.status(400).json({error:"parametres manquants"});
}

if(title.length<=TITLE_LIMIT || content.length<=CONTENT_LIMIT){
    return res.status(400).json({error:"parametres incorrects"});
}
asyncLib.waterfall([
    function(done) {
      models.User.findOne({
        where: { id: userId }
      })
      .then(function(userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },
    function(userFound, done) {
      if(userFound) {
        models.Message.create({
          title  : title,
          content: content,
          likes  : 0,
          UserId : userFound.id
        })
        .then(function(newMessage) {
          done(newMessage);
        });
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    },
  ], function(newMessage) {
    if (newMessage) {
      return res.status(201).json(newMessage);
    } else {
      return res.status(500).json({ 'error': 'cannot post message' });
    }
  });
},


// Afficher les message

exports.listMessage =  async (req, res) {
    
}