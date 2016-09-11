var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var redis = require('redis');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
var client = redis.createClient();

app.post('/flip', function(req, res) {

  var call = req.body.call;

  var checkPoint = Math.random();
  var result = "";
  var fResult;

  if ((checkPoint * 100) < 50) {
    result = "heads";
  } else {
    result = "tails";
  }
  if (result === call) {
    fResult = "win";
    client.incr("wins", redis.print);
  } else {
    fResult = "loss";
    client.incr("looses", redis.print);
  }
  res.json({
    "result": fResult
  });
});


app.get('/stats', function(req, res) {
  client.get("wins", function(err, reply) {
    wins = reply;
    client.get("looses", function(err, reply) {
      looses = reply;
      res.json({
        "wins": wins,
        "looses": looses
      });
    });
  });

});

app.delete('/stats', function(req, res) {
  client.set("wins", "0");
  client.set("looses", "0");
  res.json({
    "wins": "0",
    "looses": "0"
  });
});

app.listen(3000);