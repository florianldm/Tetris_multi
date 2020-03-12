  const piece = document.getElementById("carre");
  const piece2 = document.getElementById("l");
  const piece3 = document.getElementById("t");
  const piece4 = document.getElementById("s");
  
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

 
  
  
  let topPos, topPos2, topPos3, topPos4;
  topPos = topPos2 = topPos3 = topPos4 = 50;

  function carre(){
   if(topPos < 610){
     if(topPos < 60 || topPos >  595){
       piece.style.visibility = "hidden";
     }
     else piece.style.visibility = " visible";
     topPos += 2;
     piece.style.top = topPos + "px";
   }
   else{
     setTimeout(() => {topPos = 50;}, 10000);
   }
   requestAnimationFrame(carre);
 }
  
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
  
  
 requestAnimationFrame(carre);
 setTimeout(() => {requestAnimationFrame(l);}, 8000);
 setTimeout(() => {requestAnimationFrame(t);}, 6000);
 setTimeout(() => {requestAnimationFrame(s);}, 2000);