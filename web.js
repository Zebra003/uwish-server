var express = require('express');

var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
  'mongodb://localhost/mydb';


var app = express.createServer(express.logger());

app.get('/', function(request, response) {

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('mydocs', function(er, collection) {
      collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
        response.send("IT WORKS....I think")
      });
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
