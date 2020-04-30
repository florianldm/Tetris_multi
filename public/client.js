// Déclaration et initialisation des variables pour ws
const socket = io('wss://' + window.location.host);

var friends = [];
socket.emit('setPseudo',sessionStorage.username);
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
  document.getElementById("JouerMobile").setAttribute("href", "/login");
 
  // Gestion du bouton "Se connecter"
  let connexion = document.getElementById("connexion/deconnexion");
  connexion.setAttribute("href", "/login");
  connexion.innerText = "Se connecter";
  
  connexion = document.getElementById("connexion/deconnexionMobile");
  connexion.setAttribute("href", "/login");
  connexion.innerText = "Se connecter";
  
  // Gestion du bouton "S'inscrire"
  let inscrire = document.createElement("a");
  inscrire.setAttribute("href", "/inscription");
  inscrire.innerText = "S'inscrire";
  document.getElementById("inscrire").appendChild(inscrire);
  
  let inscrireMobile = document.getElementById("inscrireMobile");
  inscrireMobile.setAttribute("href", "/inscription");
  inscrireMobile.innerText = "S'inscrire";
  
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
  document.getElementById("JouerMobile").setAttribute("href", "/jeu");
  // Gestion du bouton "Se déconnecter"
  let deconnexion = document.getElementById("connexion/deconnexion");
  deconnexion.setAttribute("href", "/");
  deconnexion.setAttribute("onclick", "deconnexion()");
  deconnexion.innerText = "Se déconnecter";
  let deconnexionMobile = document.getElementById("connexion/deconnexionMobile");
  deconnexionMobile.setAttribute("href", "/");
  deconnexionMobile.setAttribute("onclick", "deconnexion()");
  deconnexionMobile.innerText = "Se déconnecter";
}


/*********************************************************
PARTIE INSCRIPTION ET ENVOI DES INFORMATIONS PAR WEBSOCKET
*********************************************************/
// //Fonction qui enregistre un membre dans la BD via pseudo et mdp stockés dans data
function registerUser() {
  var pseudo = AnnulerCaract(document.getElementById("pseudo").value);
  var mdp = AnnulerCaract(document.getElementById("mdp").value);
  var mdp2 = AnnulerCaract(document.getElementById("mdp2").value);
  
  if(mdp == mdp2 && pseudo !== "" && mdp !== ""){
    const data = {"type": "inscription",
                  "username": pseudo,
                  "password": mdp}
    socket.emit('gestion', JSON.stringify(data));
  }
  else{
    //alert("Les mots de passe ne correspondent pas !"); 
      var c = document.getElementById("popinscription");
      c.innerHTML = "<h1> Inscription échouée, vérifier les informations. </h1>";
      document.getElementById("popajout").style.top = "30px"; //gestion popup
      setTimeout(function(){
         document.getElementById("popinscription").innerHTML = "";
         document.getElementById("popajout").style.top = "-300px";
      }, 5000);
  }
};


/*******************************************************
PARTIE CONNEXION ET ENVOI DES INFORMATIONS PAR WEBSOCKET
*******************************************************/
//Fonction qui récupère les infos du formulaire de connection
//et envoie une websocket de connexion au serveur.
function connectUser(form) {
  var pseudo = AnnulerCaract(document.getElementById("pseudo").value);
  var mdp = AnnulerCaract(document.getElementById("mdp").value);
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
  document.location.href='/tetris2joueurs';
});

socket.on('check', (e) => {
  const data = {"nom": sessionStorage.username};
  socket.emit('check', JSON.stringify(data));
});

//Gestion des invitations
 socket.on('message', (e) => {
   var inviteur = document.getElementById("inviteur");
   inviteur.innerHTML = e + " vous invite à une partie !";
   sessionStorage.setItem("inviteur", e);
   document.getElementById("popinvite").style.top = "30px"; //affichage du popup
   setTimeout(function(){ //Fermeture du popup d'invitation au bout de 15 secondes
       inviteur.innerHTML = "";
       document.getElementById("popinvite").style.top = "-300px";
   }, 15000);
   
});

