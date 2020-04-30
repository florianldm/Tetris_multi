const ttr = require("./tetris.js")

//fonction qui permet de gérer le rythme du jeu
function clock(db,username,socket,tab,tetromino,cont,input,score,suiv)
{
  setTimeout(function(){jeu1Joueur(db,username,socket,tab,tetromino,cont,input,suiv,score);}, 100)
}

// fonction qui lance le tetris en mode 1 joueur
function jeu1Joueur(db,username,socket,tab,tetromino,cont,input,suiv,score)
{
  var diff = score/5;
  if(diff>= 10)
  {
    diff = 9;
  }
  if(cont <10-diff)
  {
  
    if(input.get(socket.id) == undefined)//si le socket n'existe plus, le joueur n'est plus connecté et le jeu s'arrète 
    {
       return 0; 
    }
    //aplication d'un input
    tetromino = ttr.action(socket,tab,tetromino,input);
  }
  else
  {  
    var res = ttr.down(socket,tab,tetromino,input,suiv,score)
    tetromino = res[0];
    score = res[1];
    var end = res[2];
    if(end == 1)
    {
      ttr.saveStats(db,username,score)
      return 0;    
    }
    cont = 0;
  }
  clock(db,username,socket,tab,tetromino,cont+1,input,score,suiv)//la clock de jeu est relancé
}

//fonction qui initialise le tetris 1  joueur
function OnePlayer(socket,input,db,username)
{
  var score = 0;
  //création du tableau
  var tab = new Array()
  for(var i=0; i<10; i++)
  {
    tab[i] = new Array();
  }
  // remplissage du tableau avec des 0
  for(var i=0; i<10; i++)
  {
   for(var j=0; j<20; j++)
     {
        tab[i][j] = 0;
     } 
  } 
  
  // initialisation du tetromino
  var tetromino = 
  {
    x1: 0,
    x2: 0,
    x3: 0,
    x4: 0,
    y1: 0,
    y2: 0,
    y3: 0,
    y4: 0,
    type: null,
    dir: 0
  }
  var suiv = 
  {
    x1: 0,
    x2: 0,
    x3: 0,
    x4: 0,
    y1: 0,
    y2: 0,
    y3: 0,
    y4: 0,
    type: null,
    dir: 0
  }
  //initialisation du nouveau tetromino
  ttr.initTetromino(tetromino,ttr.randTetromino());
  ttr.initTetromino(suiv,ttr.randTetromino())
  //envoi du nouveau tetromino et du tetromino suivant
  socket.emit('suiv',suiv.x1+" "+suiv.y1+" "+suiv.x2+" "+suiv.y2+" "+suiv.x3+" "+suiv.y3+" "+suiv.x4+" "+suiv.y4);
  socket.emit('moove',tetromino.x1+" "+tetromino.y1+" "+tetromino.x2+" "+tetromino.y2+" "+tetromino.x3+" "+tetromino.y3+" "+tetromino.x4+" "+tetromino.y4+" "+ttr.getColor(tetromino.type));
  
  clock(db,username,socket,tab,tetromino,0,input,0,suiv);
}

//permet la décomposition en plusieurs fichiers  (module)
exports.OnePlayer = OnePlayer;