var express = require("express");
var app = express();
var path = require("path");
var JsonDB = require("node-json-db");
var bodyParser = require("body-parser");
var _ = require("underscore");
var favicon = require("serve-favicon");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json')
const db = low(adapter)

// var db = new JsonDB("myDataBase", true, false);

db.defaults({ players: []})
  .write()

app.use("/", express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, "/favicon.ico")));
app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  res.render('index');
});

app.post("/", function(req, res) {
  try {
   var success = false;
    if(db.get('players')
    .find({ name: req.body.name })
    .value() != undefined){
        console.log('already defined');
    }else {
           db.get('players')
    .push({ name: req.body.name, skill: req.body.skill})
    .write() 
    success = true;
    }

  } catch (error) {
    console.error(error);
  }

  res.render('index', {success: success});
});

app.listen(8000, function() {
  console.log("app is running");
});
