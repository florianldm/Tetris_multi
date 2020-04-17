//fonction qui affecte les coordonées du tetromino dans le tableau 
function setTetromino(tetromino,x1,x2,x3,x4,y1,y2,y3,y4)
{
  tetromino.x1 = x1;
  tetromino.y1 = y1;
  tetromino.x2 = x2;
  tetromino.y2 = y2;
  tetromino.x3 = x3;
  tetromino.y3 = y3;
  tetromino.x4 = x4;
  tetromino.y4 = y4
}

function getColor(type)
{
  if(type == 'I') return "cyan";
  else if(type == 'O') return "yellow";
  else if(type == 'T') return "purple";
  else if(type == 'L') return "orange";
  else if(type == 'J') return "Blue";
  else if(type == 'Z') return "red";
  else return "green";
}

// initialisation d'un tetromino en fonction de son type
function initTetromino(tetromino,type)
{
  if(type == "O")
  {
    setTetromino(tetromino,0,0,1,1,0,1,0,1);
    tetromino.type = 'O'
  }
  else if(type == "I")
  {
    setTetromino(tetromino,0,1,2,3,0,0,0,0);
    tetromino.type = 'I'
  }
  else if(type == "T")
  {
    setTetromino(tetromino,0,1,2,1,0,0,0,1);
    tetromino.type = 'T'
  }
  else if(type == "L")
  {
    setTetromino(tetromino,0,1,2,0,0,0,0,1);
    tetromino.type = 'L'
  }
  else if(type == "J")
  {
    setTetromino(tetromino,0,1,2,2,0,0,0,1);
    tetromino.type = 'J'
  }
  else if(type == "Z")
  {
    setTetromino(tetromino,0,1,1,2,0,0,1,1);
    tetromino.type = 'Z'
  }
  else if(type == "S")
  {
    setTetromino(tetromino,2,1,1,0,0,0,1,1);
    tetromino.type = 'S'
  }
  tetromino.dir = 0;
  return tetromino;
}

// fonction qui test si il est posible de placer un tetromino sur la grille
function emplacementValide(tetromino,tab)
{
  if(tetromino.x1 < 0 || tetromino.x2 < 0 || tetromino.x3 < 0 || tetromino.x4 < 0)//sortie du tableau par la gauche 
  {
    return false;
  }
  else if(tetromino.x1 >=10 || tetromino.x2 >=10 || tetromino.x3 >=10 || tetromino.x4 >=10)//sortie du tableau par la droite
  {
    return false;
  }
  else if(tetromino.y1 >=20 || tetromino.y2 >=20 || tetromino.y3 >=20 || tetromino.y4 >=20)//sortie du tableau par le bas
  {
    return false ;
  }
  else if(tetromino.y1 < 0 || tetromino.y2 < 0 || tetromino.y3 < 0 || tetromino.y4 < 0)//sortie du tableau par le haut
  {
    return false ;
  }
  if(tab[tetromino.x1][tetromino.y1] == 10 || tab[tetromino.x2][tetromino.y2] == 10 || tab[tetromino.x3][tetromino.y3] == 10 || tab[tetromino.x4][tetromino.y4] == 10)//emplacement occuper par un bloc fixé
  {
    return false;
  }
  
  return true;
}

