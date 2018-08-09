var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var Article = require('./models/article.js');

var app = express();
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
//app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("app/build"));
}

//mongoose.connect('mongodb://localhost/nyt-react');
//MONGODB_URI => mongodb://heroku_12345678:random_password@ds029017.mLab.com:29017/heroku_12345678
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/nyt-react");
mongoose.connect('mongodb://heroku_12345678:random_password@ds029017.mLab.com:29017/heroku_12345678');
//mongoose.connect('mongodb://heroku_rkhhrkk9:ltf4sou76eu5sb77s0cronvvb8@ds031792.mlab.com:31792/heroku_rkhhrkk9');
// mongodb://<dbuser>:<dbpassword>@ds047592.mlab.com:47592/heroku_t60d2qtp


var db = mongoose.connection;

db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function () {
  console.log('Mongoose connection successful.');
});

app.get('/', function(req, res){
  res.sendFile('./public/index.html');
})

app.get('/api/saved', function(req, res) {

  Article.find({})
    .exec(function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    })
});

app.post('/api/saved', function(req, res){

  var newArticle = new Article({
    title: req.body.title,
    date: req.body.date,
    url: req.body.url
  });

  newArticle.save(function(err, doc){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });

});

app.delete('/api/saved/:id', function(req, res){

  Article.find({'_id': req.params.id}).remove()
    .exec(function(err, doc) {
      res.send(doc);
  });

});



app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});





