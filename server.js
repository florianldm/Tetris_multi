// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);


//CREATION TABLE JOUEURS
function create(){
db.serialize(() => {
  if (exists) {
    db.run(
      "CREATE TABLE Joueurs (id INTEGER PRIMARY KEY AUTOINCREMENT, Nom TEXT, Mdp TEXT, Victoires INTEGER, Defaites INTEGER)"
    );
    console.log("Nouvelle table Joueurs créée!");
    } else {
      console.log('Database "Joueurs" ready to go!');
    }
})}

//INSERTION TABLE JOUEURS
function insert(nom, mdp){
  console.log(nom);
  db.serialize(() => {
    db.run('INSERT INTO Joueurs (Nom, Mdp, Victoires, Defaites) VALUES (?, ?, 0, 0 )', nom, mdp);
    return;
  });
}


//PROJECTION DE LA TABLE JOUEURS
function select(){
  db.serialize(() => {
    db.each("SELECT DISTINCT * from Joueurs", (err, row) => {
        if (row) console.log(`record: ${row.id} ${row.Nom} ${row.Mdp} ${row.Victoires} ${row.Defaites}`);
    });
  });
}
select();

//SUPPRIMER TABLE
function drop(){
db.serialize(() => {
  if (exists) {
    db.run(
      "DROP TABLE Joueurs"
    );
    console.log("Table supprimée!");
  }});
}

//SUPPRIMER TUPLES TABLE
function clear(){
  db.serialize(() => {
    db.run("DROP TABLE Joueurs");
    db.run( "CREATE TABLE Joueurs (id INTEGER PRIMARY KEY AUTOINCREMENT, Nom TEXT UNIQUE, Mdp TEXT, Victoires INTEGER, Defaites INTEGER)");
    console.log("Table vidée");
    return;
  });
}

function check(nom, mdp){
  var ok = 0;
  db.serialize(() => {
    db.each("SELECT DISTINCT * from Joueurs", (err, row) => {
        if (row){
          console.log(nom + " " + row.Nom.value);
          console.log(mdp + " " + row.Mdp.value);
          console.log(mdp == row.Nom);
          if(row.Nom == nom) ok = 1;
        } 
    });
  });
  console.log("ok= " + ok);
  if(ok == 1) return true;
  else return false;
}


//clear();
//drop();
//create();

//function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }

app.get('/profil', function(req, res){
  var n = req.query.pseudo; 
  var o = req.query.mdp;
  var p = req.query.mdp2;
  var salt = "D%|w-+==@47k01W&a"; //Valeur ajoutée au mdp pour sécuriser
  
  //console.log(md5(o.n.salt));
  
  //res.sendFile('/index.html');
  if(o === p){
    insert(n,o);
  }
  res.redirect('/index.html');
});

app.get('/co', function(req, res){
  var n = req.query.pseudo; 
  var o = req.query.mdp;
  var salt = "D%|w-+==@47k01W&a"; //Valeur ajoutée au mdp pour sécuriser
  
  //res.sendFile('/index.html');
  if(check(n,o) == true){
    res.send("Salut " + n + "!");
  }
  else res.send("!");
  //res.redirect('/index.html');
});


/*
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the dreams in the database
app.get("/getDreams", (request, response) => {
  db.all("SELECT * from Dreams", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// endpoint to add a dream to the database
app.post("/addDream", (request, response) => {
  console.log(`add to dreams ${request.body.dream}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects
  // so they can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const cleansedDream = cleanseString(request.body.dream);
    db.run(`INSERT INTO Dreams (dream) VALUES (?)`, cleansedDream, error => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});

// endpoint to clear dreams from the database
app.get("/clearDreams", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from Dreams",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM Dreams WHERE ID=?`, row.id, error => {
          if (row) {
            console.log(`deleted row ${row.id}`);
          }
        });
      },
      err => {
        if (err) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
*/
// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