//focntion qui permet de faire touner un tetromino en fonction de son type 
function rotate(tetromino,tab)
{
  var test = //variable temporaire pour tester la rotation
  {
    x1: -1,
    x2: -1,
    x3: -1,
    x4: -1,
    y1: -1,
    y2: -1,
    y3: -1,
    y4: -1,
    type: tetromino.type,
    dir: 0
  }
  if(tetromino.type == 'O')
  {
    //un carrée n'a pas besoin de tourner
  }
  else if(tetromino.type == 'I')//rotation d'un tetromino de type I
  {
    if(tetromino.dir == 0)
    {
      setTetromino(test,tetromino.x3,tetromino.x3,tetromino.x3,tetromino.x3,tetromino.y3-2,tetromino.y3-1,tetromino.y3,tetromino.y3+1);
      test.dir = 1;
    }
    else
    {
      setTetromino(test,tetromino.x3-2,tetromino.x3-1,tetromino.x3,tetromino.x3+1,tetromino.y3,tetromino.y3,tetromino.y3,tetromino.y3);
      test.dir = 0;
    }
  }
  else if(tetromino.type == 'T')//rotation d'un tetromino de type T
  {
    if(tetromino.dir == 0)
    {
      setTetromino(test,tetromino.x2,tetromino.x2,tetromino.x2,tetromino.x2-1,tetromino.y2-1,tetromino.y2,tetromino.y2+1,tetromino.y2);
      test.dir = 1;
    }
    else if(tetromino.dir == 1)
    {
      setTetromino(test,tetromino.x2-1,tetromino.x2,tetromino.x2,tetromino.x2+1,tetromino.y2,tetromino.y2,tetromino.y2-1,tetromino.y2);
      test.dir = 2;
    }
    else if(tetromino.dir == 2)
    {
      setTetromino(test,tetromino.x2,tetromino.x2,tetromino.x2,tetromino.x2+1,tetromino.y2-1,tetromino.y2,tetromino.y2+1,tetromino.y2);
      test.dir = 3;
    }
    else if(tetromino.dir == 3)
    {
      setTetromino(test,tetromino.x2-1,tetromino.x2,tetromino.x2+1,tetromino.x2,tetromino.y2,tetromino.y2,tetromino.y2,tetromino.y2+1);
      test.dir = 0;
    }
  }
  else if(tetromino.type == 'L')//rotation d'un tetromino de type l
  {
    if(tetromino.dir == 0)
    {
      setTetromino(test,tetromino.x3-1,tetromino.x3,tetromino.x3,tetromino.x3,tetromino.y3-1,tetromino.y3-1,tetromino.y3,tetromino.y3+1);
      test.dir = 1;
    }
    else if(tetromino.dir == 1)
    {
      setTetromino(test,tetromino.x3+1,tetromino.x3+1,tetromino.x3,tetromino.x3-1,tetromino.y3-1,tetromino.y3,tetromino.y3,tetromino.y3);
      test.dir = 2;
    }
    else if(tetromino.dir == 2)
    {
      setTetromino(test,tetromino.x3+1,tetromino.x3,tetromino.x3,tetromino.x3,tetromino.y3+1,tetromino.y3+1,tetromino.y3,tetromino.y3-1);
      test.dir = 3;
    }
    else if(tetromino.dir == 3)
    {
      setTetromino(test,tetromino.x3-1,tetromino.x3-1,tetromino.x3,tetromino.x3+1,tetromino.y3+1,tetromino.y3,tetromino.y3,tetromino.y3);
      test.dir = 0;
    } 
  }
  else if(tetromino.type == 'J')//rotation d'un tetromino de type j
  {
    if(tetromino.dir == 0)
    {
      setTetromino(test,tetromino.x3-1,tetromino.x3,tetromino.x3,tetromino.x3,tetromino.y3+1,tetromino.y3+1,tetromino.y3,tetromino.y3-1);
      test.dir = 1;
    }
    else if(tetromino.dir == 1)
    {
      setTetromino(test,tetromino.x3-1,tetromino.x3-1,tetromino.x3,tetromino.x3+1,tetromino.y3-1,tetromino.y3,tetromino.y3,tetromino.y3);
      test.dir = 2;
    }
    else if(tetromino.dir == 2)
    {
      setTetromino(test,tetromino.x3+1,tetromino.x3,tetromino.x3,tetromino.x3,tetromino.y3-1,tetromino.y3-1,tetromino.y3,tetromino.y3+1);
      test.dir = 3;
    }
    else if(tetromino.dir == 3)
    {
      setTetromino(test,tetromino.x3+1,tetromino.x3+1,tetromino.x3-1,tetromino.x3,tetromino.y3+1,tetromino.y3,tetromino.y3,tetromino.y3);
      test.dir = 0;
    } 
  }  
  else if(tetromino.type == 'Z')//rotation d'un tetromino de type z
  {
    if(tetromino.dir == 0)
    {
      setTetromino(test,tetromino.x3+1,tetromino.x3+1,tetromino.x3,tetromino.x3,tetromino.y3-1,tetromino.y3,tetromino.y3,tetromino.y3+1);
      test.dir = 1;
    }
    else if(tetromino.dir == 1)
    {
      setTetromino(test,tetromino.x3-1,tetromino.x3,tetromino.x3,tetromino.x3+1,tetromino.y3-1,tetromino.y3-1,tetromino.y3,tetromino.y3);
      test.dir = 0;
    }
  }
    else if(tetromino.type == 'S')//rotation d'un tetromino de type s
  {
    if(tetromino.dir == 0)
    {
      setTetromino(test,tetromino.x3+1,tetromino.x3+1,tetromino.x3,tetromino.x3,tetromino.y3+1,tetromino.y3,tetromino.y3,tetromino.y3-1);
      test.dir = 1;
    }
    else if(tetromino.dir == 1)
    {
      setTetromino(test,tetromino.x3+1,tetromino.x3,tetromino.x3,tetromino.x3-1,tetromino.y3-1,tetromino.y3-1,tetromino.y3,tetromino.y3);
      test.dir = 0;
    }
  }
  //retour du nouvel emplacement
  if(emplacementValide(test,tab) == true)//  test si la rotation est possible
  {
    return test;
  }
  else
  {
    return tetromino;
  }
}

