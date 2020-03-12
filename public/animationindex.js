/* Animation des blocs tetris de index.html */  

  //Initialisation formes tetris via DOM
  const piece = document.getElementById("carre");
  const piece2 = document.getElementById("l");
  const piece3 = document.getElementById("t");
  const piece4 = document.getElementById("s");
  
  //Quelques modifications de style
  piece.style.position = "absolute";
  piece2.style.position = "absolute";
  piece3.style.position = "absolute";
  piece4.style.position = "absolute";
  
  piece2.style.marginLeft = "40%";
  piece3.style.marginLeft = "60%";
  piece4.style.marginLeft = "90%";
  
  piece.style.visibility = "hidden";
  piece2.style.visibility = "hidden";
  piece3.style.visibility = "hidden";
  piece4.style.visibility = "hidden";

 //Variables qui gèrent la position des formes
  let topPos, topPos2, topPos3, topPos4;
  topPos = topPos2 = topPos3 = topPos4 = 50;

 //Fonction pour l'animation de la forme carré qui le fait descendre
  function carre(){
   if(topPos < 610){
     if(topPos < 60 || topPos >  595){
       piece.style.visibility = "hidden"; //On cache la forme au tout départ et à la fin
     }
     else piece.style.visibility = " visible"; //sinon on la rend visible
     topPos += 2;  
     piece.style.top = topPos + "px"; //déplacement forme
   }
   else{
     setTimeout(() => {topPos = 50;}, 10000); //reset de la position de la forme
   }
   requestAnimationFrame(carre); //appel récursif pour recommencer
 }
  
 //Fonction pour l'animation de la forme en l qui le fait descendre (même principe que carré)
  function l(){
   if(topPos2 < 610){
     if(topPos2 < 60 || topPos2 >  595){
       piece2.style.visibility = "hidden";
     }
     else piece2.style.visibility = " visible";
     topPos2 += 2;
     piece2.style.top = topPos2 + "px";
   }
   else{
     setTimeout(() => {topPos2 = 50;}, 8000);
   }
   requestAnimationFrame(l);
 }
  
 //Fonction pour l'animation de la forme t qui le fait descendre (même principe que carré)
  function t(){
   if(topPos3 < 610){
     if(topPos3 < 60 || topPos3 >  595){
       piece3.style.visibility = "hidden";
     }
     else piece3.style.visibility = " visible";
     topPos3 += 1;
     piece3.style.top = topPos3 + "px";
   }
   else{
     setTimeout(() => {topPos3 = 50;}, 7000);
   }
   requestAnimationFrame(t);
 }
  
  //Fonction pour l'animation de la forme s qui le fait descendre (même principe que carré)
  function s(){
   if(topPos4 < 610){ 
     if(topPos4 < 60 || topPos4 >  595){
       piece4.style.visibility = "hidden"; 
     }
     else piece4.style.visibility = " visible";
     topPos4 += 2;
     piece4.style.top = topPos4 + "px";
   }
   else{
     setTimeout(() => {topPos4 = 50;}, 6000);
   }
   requestAnimationFrame(s);
 }
  
 //Appels des fonctions (avec un décalage)
 requestAnimationFrame(carre);
 setTimeout(() => {requestAnimationFrame(l);}, 8000);
 setTimeout(() => {requestAnimationFrame(t);}, 6000);
 setTimeout(() => {requestAnimationFrame(s);}, 2000);