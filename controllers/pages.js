var User = require('../models/user');
var Match = require('../models/match');

var pages = {

  // login page
  index: function(req, res) {
    console.log('Index');
    res.redirect('/home');
  },

  home: function(req, res) {
    console.log('Home');
    res.render('pages/home', {
      title: "FiscalNote Social | Home",
      name: 'Jonathan'
    });
  },

  team: function(req, res) {
    console.log('Team');
    res.render('pages/team', {
      title: "FiscalNote Social | Team",
      name: 'Jonathan'
    });
  },

  stats: function(req, res) {
    console.log('Stats');
    res.render('pages/stats', {
      title: "FiscalNote Social | Stats",
      name: 'Jonathan'
    });
  },

  matches: function(req, res) {
    console.log('Matches');

    // get all users
    User.find().sort('index').exec(function(err, allUsers) {
      console.log('-------------' + allUsers);
      // if error, 500 Internal Server Error
      if (err) {
        console.error(err);
        res.status(500);
        res.json({
          'status': 500,
          'message': 'Internal Server Error'
        });
      } else {
        Match.find().sort('-date').exec(function(err, allMatches) {

          var arr = [];

          for (var i = 0; i < allMatches.length; i++) {
            var rowsArr = allMatches[i].current.split('\n');
            var strArr = [];

            console.log('rowsArr: ' + rowsArr.length);

            for (var e = 0; e < rowsArr.length; e++) {
              var colsArr = rowsArr[e].split(' ');
              console.log('colsArr: ' + colsArr.length);

              var str = allUsers[e].firstname + ' ' + allUsers[e].lastname + ': ';
              var count = 0;

              for (var j = 0; j < colsArr.length; j++) {
                console.log('colsArr[j]: ' + colsArr[j].length);
                if (colsArr[j] === '1') {

                  if (count > 0) {
                    str += ', ' + allUsers[j].firstname + ' ' + allUsers[j].lastname;
                  } else {
                    str += allUsers[j].firstname + ' ' + allUsers[j].lastname;
                  }

                  count++;
                }
              }

              if (count === 0) {
                str += 'No Match';
              }

              strArr.push(str);

            }

            arr.push(strArr);

          }

          res.status(200);
          res.render('pages/matches', {
            title: "FiscalNote Social | Matches",
            name: 'Jonathan',
            users: allUsers,
            matches: allMatches,
            arrMatch: arr
          });
        });
      }
    });
  },

  user: function(req, res) {
    console.log('User: ' + req.params.id);

    var id = req.params.id;
    var query = {};

    // get correct keys
    if (id.indexOf('@fiscalnote.com') >= 0) {
      query.email = id;
    } else {
      query.index = id;
    }

    User.findOne(query, function(err, user) {

      // if error, then send back 500 error code
      if (err) {
        console.error(err);
        res.status(500);
        res.json({
          'status': 500,
          'message': 'Internal Server Error'
        });

      // if no error
      } else {

        // if user exists, send back user
        if (user) {

          // get all users
          User.find().sort('index').exec(function(err, allUsers) {
            // if error, 500 Internal Server Error
            if (err) {
              console.error(err);
              res.status(500);
              res.json({
                'status': 500,
                'message': 'Internal Server Error'
              });
            } else {

              // get all matches
              Match.find().sort('-date').exec(function(err, allMatches) {

                // grab current overall string
                // var tempArr = allMatches[0].overall.split('\n');
                // var matchHistory = tempArr[user.index].split(' ');

                // grab match history
                var matchHistory = user.matches.split(' ');

                res.status(200);
                res.render('pages/user', {
                  title: "FiscalNote Social | " + user.name,
                  name: 'Jonathan',
                  user: user,
                  users: allUsers,
                  matchHistory: matchHistory,
                  allMatches: allMatches
                });
              });
            }
          });

        // if user does not exist, send 404 error that user does not exist
        } else {
          res.status(404);
          res.json({
            'status': 404,
            'message': 'User does not exist.'
          });
        }

      }

    });
  },

  stats: function(req, res) {
    console.log('Stats');
    res.render('pages/stats', {
      title: "FiscalNote Social | Stats",
      name: 'Jonathan'
    });
  }

};

module.exports = pages;