//fonction qui permet de tirrer aléatoirement un tetromino
function randTetromino()
{
  var res = Math.random();
  if(res < (1/7)) return 'I';
  else if(res >= (1/7) && res < (2/7)) return 'O';
  else if(res >= (2/7) && res < (3/7)) return 'T';
  else if(res >= (3/7) && res < (4/7)) return 'L';
  else if(res >= (4/7) && res < (5/7)) return 'J';
  else if(res >= (5/7) && res < (6/7)) return 'Z';
  else return 'S';
}

function action(socket,tab,tetromino,input,socket2 = null)
{
   if(input.get(socket.id) != 0)
  {
    if(input.get(socket.id) == 'bas')//action vers le bas 
    {
      if(tetromino.y1+1<20 && tab[tetromino.x1][tetromino.y1+1] != 10 && tetromino.y2+1<20 && tab[tetromino.x2][tetromino.y2+1] != 10 && tetromino.y3+1<20 && tab[tetromino.x3][tetromino.y3+1] != 10 && tetromino.y4+1<20 && tab[tetromino.x4][tetromino.y4+1] != 10)
      {
        tetromino.y1 = tetromino.y1+1;
        tetromino.y2 = tetromino.y2+1
        tetromino.y3 = tetromino.y3+1;
        tetromino.y4 = tetromino.y4+1
      } 
    }
    else if(input.get(socket.id) == 'droite')//action vers la droite 
    {
     if(tetromino.x1-1>=0 && tetromino.x2-1>=0 && tetromino.x3-1>=0 && tetromino.x4-1>=0 && tab[tetromino.x1-1][tetromino.y1] != 10 && tab[tetromino.x2-1][tetromino.y2] != 10 && tab[tetromino.x3-1][tetromino.y3] != 10 && tab[tetromino.x4-1][tetromino.y4] != 10)
      {
        tetromino.x1 = tetromino.x1-1;
        tetromino.x2 = tetromino.x2-1;
        tetromino.x3 = tetromino.x3-1;
        tetromino.x4 = tetromino.x4-1;
      }
    }
    else if(input.get(socket.id) == 'gauche')//action vers la gauche
    {
      if(tetromino.x1+1<10 && tetromino.x2+1<10 && tetromino.x3+1<10 && tetromino.x4+1<10 && tab[tetromino.x1+1][tetromino.y1] != 10 && tab[tetromino.x2+1][tetromino.y2] != 10 && tab[tetromino.x3+1][tetromino.y3] != 10 && tab[tetromino.x4+1][tetromino.y4] != 10)
      {
        tetromino.x1 = tetromino.x1+1;
        tetromino.x2 = tetromino.x2+1;
        tetromino.x3 = tetromino.x3+1;
        tetromino.x4 = tetromino.x4+1;
      }
    }
    else if(input.get(socket.id) == 'rotate')//rotation d'un tetromino
    {
      tetromino = rotate(tetromino,tab);
    }
    input.set(socket.id,0)
    socket.emit('moove',tetromino.x1+" "+tetromino.y1+" "+tetromino.x2+" "+tetromino.y2+" "+tetromino.x3+" "+tetromino.y3+" "+tetromino.x4+" "+tetromino.y4+" "+getColor(tetromino.type));;
    if(socket2 != null){socket2.emit('moove2',tetromino.x1+" "+tetromino.y1+" "+tetromino.x2+" "+tetromino.y2+" "+tetromino.x3+" "+tetromino.y3+" "+tetromino.x4+" "+tetromino.y4+" "+getColor(tetromino.type));}
  }
  return tetromino;
}

function Cpytetro(tetro,suiv)
{
  tetro.x1 = suiv.x1;
  tetro.x2 = suiv.x2;
  tetro.x3 = suiv.x3;
  tetro.x4 = suiv.x4;
  tetro.y1 = suiv.y1;
  tetro.y2 = suiv.y2;
  tetro.y3 = suiv.y3;
  tetro.y4 = suiv.y4;
  tetro.type = suiv.type;
  return tetro;
}

