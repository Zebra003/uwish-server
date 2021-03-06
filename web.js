var express = require('express');

var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI ||
  'mongodb://localhost/uwish';

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

app.configure('development', function() {
    app.use(express.logger('dev'));
});

mongo.Db.connect(mongoUri, function(err, db) {
  if (err) throw err;
  db.collection('wishes', function(err, collection) {
    if (err) throw err;

    app.get('/', function(req, res) {
      res.send('Welcome to the server.');
    });

    app.get('/:user/wishes', function(req, res) {
      res.header('Cache-Control', 'no-cache');
      collection.find({ user: req.params.user }).toArray(function(err, user) {
        if (err) throw err;
        if (!user || !user[0]) return res.send([]);
        res.send(user[0].wishes);
      });
    });

    app.post('/:user/wishes', function(req, res) {
      res.header('Cache-Control', 'no-cache');
      var wish = req.body;
      collection.update({ user: req.params.user }, { $push: { wishes: wish } }, { upsert: true }, function(err) {
        if (err) throw err;
        res.send({ success: true });
      });
    });

    app.put('/:user/wishes/:id', function(req, res) {
      res.header('Cache-Control', 'no-cache');
      var modification = {};
      modification['wishes.' + req.params.id + '.image'] = req.body.image;
      collection.update({ user: req.params.user }, { $set: modification }, { upsert: true }, function(err) {
        if (err) throw err;
        res.send({ success: true });
      });
    });

    app.delete('/:user/wishes/:guid', function(req, res) {
      res.header('Cache-Control', 'no-cache');
      collection.update({ user: req.params.user }, { $pull: { wishes: { guid: req.params.guid } } }, function(err) {
        if (err) throw err;
        res.send({ success: true });
      });
    });

    var port = process.env.PORT || 5000;
    app.listen(port, function() {
      console.log("Listening on " + port);
    });
  });
});
