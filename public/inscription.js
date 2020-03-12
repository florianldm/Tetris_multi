//Fonction de test qui affiche infos du formulaire d'inscription
function afficher(form) {
  var pseudo = document.getElementById("pseudo").value;
  var mdp = document.getElementById("mdp").value;
  var mdp2 = document.getElementById("mdp2").value;
  
  if(mdp == mdp2){
    alert("Votre pseudo est "+ pseudo + " et votre mdp est: "+mdp );
  }
  else alert("Les mdp ne correspondent pas !");
}

//Fonction qui enregistre un membre dans la BD via pseudo et mdp
function registerMember(pseudo, mdp){
   //Instrus pour ajouter membre à la BD
}


//Fonction qui récupère les infos du formulaire d'inscription
function getRegisterInfos(form){
  var pseudo = document.getElementById("pseudo").value;
  var mdp = document.getElementById("mdp").value;
  var mdp2 = document.getElementById("mdp2").value;
  
  if(mdp == mdp2){
    registerMember(pseudo, mdp);
  }
  else alert("Les mots de passe ne correspondent pas !");
}