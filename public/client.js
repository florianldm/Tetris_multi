// Déclaration et initialisation des variables pour ws
//const ws = new WebSocket('wss://' + window.location.host);
const socket = io('wss://' + window.location.host);
var friends = [];
socket.emit('setPseudo',sessionStorage.username);
console.log("set")
/********************************
GESTIONS DES BOUTONS DU MENU
********************************/
// Si l'utilisateur n'est pas connecté :
if(typeof sessionStorage.username == "undefined") {
  // Gestion des du bouton central "JOUER" de index.html
  if(document.location == "https://projet-tetris-master.glitch.me/") {
    document.getElementById("JOUER").setAttribute("href", "/login");
  }
  //Redirection vers page d'accueil
  if(document.location == "https://projet-tetris-master.glitch.me/jeu") {
    document.location.href="https://projet-tetris-master.glitch.me/"; 
  }
  // Gestion du bouton "Jouer"
  document.getElementById("Jouer").setAttribute("href", "/login");
 
  // Gestion du bouton "Se connecter"
  let connexion = document.getElementById("connexion/deconnexion");
  connexion.setAttribute("href", "/login");
  connexion.innerText = "Se connecter";
  // Gestion du bouton "S'inscrire"
  let inscrire = document.createElement("a");
  inscrire.setAttribute("href", "/inscription");
  inscrire.innerText = "S'inscrire";
  document.getElementById("inscrire").appendChild(inscrire);
  
}
// Sinon (si l'utilisateur est connecté) :
else {
  // Gestion du bouton central "JOUER" de index.html
  if(document.location == "https://projet-tetris-master.glitch.me/") {
    document.getElementById("JOUER").setAttribute("href", "/jeu");
  }
  if(document.location == "https://projet-tetris-master.glitch.me/jeu") {
    document.getElementById("solo").setAttribute("href", "/tetrisUnJoueur");
  }
  
  //Gestion du bouton "Jouer"
  document.getElementById("Jouer").setAttribute("href", "/jeu");
  // Gestion du bouton "Se déconnecter"
  let deconnexion = document.getElementById("connexion/deconnexion");
  deconnexion.setAttribute("href", "/");
  deconnexion.setAttribute("onclick", "deconnexion()");
  deconnexion.innerText = "Se déconnecter";
}


/*********************************************************
PARTIE INSCRIPTION ET ENVOI DES INFORMATIONS PAR WEBSOCKET
*********************************************************/
// //Fonction qui enregistre un membre dans la BD via pseudo et mdp stockés dans data
function registerUser() {
  var pseudo = document.getElementById("pseudo").value;
  var mdp = document.getElementById("mdp").value;
  var mdp2 = document.getElementById("mdp2").value;
  
  if(mdp == mdp2){
    const data = {"type": "inscription",
                  "username": pseudo,
                  "password": mdp}
    socket.emit('gestion', JSON.stringify(data));
  }
  else alert("Les mots de passe ne correspondent pas !");  
};


/*******************************************************
PARTIE CONNEXION ET ENVOI DES INFORMATIONS PAR WEBSOCKET
*******************************************************/
//Fonction qui récupère les infos du formulaire de connection
//et envoie une websocket de connexion au serveur.
function connectUser(form) {
  var pseudo = document.getElementById("pseudo").value;
  var mdp = document.getElementById("mdp").value;
  const data = {"type" : "connexion",
                "username": pseudo,
                "password": mdp}
  socket.emit('gestion',JSON.stringify(data)); 
}

/*********************************************************
PARTIE DECONNEXION ET ENVOI DES INFORMATIONS PAR WEBSOCKET
*********************************************************/
// Fonction qui supprime l'utilisateur de la variable sessionStorage
// et envoie une websocket de deconnexion au serveur.
function deconnexion() {
  let data = {"type": "deconnexion",
              "username": sessionStorage.username};
  socket.emit('gestion',JSON.stringify(data));
  sessionStorage.removeItem("username");
}

/*******************************************
GESTION DE L'ECOUTE DES EVENEMENTS WEBSOCKET
*******************************************/

//Serveur envoie que la partie 1v1 est prete et client demande la page.
socket.on('partieok', (e) => {
  console.log("MESG RECU");
  document.location.href='/tetris2joueurs';
});

//Gestion des invitations
 socket.on('message', (e) => {
   var inviteur = document.getElementById("inviteur");
   inviteur.innerHTML = e + " vous invite à une partie !";
   sessionStorage.setItem("inviteur", e);
   document.getElementById("popinvite").style.top = "30px";
   setTimeout(function(){
       inviteur.innerHTML = "";
       document.getElementById("popinvite").style.top = "-300px";
   }, 15000);
   
});

