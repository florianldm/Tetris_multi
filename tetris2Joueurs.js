const ttr = require("./tetris.js")

//fonction qui gére l'envoi de malus au joueur adverse
function attaque(val,socket1,tab2,tetromino2,input,socket2)
{
  val = val-1;
  if(val > 0)//si plus d'une ligne à été suprimé
  {
    var alea = [];
    for(var i =0; i<val; i++)//génération des cases n'étant pas remplie
    {
      alea[alea.length] = Math.floor(Math.random() * 10);    
    }
    //remonte le tetromino en haut de la grille
    while(tetromino2.y1 != 0 && tetromino2.y2 != 0 && tetromino2.y3 != 0 && tetromino2.y4 != 0) 
    {
      tetromino2.y1 = tetromino2.y1-1
      tetromino2.y2 = tetromino2.y2-1
      tetromino2.y3 = tetromino2.y3-1
      tetromino2.y4 = tetromino2.y4-1
    }
    //le contenue de la grille est remonté du nombre de ligne de malus
    var contL = 0;
    
    while(contL < alea.length) 
    {
      contL = contL +1
      for(var i=0; i<10; i++)//remonté de toutes les valeurs
      {
        for(var j=0; j<20; j++)
        {  
          if(tab2[i][j+1] != undefined)
          {
              tab2[i][j] = tab2[i][j+1];    
          }
          else
          {
            tab2[i][j] = 0; 
          }
        }
      }
    }
    //ajout des nouvelles lignes
    for(var i=0; i<10; i++)
     {
       for(var j=19; j>19-alea.length; j--)
       {  
         tab2[i][j] = 10;
       }
     }
    var message = ""
    for(var i=0; i<alea.length; i++)
    {
      tab2[alea[i]][19-i] = 0;
      message = message + " " + alea[i] // ajout des "trous"
    }
    
    //envoie de l'ajout des lignes
    
    socket2.emit('attaque',message);
    socket1.emit('attaque2',message);
    socket2.emit('moove',tetromino2.x1+" "+tetromino2.y1+" "+tetromino2.x2+" "+tetromino2.y2+" "+tetromino2.x3+" "+tetromino2.y3+" "+tetromino2.x4+" "+tetromino2.y4+" "+ttr.getColor(tetromino2.type));
    socket1.emit('moove2',tetromino2.x1+" "+tetromino2.y1+" "+tetromino2.x2+" "+tetromino2.y2+" "+tetromino2.x3+" "+tetromino2.y3+" "+tetromino2.x4+" "+tetromino2.y4+" "+ttr.getColor(tetromino2.type));
    
    //vérification de défaite
    return [tetromino2,ttr.emplacementValide(tetromino2,tab2)];
  }
  return [tetromino2,true]
}

//fonction qui permet de gérer le rythme du jeu
function clock(db,pseudo1,pseudo2,socket1,socket2,tab,tab2,tetromino,cont,cont2,input,score,suiv,tetromino2,suiv2,score2)
{
  setTimeout(function(){jeu2Joueur(db,pseudo1,pseudo2,socket1,socket2,tab,tab2,tetromino,cont,cont2,input,suiv,score,tetromino2,suiv2,score2);}, 100)
}

// fonction qui lance le tetris en mode 1 joueur
function jeu2Joueur(db,pseudo1,pseudo2,socket1,socket2,tab,tab2,tetromino,cont,cont2,input,suiv,score,tetromino2,suiv2,score2)
{
  if(input.get(socket1.id) == undefined || input.get(socket2.id) == undefined)//si le socket n'existe plus, le joueur n'est plus connecté et le jeu s'arrète 
    {
      if(input.get(socket1.id) == undefined) socket2.emit('abandonAdverse'); //prévenir que l'adversaire a quitté
      else if(input.get(socket2.id) == undefined) socket1.emit('abandonAdverse');
       return 0; 
    } 
  var diff = (score+score2)/10;
  if(diff>= 10)
  {
    diff = 9;
  }
  
  //action du joueur 1
  if(cont <10-diff)
  {
    //aplication d'un input
    tetromino = ttr.action(socket1,tab,tetromino,input,socket2);
  }
  else//descente du tetromino
  {  
    var res = ttr.down(socket1,tab,tetromino,input,suiv,score,socket2)
    tetromino = res[0];
    var resatt = attaque((res[1]-score),socket1,tab2,tetromino2,input,socket2)
    tetromino2 = resatt[0]
    score = res[1];
    var end = res[2];
    if(end == 1|| resatt[1] == false) //|| resatt[1] == false
    {
      ttr.saveStats(db,pseudo1,score,0)
      ttr.saveStats(db,pseudo2,score2,1)
      return 0;    
    }
    cont = 0;
  }
  
  //action du joueur 2
  if(cont2 <10-diff)
  {
     //aplication d'un input
    tetromino2 = ttr.action(socket2,tab2,tetromino2,input,socket1);
  }
  else//descente du tetromino2
  {  
    var res2 = ttr.down(socket2,tab2,tetromino2,input,suiv2,score2,socket1)
    tetromino2 = res2[0];
    var resatt2 = attaque((res2[1]-score2),socket2,tab,tetromino,input,socket1)
    tetromino = resatt2[0]
    score2 = res2[1];
    var end = res2[2];
    if(end == 1|| resatt2[1] == false) //|| resatt2 == false
    {
      ttr.saveStats(db,pseudo2,score2,0)
      ttr.saveStats(db,pseudo1,score,1)
      return 0;    
    }
    cont2 = 0;
  }

  clock(db,pseudo1,pseudo2,socket1,socket2,tab,tab2,tetromino,cont+1,cont2+1,input,score,suiv,tetromino2,suiv2,score2)//la clock de jeu est relancé
}

