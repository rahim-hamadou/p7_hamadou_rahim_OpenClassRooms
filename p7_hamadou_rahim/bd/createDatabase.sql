SET NAMES utf8;

DROP DATABASE IF EXISTS groupomania;

CREATE DATABASE groupomania CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

create user 'p7adminP' identified with mysql_native_password by 'password';
GRANT ALL
ON groupomania.*
TO 'p7adminP';

FLUSH PRIVILEGES

USE groupomania;

CREATE TABLE User (
	userID SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	email VARCHAR(60) NOT NULL UNIQUE,
	firstName VARCHAR(30) NOT NULL,
	lastName VARCHAR(30) NOT NULL,
	pseudo VARCHAR(30),
	password VARCHAR(100) NOT NULL UNIQUE,
	bio VARCHAR(256),
	avatarUrl VARCHAR(150) NOT NULL DEFAULT 'http://localhost:3000/images/avatar.png',
	dateCreation DATETIME NOT NULL,
	PRIMARY KEY (userID),
)
ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE Post (
	postID MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	userID SMALLINT UNSIGNED,
	legend VARCHAR(180),
	gifUrl VARCHAR(150),
	postIDComment MEDIUMINT UNSIGNED,
	body TEXT,
	dateCreation DATETIME NOT NULL,
	PRIMARY KEY (postID)
)
ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE Reaction (
	userID SMALLINT UNSIGNED NOT NULL,
	postID MEDIUMINT UNSIGNED NOT NULL,
	reaction TINYINT,
	dateCreation DATETIME NOT NULL,
	PRIMARY KEY (userID, postID)
)
ENGINE=INNODB;

ALTER TABLE Post
ADD CONSTRAINT fk_post_userID FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE SET NULL,
ADD CONSTRAINT fk_commentID FOREIGN KEY (postIDComment) REFERENCES Post(postID) ON DELETE CASCADE;

ALTER TABLE Reaction
ADD CONSTRAINT fk_reaction_userID FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
ADD CONSTRAINT fk_postID FOREIGN KEY (postID) REFERENCES Post(postID) ON DELETE CASCADE;