//Récupération de la reponse du serveur pour l'inscription et la connexion
 socket.on('log', (e) => {
   let data = JSON.parse(e);
   console.log(data);
 
  //Partie inscription
   if(data.type == "reponse_inscription") {
     if(data.answer == "succes") {
       alert("Inscription réussi " + data.username);
       document.location.href="/login";
     }
     else {
       alert("Inscription échouée. Veuillez rééssayer.");
     }
   }
  
   // Partie connexion
   else if(data.type == "reponse_connexion") {
     if(data.answer == "succes") {
       sessionStorage.setItem("username", data.username);
       alert("Connexion réussi " + sessionStorage.username);
       document.location.href="/jeu";
     }
     else {
       alert("Connexion échoué. Veuillez rééssayer.");
     }
   }
   else if(data.type == "reponse_stats") {
     if(data.answer == "succes") {
      console.log(data.score);
      console.log(data.victoires);
      console.log(data.defaites);
      sessionStorage.setItem("score", data.score);
      sessionStorage.setItem("victoires", data.victoires);
      sessionStorage.setItem("defaites", data.defaites);
      var arrayLignes = undefined;
      arrayLignes = document.getElementById("tableau_stats");
      for(var index = arrayLignes.lenght; index >= 0; index--){
        arrayLignes.deleteRow([index]);
      }
      var score = arrayLignes.insertRow(-1);//on a ajouté une ligne pour le score
      var colonnescore = score.insertCell(0);
      colonnescore.innerHTML += "<h1>Score: " + data.score + "</h1>";
     // score = arrayLignes.insertRow(-1);//on a ajouté une ligne pour les victoires
      var colonnevictoires = score.insertCell(1);
      colonnevictoires.innerHTML += "<h1>Victoires: "+ data.victoires + "</h1>";
     // score = arrayLignes.insertRow(-1);//on a ajouté une ligne pour les défaites
      var colonnedefaites = score.insertCell(2);
      colonnedefaites.innerHTML += "<h1>Defaites: "+ data.defaites + "</h1>";
      var ratio_vd = (Math.round((parseFloat(data.victoires) / parseFloat(data.defaites)) * 100)) / 100; // calcul ratio victoires/defaites avec arrondi à 2 chiffres après virgule.
      //score = arrayLignes.insertRow(-1);//on a ajouté une ligne pour les défaites
      var colonneratio = score.insertCell(3);
      if(data.defaites != 0){ 
        colonneratio.innerHTML += "<h1>Ratio V/D: "+ ratio_vd + "</h1>";
      } //Si aucune défaite, on affiche le nombre de victoires.
      else colonneratio.innerHTML += "<h1>Ratio V/D: "+ data.victoires + "</h1>";
      
    }
    else alert ("Erreur lecture stats.");
   }
   else if(data.type == "reponse_ajout_ami") {
    if(data.answer == "succes") {
      document.getElementById("popajoute").innerHTML = "<h1>Joueur "+ data.friend +" ajouté !</h1>";
      document.getElementById("popajout").style.top = "30px";
      setTimeout(function(){
        document.getElementById("popajoute").innerHTML = "";
        document.getElementById("popajout").style.top = "-300px";
      }, 5000);
    }
    else {
      document.getElementById("popajoute").innerHTML = "<h1>Erreur lors de l'ajout du joueur.</h1>";
      document.getElementById("popajout").style.top = "30px";
      setTimeout(function(){
        document.getElementById("popajoute").innerHTML = "";
        document.getElementById("popajout").style.top = "-300px";
      }, 5000);
    }
   }
   else if(data.type == "reponse_amis") {
    var connect = 0;
    if(data.answer == "succes"){
      console.log("Amis récupérés");
      if(friends.length == 0){ //Empeche de recopier plusieurs fois la liste
        data.liste_amis.forEach(element => friends.push(element));
      }
    
      document.getElementById("tableau_amis").innerHTML = "";
      var arrayLignes = undefined;
      arrayLignes = document.getElementById("tableau_amis");
       for(var index = arrayLignes.lenght; index >= 0; index--){
        arrayLignes.deleteRow([index]);
       }
      
      friends.forEach(function(item, index, array) {
          connect = 0; 
          for(let j in data.liste_amis_connect){
            if(item == data.liste_amis_connect[j]){
              connect = 1;
            }
          }
          var ligne2 = arrayLignes.insertRow(-1);//on a ajouté une ligne
          var colonne0 = ligne2.insertCell(0);
          if(connect == 1) {
            colonne0.innerHTML += "<img style= 'max-width: 8%;height: auto;' src= 'https://cdn.glitch.com/6391b9ee-fdf8-4302-9ee2-5b02d70687ec%2Fco.png?v=1585767856407'>";
          }else {
            colonne0.innerHTML += "<img style= 'max-width: 8%;height: auto;' src= 'https://cdn.glitch.com/6391b9ee-fdf8-4302-9ee2-5b02d70687ec%2Fdeco.png?v=1585767858590'>";
          }
          var colonne1 = ligne2.insertCell(1);//on a une ajouté une cellule
          colonne1.innerHTML += "<h1>" + item + "</h1>";//on y met le contenu de titre
          if(connect == 1){var invit = ligne2.insertCell(2);
            invit.innerHTML += '<input type="button" name="play" value="Defier" onclick="sendInvite(\'' + item + '\')"/>';}
      });
      
      sessionStorage.setItem("amis", friends);
    }else {
      console.log("Echec récupération amis");
    }
  } else if (data.type == "reponse_classement") {
    var liste = data.liste_user;
    var arrayLignes = undefined;
    arrayLignes = document.getElementById("tableau_classement");
    if (data.answer == "succes") {
      var position = 1;
      //Tri de la liste en fonction du score total
      liste.sort(function(a, b){
        return b.score-a.score;
      })
      //Parcours et écriture de la liste
      liste.forEach(function(item, index, array) {
        console.log(item.username + " " + item.score);
        var ligne = arrayLignes.insertRow(-1);//on a ajouté une ligne
        var colonne0 = ligne.insertCell(0);
        colonne0.innerHTML += "<h1>#" + position + "<h1>";
        var colonne1 = ligne.insertCell(1);
        colonne1.innerHTML += "<h1>" + item.username + "<h1>";
        var colonne2 = ligne.insertCell(2);
        if(parseInt(item.score) === 1) colonne2.innerHTML += "<h1>" + item.score + " pt<h1>";
        else colonne2.innerHTML += "<h1>" + item.score + " pts<h1>";
        position++;
      });
    } else {
      console.log("Echec récupération classement");
    }
  }
   
 });