//fonction qui initialise le tetris 1  joueur
function TwoPlayer(db,pseudo1,pseudo2,input,SocketPseudo)
{
  var score = 0;
  var score2 = 0;
  //création du tableau
  var tab = new Array()
  var tab2 = new Array()
  for(var i=0; i<10; i++)
  {
    tab[i] = new Array();
    tab2[i] = new Array();
  }
  // remplissage du tableau avec des 0
  for(var i=0; i<10; i++)
  {
   for(var j=0; j<20; j++)
     {
        tab[i][j] = 0;
        tab2[i][j] = 0;
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
  var tetromino2 = 
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
  var suiv2 = 
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
  ttr.initTetromino(tetromino,ttr.randTetromino());
  ttr.initTetromino(suiv,ttr.randTetromino())
  ttr.initTetromino(tetromino2,ttr.randTetromino());
  ttr.initTetromino(suiv2,ttr.randTetromino())
  //démarage du jeu entre deux personne
 setTimeout(function (){start(db,input,SocketPseudo,pseudo1,pseudo2,tab,tab2,tetromino,suiv,tetromino2,suiv2,score,score2)},3000);
}

//fonction qui initialise le jeu entre deux joueurs
function start(db,input,SocketPseudo,pseudo1,pseudo2,tab,tab2,tetromino,suiv,tetromino2,suiv2,score,score2)
{
  input.set(SocketPseudo.get(pseudo1).id,0)
  input.set(SocketPseudo.get(pseudo2).id,0)
  SocketPseudo.get(pseudo2).emit('joueur',pseudo1);
  SocketPseudo.get(pseudo1).emit('joueur',pseudo2);
  SocketPseudo.get(pseudo1).emit('suiv',suiv.x1+" "+suiv.y1+" "+suiv.x2+" "+suiv.y2+" "+suiv.x3+" "+suiv.y3+" "+suiv.x4+" "+suiv.y4);
  SocketPseudo.get(pseudo2).emit('suiv',suiv.x1+" "+suiv.y1+" "+suiv.x2+" "+suiv.y2+" "+suiv.x3+" "+suiv.y3+" "+suiv.x4+" "+suiv.y4);
  SocketPseudo.get(pseudo1).emit('moove',tetromino.x1+" "+tetromino.y1+" "+tetromino.x2+" "+tetromino.y2+" "+tetromino.x3+" "+tetromino.y3+" "+tetromino.x4+" "+tetromino.y4+" "+ttr.getColor(tetromino.type));
  SocketPseudo.get(pseudo2).emit('moove',tetromino2.x1+" "+tetromino2.y1+" "+tetromino2.x2+" "+tetromino2.y2+" "+tetromino2.x3+" "+tetromino2.y3+" "+tetromino2.x4+" "+tetromino2.y4+" "+ttr.getColor(tetromino2.type));
  SocketPseudo.get(pseudo2).emit('moove2',tetromino.x1+" "+tetromino.y1+" "+tetromino.x2+" "+tetromino.y2+" "+tetromino.x3+" "+tetromino.y3+" "+tetromino.x4+" "+tetromino.y4+" "+ttr.getColor(tetromino.type));
  SocketPseudo.get(pseudo1).emit('moove2',tetromino2.x1+" "+tetromino2.y1+" "+tetromino2.x2+" "+tetromino2.y2+" "+tetromino2.x3+" "+tetromino2.y3+" "+tetromino2.x4+" "+tetromino2.y4+" "+ttr.getColor(tetromino2.type));
  clock(db,pseudo1,pseudo2,SocketPseudo.get(pseudo1),SocketPseudo.get(pseudo2),tab,tab2,tetromino,0,0,input,score,suiv,tetromino2,suiv2,score2)
}

//permet la décomposition en plusieurs fichiers  (module)
exports.TwoPlayer = TwoPlayer;