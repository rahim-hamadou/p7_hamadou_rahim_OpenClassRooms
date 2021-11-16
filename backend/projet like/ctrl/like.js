//Import
let models = require('../models');
let utils = require('../utils/jwtUtils');

exports.like = (req, res) => {
    //Récupérer l'id du message 'liké'
    let postId = req.body.postId;
    //identifier id de l'user qui like le message
    let userId = utils.getUserId(req.headers.authorization);
    console.log('Etape 1 : user a l\'id:', userId)
    //Recherche du message liké dans la BD
    models.Post.findOne(
        {
            where: { id: postId }
        }
    )
        .then(postFound => {
            if (postFound) {
                console.log('Etape 2 : le message liké est:', postFound);
                models.User.findOne({
                    where: { id: userId }
                })
                    .then(userFound => {
                        if (userFound) {
                            console.log('user trouvé', userFound);
                            //recherche si l'user à déjà liké le post
                            models.Like.findOne({
                                where: {
                                    userId: userFound.id,
                                    postId: postFound.id
                                }})
                                    .then(userAlreadyLike => {
                                        if (!userAlreadyLike) {
                                            postFound.addUser(userFound)
                                                .then(() => {
                                                    postFound.update({
                                                        likes: postFound.likes++
                                                    })
                                                        .then(()=>res.end(postFound))
                                                        .catch(err => res.status(500).json({err}))
                                                })
                                                .catch(err => res.status(500).json(err))
                                        } else {
                                            res.status(409).json({ error: 'Post déjà liké' })
                                        }
                                    })
                                    .catch(err => {
                                        console.log('erreur dans la fonction');
                                        res.status(500).json({ error: err })
                                    })
                                 
                        } else {
                            res.status(404).json({ error: 'utilisateur non trouvé' })
                        }
                    })
                    .catch(err => { console.log(err); res.end() })
            } else {
                res.status(404).json({ error: 'Post n\'existe pas' });
            };
        })
        .catch(err => res.status(500).json(err));
};

exports.disLike = (req, res) => {
    //identifier qui dislike le message
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'username'],
        where: { id: id }
    })
        .then(user => res.end())
        .catch(() => res.end())
};