/** Requête des stats pour la page de profil. */
function getStats() {
  var pseudo = sessionStorage.username;
  const data = {"type": "stats", "username": pseudo};
  socket.emit('gestion',JSON.stringify(data));
}

//Utilisée lors du chargement de la page (attente de connexion serveur)
function getStatsONOPEN() {
  console.log("Recup stats");
  var pseudo = sessionStorage.username;
  const data = {"type": "stats", "username": pseudo};
  //socket.onopen = () => socket.emit('gestion', JSON.stringify(data)); inutile avec socket.io
  socket.emit('gestion', JSON.stringify(data));
}

//onpageshow="getFriends(); getStats()
/** Requête des joueurs amis pour la page de profil. */
function getFriends() {
  var pseudo = sessionStorage.username;
  const data = {"type": "liste_joueurs", "username": pseudo};
  socket.emit('gestion',JSON.stringify(data)); //ws.onopen permet d'attendre que la connexion soit établie pour envoyer le message (utile pour le chargement des amis dès le chargement de la page)
}

//Utilisée lors du chargement de la page (attente de connexion serveur)
function getFriendsONOPEN() {
  setTimeout(function(){ //Attente d'une seconde pour que le message pour obtenir les stats arrive avant au serveur et pas les 2 en même temps.
      var pseudo = sessionStorage.username;
      const data = {"type": "liste_joueurs", "username": pseudo};
      socket.emit('gestion', JSON.stringify(data)); //ws.onopen permet d'attendre que la connexion soit établie pour envoyer le message (utile pour le chargement des amis dès le chargement de la page)
    }, 200);
}

//Utilisée pour demander le classement.
function getRankONOPEN() {
  setTimeout(function(){ 
      var pseudo = sessionStorage.username;
      const data = {"type": "classement", "username": pseudo};
      socket.emit('gestion', JSON.stringify(data)); 
    }, 300);
}

/** Requête pour ajout d'un ami dans BD. */
function addFriend() {
  var user = sessionStorage.username;
  var friend = document.getElementById("ami").value;
  const data = {"type": "ami", "username": user, "friend": friend};
  socket.emit('gestion', JSON.stringify(data));
};

//Envoi d'une invitation
function sendInvite(item) {
  var user = sessionStorage.username;
  console.log("INVITATION DE " + item);
  const data = {"type": "invite", "username": user, "destinataire": item};
  socket.emit('gestion', JSON.stringify(data));
}

//Fermeture de popup d'invitation lors d'un clic sur "refuser"
function denyInvite() {
  var inviteur = document.getElementById("inviteur");
  inviteur.innerHTML = "";
  document.getElementById("popinvite").style.top = "-300px";
}

//Acceptation d'une invitation
function acceptInvite() {
  var pseudo = sessionStorage.username;
  var inviteur = sessionStorage.inviteur;
  const data = {"type": "invite_acceptee", "username": pseudo, "inviteur": inviteur}
  socket.emit('gestion', JSON.stringify(data));
  //document.location.href='/tetrisUnJoueur';
}
