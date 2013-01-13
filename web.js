var express = require('express');

var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
  'mongodb://localhost/mydb';

// CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}



var app = express.createServer(express.logger());

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
});


app.get('/', function(request, response) {
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('mydocs', function(er, collection) {
      collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
        response.send("IT WORKS....I think")
      });
    });
  });
});

var wishes = [];
app.post('/:uuid/wishes', function(req, res) {
  var wish = req.body;
  wishes.push(wish);
  res.send({ success: true });
});

app.get('/:uuid/wishes', function(req, res) {
  console.log(wishes);
  res.send(wishes);
});

app.delete('/:uuid/wishes/:id', function(req, res) {
  wishes.splice(req.params.id, 1)
  res.send({ success: true });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
