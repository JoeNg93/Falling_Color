const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const assert = require('assert');
const ejs = require('ejs');
const {MongoClient} = require('mongodb');

const app = express();

app.set('url', process.env.MONGO_URL || 'mongodb://localhost:27017/falling-color');

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/push_score', (req, res) => {
  const player = {
    name: req.body.name,
    score: req.body.score
  };
  addPlayerToDb(player, res);
});

app.get('/get_leaderboard', (req, res) => {
  getLeaderboard(res);
});

app.listen(app.get('port'), () => {
  console.log('Server is running at ' + app.get('port'));
});

function addPlayerToDb(player, res) {
  MongoClient.connect(app.get('url'))
      .then((db) => {
        const players = db.collection('players');
        players.insertOne({name: player.name, score: player.score});
        db.close();
        res.send('Submit score successfully');
      })
      .catch((err) => {
        res.send('Error in submitting your score. Please try again');
      });
}

function getLeaderboard(res) {
  let mydb = null;
  MongoClient.connect(app.get('url'))
      .then((db) => {
        mydb = db;
        const players = db.collection('players');
        return players.aggregate([
          {$project: {name: 1, score: 1, _id: 0}},
          {$sort: {score: -1}},
          {$limit: 5}
        ]).toArray();
      })
      .then((topPlayers) => {
        mydb.close();
        res.json(topPlayers);
      })
      .catch((err) => {
        console.log(err.message);
      });
}
