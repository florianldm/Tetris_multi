# Projet-tetris

Nous avons réalisé ce projet dans le cadre de l'UE AWS (Applcation Web et Securité) du M1 Informatique de Paris Saclay.
Le but de cette UE etant de d'apprendre les bases de la programmation web moderne et de nous enseigner les bonnes pratiques qui permettent de concevoir des applications web mieux sécurisé.
Afin d'apprendre les bases de cette programation, nous avons décider de réaliser un tetris avec un mode multijoueur.

## Utilisation 

Afin de pouvoir jouer à notre tetris, il vous suffit d'aller sur le site : https://projet-tetris-master.glitch.me/
Ce site nous conduit vers la page d'accueil du jeu qui vous permet de manière plutôt intuitive de:
- s'inscrire
- se connecter 
- jouer : (nous renvoie sur une page permettant d'ajouter des amis, jouer seul, affronter des amis connecté, voir vos score et statistiques)

Pour bouger les différents tétromino il suffit d'utiliser les fleches de votre clavier:
- DROITE et GAUCHE pour la direction
- BAS pour descendre plus rapidement le tétromino 
- HAUT pour effectuer une rotation
Pour utiliser le mode deux joueur il suffit de défier un joueur connecté et qu'il reponde à votre demande.

Sur chaque mode il est possible d'abandonner la partie en cliquant sur abandonner.

## Deroulement du jeu

Mode 1 joueur:

Dans ce mode de jeu on peut voir:
- les informations sur notre joueur 
- la grille de jeu 
- le tetromino suivant 

Mode 2 joueurs: 

Dans ce mode de jeu, on peut voir:
- les informations sur notre joueur 
- le nom ainsi que le score de la partie en cours de l'adversaire
- le tétromino suivant
- la grille des 2 joueurs

Dans ce mode de jeu, la suppression d'une ligne donne un désaventage à l'adversaire en remplissant une ligne de sa grille.

## Outils utilisés

- La plateforme Glitch (https://glitch.com/)
- Les bibliothèques Node.js, Socket.io, SQLite, Bcrypt et Express
- Un script provient https://gitter.im/nodejs/node?at=5d1e7586c5f3c329aee5b468 envoyé par @mustafaskyer


## Auteurs

- Culerier Tanguy
- Ledemé Florian
- Bazin Sarah
- Destribois Jean
- Atmani Hajar

