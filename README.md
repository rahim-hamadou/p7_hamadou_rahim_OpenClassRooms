** Groupomania **

Projet 7 du parcours Développeur web d'OpenClassrooms

Prérequis

Vous devez avoir Node et npm installés localement sur votre machine (avec le plug-in node-sass), ainsi que MySQL.

Pour installer ce projet veuillez vous procurer :

```
Installer Node.js
Lancer MySQL
Vue.js
```

** Installation **

-   Clonez ce repository.

-   Configure `config/config.json`

-   Lancer la cmd dans le terminal `sequelize db:create && sequelize db:migrate`

-   Import sauvegarde.sql

-   Pour démarrer le serveur, placez-vous dans le dossier backend du projet puis exécutez la commande : `npm install & enfin nodemon server`

-   Ensuite, depuis le dossier frontend du projet, utilisez la commande :`npm run serve`. Rendez-vous ensuite à l'adresse http://localhost:8080/ ou le port dedié

** Creation d'un compte de moderation: **

Il faudra penser a creer un compte Admin , qui aura la possibilité de moderé les posts.

-   Creation d'un compte via le site de l'applications

-   Verifification de son id dans la table Users: SELECT \* from Users;

-   Mise a jour de la valeur de isAdmin : UPDATE Users SET isAdmin = '1' WHERE id = "id_du_compte";

Apres cela le compte pourra modérer , une fois connecté.

** MySQL **

-   Voir les databases

"SHOW DATABASES;"

-   Voir les tables

"SHOW tables;"

-   Voir les Users

"SELECT \* from Users;"

-   Suppression de users depuis mysql:

"SELECT \* from Users;"
"DELETE FROM `Users` WHERE id = "id_du_compte";"

-   Presentation:
    le compte admin pour ma presentation est :
    id: admin
    mdp:Admin123!

les comptes users existants :

-   username : test@gmail.com
    password:test
-   username : test123
    password: Test123!
-   username : test1
    password: Test123!