//Récupération de la reponse du serveur
 socket.on('log', (e) => {
   let data = JSON.parse(e);
 
  //Partie inscription: redirection vers login si réussie
   if(data.type == "reponse_inscription") {
     if(data.answer == "succes") {
       //alert("Inscription réussi " + data.username);
       document.location.href="/login";
     }
     else {
       var c = document.getElementById("popinscription");
       c.innerHTML = "<h1> Inscription échouée, veuillez réessayer. </h1>";
       document.getElementById("popajout").style.top = "30px"; //gestion popup
       setTimeout(function(){
         document.getElementById("popinscription").innerHTML = "";
         document.getElementById("popajout").style.top = "-300px";
      }, 5000);
       //alert("Inscription échouée. Veuillez rééssayer.");
     }
   }
  
   //Partie connexion
   else if(data.type == "reponse_connexion") {
     if(data.answer == "succes") {
       sessionStorage.setItem("username", data.username);
       //alert("Connexion réussi " + sessionStorage.username);
       document.location.href="/jeu";
     }
     else {
       var c = document.getElementById("popconnexion");
       c.innerHTML = "<h1> Connexion échouée, veuillez réessayer. </h1>";
       document.getElementById("popajout").style.top = "30px"; //gestion popup
       setTimeout(function(){
         document.getElementById("popconnexion").innerHTML = "";
         document.getElementById("popajout").style.top = "-300px";
      }, 5000);
       //alert("Connexion échoué. Veuillez rééssayer.");
     }
   }
   //Partie récupération des statistiques du joueur
   else if(data.type == "reponse_stats") {
     if(data.answer == "succes") {
      sessionStorage.setItem("score", data.score);
      sessionStorage.setItem("victoires", data.victoires);
      sessionStorage.setItem("defaites", data.defaites);
      var arrayLignes = undefined;
      arrayLignes = document.getElementById("tableau_stats");
      for(var index = arrayLignes.lenght; index >= 0; index--){
        arrayLignes.deleteRow([index]);
      }
      /* On remplit un tableau avec score, victoires et défaites + ratio V/D */
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
   //Réponse du server après demande d'ajout d'amis
   else if(data.type == "reponse_ajout_ami") {
    if(data.answer == "succes") { //réussite
      document.getElementById("popajoute").innerHTML = "<h1>Joueur "+ data.friend +" ajouté !</h1>";
      document.getElementById("popajout").style.top = "30px"; //gestion popup
      setTimeout(function(){
        document.getElementById("popajoute").innerHTML = "";
        document.getElementById("popajout").style.top = "-300px";
      }, 5000);
    }
    else { //échec
      document.getElementById("popajoute").innerHTML = "<h1>Erreur lors de l'ajout du joueur.</h1>";
      document.getElementById("popajout").style.top = "30px";
      setTimeout(function(){
        document.getElementById("popajoute").innerHTML = "";
        document.getElementById("popajout").style.top = "-300px";
      }, 5000);
    }
   }
   /* Réponse du server liste d'amis */
   else if(data.type == "reponse_amis") {
    var connect = 0;
    if(data.answer == "succes"){
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
          for(let j in data.liste_amis_connect){ //regarde si l'ami est connecté
            if(item == data.liste_amis_connect[j]){
              connect = 1;
            }
          }
          //Remplissage tableau avec liste d'amis
          var ligne2 = arrayLignes.insertRow(-1);//on a ajouté une ligne
          var colonne0 = ligne2.insertCell(0);
          if(connect == 1) { //affichage vert connecté
            colonne0.innerHTML += "<img style= 'max-width: 8%;height: auto;' src= 'https://cdn.glitch.com/6391b9ee-fdf8-4302-9ee2-5b02d70687ec%2Fco.png?v=1585767856407'>";
          }else { //affichage rouge déconnecté
            colonne0.innerHTML += "<img style= 'max-width: 8%;height: auto;' src= 'https://cdn.glitch.com/6391b9ee-fdf8-4302-9ee2-5b02d70687ec%2Fdeco.png?v=1585767858590'>";
          }
          var colonne1 = ligne2.insertCell(1);//on a une ajouté une cellule
          colonne1.innerHTML += "<h1>" + item + "</h1>";//on y met le contenu de titre
          var colonne2 = ligne2.insertCell(2);
          colonne2.innerHTML += '<input type="button" name="compare" value="?" onclick="compareStats(\'' + item + '\')"/>' //bouton comparaison des stats
        
          if(connect == 1){var invit = ligne2.insertCell(3);
            invit.innerHTML += '<input type="button" name="play" value="Defier" onclick="sendInvite(\'' + item + '\')"/>';} //affichage bouton défier si en ligne
      });
      
      sessionStorage.setItem("amis", friends);
    }else {
    }
     /* Réponse du server pour le classement */
  } else if (data.type == "reponse_classement") {
    var liste = data.liste_user;
    var arrayLignes = undefined;
    arrayLignes = document.getElementById("tableau_classement");
    var arrayLignesMobile = document.getElementById("tableau_classementMobile"); //affichage sur mobile
    if (data.answer == "succes") {
      var position = 1;
      //Tri de la liste en fonction du score total
      liste.sort(function(a, b){
        return b.score - a.score;
      })
      //Parcours et écriture de la liste
      liste.forEach(function(item, index, array) {
        var ligne = arrayLignes.insertRow(-1);//on a ajouté une ligne
        var ligneM = arrayLignesMobile.insertRow(-1);
        var colonne0 = ligne.insertCell(0);
        var colonne0M = ligneM.insertCell(0);
        colonne0.innerHTML += "<h1>#" + position + "<h1>";
        colonne0M.innerHTML += "<h1>#" + position + "<h1>";
        var colonne1 = ligne.insertCell(1);
        var colonne1M = ligneM.insertCell(1);
        colonne1.innerHTML += "<h1>" + item.username + "<h1>";
        colonne1M.innerHTML += "<h1>" + item.username + "<h1>";
        var colonne2 = ligne.insertCell(2);
        var colonne2M = ligneM.insertCell(2);
        if(parseInt(item.score) === 1) {colonne2.innerHTML += "<h1>" + item.score + " pt<h1>"; colonne2M.innerHTML += "<h1>" + item.score + " pt<h1>";}
        else {colonne2.innerHTML += "<h1>" + item.score + " pts<h1>"; colonne2M.innerHTML += "<h1>" + item.score + " pts<h1>";}
        position++;
      });
    } else {
    }
  } else if (data.type == "reponse_compare") { //popup de comparaison des stats
      if(data.answer == "succes"){
         var noms = document.getElementById("noms");
         noms.innerHTML = "<h1>" + data.liste_compare[0].username + " - " + data.liste_compare[1].username + "</h1>";
         var tab = document.getElementById("statscompare");
         tab.innerHTML = "";
         var ligne = tab.insertRow(-1);//on a ajouté une ligne
         var col1 = ligne.insertCell(0);
         col1.innerHTML += "<h1> Score <h1>";
         ligne = tab.insertRow(-1);
         col1 = ligne.insertCell(0);
         col1.innerHTML += "<h1>" + data.liste_compare[0].score + " - " + data.liste_compare[1].score + "<h1>";
         ligne = tab.insertRow(-1);
         col1 = ligne.insertCell(0);
         col1.innerHTML += "<h1> Victoires <h1>";
         ligne = tab.insertRow(-1);
         col1 = ligne.insertCell(0);
         col1.innerHTML += "<h1>" + data.liste_compare[0].victories + " - " + data.liste_compare[1].victories + "<h1>";
         ligne = tab.insertRow(-1);
         col1 = ligne.insertCell(0);
         col1.innerHTML += "<h1> Défaites <h1>";
         ligne = tab.insertRow(-1);
         col1 = ligne.insertCell(0);
         col1.innerHTML += "<h1>" + data.liste_compare[0].defeats + " - " + data.liste_compare[1].defeats + "<h1>";
         document.getElementById("popcompare").style.top = "30px";
         setTimeout(function(){
           noms.innerHTML = "";
           tab.innerHTML = "";
           document.getElementById("popcompare").style.top = "-500px"; //fermeture popup après 20 secondes 
      }, 20000);
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
  sessionStorage.setItem("inviteur", sessionStorage.username);
  const data = {"type": "invite", "username": user, "destinataire": item};
  socket.emit('gestion', JSON.stringify(data));
}

//Fermeture de popup d'invitation lors d'un clic sur "refuser"
function denyInvite() {
  var inviteur = document.getElementById("inviteur");
  inviteur.innerHTML = "";
  document.getElementById("popinvite").style.top = "-300px";
}

function closeCompare() {
  var noms = document.getElementById("noms");
  noms.innerHTML = "";
  var tab = document.getElementById("statscompare");
  tab.innerHTML = "";
  document.getElementById("popcompare").style.top = "-500px";
}

//Acceptation d'une invitation
function acceptInvite() {
  var pseudo = sessionStorage.username;
  var inviteur = sessionStorage.inviteur;
  const data = {"type": "invite_acceptee", "username": pseudo, "inviteur": inviteur}
  socket.emit('gestion', JSON.stringify(data));
  //document.location.href='/tetrisUnJoueur';
}

//Comparer les resultats entre 2 amis
function compareStats(item) {
  var user = sessionStorage.username;
  var ami = item;
  const data = {"type": "compare", "username": user, "ami": ami};
  socket.emit('gestion', JSON.stringify(data));
}


/*************
PROTECTION XSS
*************/
function AnnulerCaract(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

/***********************
VERIFICATION MDP ROBUSTE
***********************/

function verifRobustesse(valeur){
  // initialisation des variables
  var minuscules = new RegExp("[a-z]");
  var majuscules = valeur.toLowerCase();
  var chiffres = new RegExp("[0-9]");
  var caracSpeciaux = new RegExp("[^a-zA-Z0-9]");
  
  
  // s'il y a moins ou 5 caractères dans le mot de passe :
  if(valeur.length <= 5){
    // si on trouve des minuscules mais pas de majuscules
    if(minuscules.test(valeur) && valeur == majuscules){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ftres-faible.png?1558266001443' title='Protection tr&egrave;s faible.' alt='Protection tr&egrave;s faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    // si on trouve des minuscules et des majuscules
    else if(minuscules.test(valeur) && valeur != majuscules){
      // si on trouve aussi des chiffres
      if(chiffres.test(valeur)){
        document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ffaible.png?1558266001890' title='Protection faible.' alt='Protection faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
      }
      else{
        document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ftres-faible.png?1558266001443' title='Protection tr&egrave;s faible.' alt='Protection tr&egrave;s faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
      }
    }
    // si on trouve des minuscules et des chiffres
    else if(minuscules.test(valeur) && chiffres.test(valeur)){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ftres-faible.png?1558266001443' title='Protection tr&egrave;s faible.' alt='Protection tr&egrave;s faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    // si on trouve des minuscules et des caractères spéciaux
    else if(minuscules.test(valeur) && caracSpeciaux.test(valeur)){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ftres-faible.png?1558266001443' title='Protection tr&egrave;s faible.' alt='Protection tr&egrave;s faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    else{
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ftres-faible.png?1558266001443' title='Protection tr&egrave;s faible.' alt='Protection tr&egrave;s faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
  }
  // si le mot de passe fait 6 ou 7 caractères
  else if(valeur.length > 5 && valeur.length < 8){
    if(minuscules.test(valeur) && valeur == majuscules){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ffaible.png?1558266001890' title='Protection faible.' alt='Protection faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    else if(minuscules.test(valeur) && valeur != majuscules){
      if(chiffres.test(valeur)){
        document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Fmoyenne.png?1558266001583' title='Protection moyenne.' alt='Protection moyenne.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
        // si on trouve aussi  des caractères spéciaux
        if(caracSpeciaux.test(valeur)){
          document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Fbonne.png?1558266001355' title='Protection bonne.' alt='Protection bonne.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
        }
      }
      else{
        document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ffaible.png?1558266001890' title='Protection faible.' alt='Protection faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
      }
    }
    else if(minuscules.test(valeur) && chiffres.test(valeur)){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ffaible.png?1558266001890' title='Protection faible.' alt='Protection faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    else if(minuscules.test(valeur) && caracSpeciaux.test(valeur)){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ffaible.png?1558266001890' title='Protection faible.' alt='Protection faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    else{
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ffaible.png?1558266001890' title='Protection faible.' alt='Protection faible.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
  }
  // si le mot de passe fait 8 caractères ou plus
  else if(valeur.length >= 8){
    if(minuscules.test(valeur) && valeur == majuscules){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Fmoyenne.png?1558266001583' title='Protection moyenne.' alt='Protection moyenne.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    else if(minuscules.test(valeur) && valeur != majuscules){
      if(chiffres.test(valeur)){
        document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Ftres-bonne.png?1558266001619' title='Protection tr&egrave;s bonne.' alt='Protection tr&egrave;s bonne.' /><br />Pour une meilleure protection rajoutez des caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)";
        if(caracSpeciaux.test(valeur)){
          document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Fexcellente.png?1558266001557' title='Protection excellente.' alt='Protection excellente.' /><br />Si vous souhaitez avoir une protection encore meilleure :<ul><li>alternez les types de caract&egrave;res le plus souvent possible</li><li>n'h&eacute;sitez pas &agrave; en mettre beaucoup pour emp&ecirc;cher le brut force le plus possible.</li></ul>";
        }
      }
      else{
        document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Fbonne.png?1558266001355' title='Protection bonne.' alt='Protection bonne.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
      }
    }
    else if(minuscules.test(valeur) && chiffres.test(valeur)){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Fmoyenne.png?1558266001583' title='Protection moyenne.' alt='Protection moyenne.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    else if(minuscules.test(valeur) && caracSpeciaux.test(valeur)){
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Fmoyenne.png?1558266001583' title='Protection moyenne.' alt='Protection moyenne.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
    else{
      document.getElementById('verif').innerHTML = "<br /><img src='https://cdn.glitch.com/81209edd-533d-4abc-8a4c-ac8fcf84a69a%2Fmoyenne.png?1558266001583' title='Protection moyenne.' alt='Protection moyenne.' /><br />Pour une meilleure protection suivez au mieux ces conseils : <ul><li>au moins 8 caract&egrave;res.</li><li>Mettez des majuscules</li><li>des minuscules</li><li>des chiffres</li><li>caract&egrave;res sp&eacute;ciaux (par ex. : <>!:*)</li></ul>";
    }
  }
}