function down(socket,tab,tetromino,input,suiv,score,socket2 = null)
{
  // déscente du bloc
  if(tetromino.y1+1<20 && tab[tetromino.x1][tetromino.y1+1] != 10 && tetromino.y2+1<20 && tab[tetromino.x2][tetromino.y2+1] != 10 && tetromino.y3+1<20 && tab[tetromino.x3][tetromino.y3+1] != 10 && tetromino.y4+1<20 && tab[tetromino.x4][tetromino.y4+1] != 10) 
  {
    tetromino.y1 = tetromino.y1+1;
    tetromino.y2 = tetromino.y2+1;  
    tetromino.y3 = tetromino.y3+1; 
    tetromino.y4 = tetromino.y4+1; 
    socket.emit('moove',tetromino.x1+" "+tetromino.y1+" "+tetromino.x2+" "+tetromino.y2+" "+tetromino.x3+" "+tetromino.y3+" "+tetromino.x4+" "+tetromino.y4+" "+getColor(tetromino.type));
    if(socket2 != null){socket2.emit('moove2',tetromino.x1+" "+tetromino.y1+" "+tetromino.x2+" "+tetromino.y2+" "+tetromino.x3+" "+tetromino.y3+" "+tetromino.x4+" "+tetromino.y4+" "+getColor(tetromino.type));}
  }
  else// le bloc est arrivé sur la dernière ligne
  {
    tab[tetromino.x1][tetromino.y1] = 10;
    tab[tetromino.x2][tetromino.y2] = 10;
    tab[tetromino.x3][tetromino.y3] = 10;
    tab[tetromino.x4][tetromino.y4] = 10;
    socket.emit('lock',10);
    if(socket2 != null){socket2.emit('lock2',10);}
    
    //récuparation de toute les lignes ou se trouve le tetromino lock
    var ligneUT = []
    ligneUT.push(tetromino.y1);
    if(ligneUT.indexOf(tetromino.y2) == -1) ligneUT[ligneUT.length] = tetromino.y2;
    if(ligneUT.indexOf(tetromino.y3) == -1) ligneUT[ligneUT.length] = tetromino.y3;
    if(ligneUT.indexOf(tetromino.y4) == -1) ligneUT[ligneUT.length] = tetromino.y4;
    ligneUT.sort();
    
    var contL = 0;
    var i;
    var sum = 0;
    var sup = [];
    sup.push(0); 
    //test de toute les lignes pour savoir, si elle sont complète 
    while(contL < ligneUT.length) 
    {
      for(var i=0;i<10;i++)//calcul de la somme de la ligne
      { 
        sum = tab[i][ligneUT[contL]] + sum;
        //console.log(tab);
      } 
      //console.log("----------------",contL,sum,tetromino.type);
      if(sum == 100)//si somme est égale à 90, alors la ligne est compléte et elle peut être supprimée
      {
        score = score + 1;
        for(var i=9; i>=0; i--)//supression de la ligne coté server
        {
           for(var j=ligneUT[contL]; j>=0; j--)
           {  
             if(tab[i][j-1] != undefined)
              {
                 tab[i][j] = tab[i][j-1];    
               }
             else
             {
               tab[i][j] = 0; 
             }
           }
        }
        sup[sup.length] = ligneUT[contL];
      }
      sum = 0;
      contL = contL+1;
    }
    sup[0] = sup.length-1;
    if(sup[0] != 0)
    {
      socket.emit('supp',sup);//message qui permet la supression de la ligne coté client
      if(socket2 != null){socket2.emit('supp2',sup);}
    }
    tetromino = Cpytetro(tetromino,suiv);
    initTetromino(suiv,randTetromino());
    //envoi du tetromino suivant // ajouter un emit
    socket.emit('suiv',suiv.x1+" "+suiv.y1+" "+suiv.x2+" "+suiv.y2+" "+suiv.x3+" "+suiv.y3+" "+suiv.x4+" "+suiv.y4);
    //initTetromino(tetromino,"T");
    if(!emplacementValide(tetromino,tab))
    {
      console.log("Game Over",tetromino.type)
      socket.emit('GameOver','')
      if(socket2 != null){socket2.emit('GameOver2','')}
    }
  }
  return tetromino;
}


exports.down = down;
exports.action = action;
exports.initTetromino = initTetromino;
exports.randTetromino = randTetromino;