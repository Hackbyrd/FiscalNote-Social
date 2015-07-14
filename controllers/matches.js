var Match = require('../models/match');
var _match_ = require('../match');

var matches = {

  // run match algorithm
  match: function(req, res) {
    var variables = req.body;

    _match_(variables.exclude, variables.include, variables.custom, variables.office, variables.groupSize, variables.departmentWeight, variables.status, function(err, matches, curMatrix, matrix, people) {
      if (err) {
        console.error(err);
        res.status(500);
        res.json({
          'status': 500,
          'message': 'Internal Server Error'
        });
      } else {
        console.log('\nMatches:');
        console.log(matches);

        var overallMatrix = '';
        var currentMatrix = '';

        for (var i = 0; i < matrix.length; i++) {
          overallMatrix += matrix[i].join(' ');
          currentMatrix += curMatrix[i].join(' ');

          if (i < matrix.length - 1) {
            overallMatrix += '\n';
            currentMatrix += '\n';
          }
        }

        // console.log('overall: \n');
        // console.log(overallMatrix);

        // console.log('current: \n');
        // console.log(currentMatrix);
        // console.log(overallMatrix === currentMatrix);

        // create new match object
        var matchObj = new Match({
          totalEmployees: matrix.length,
          current: currentMatrix,
          overall: overallMatrix,
          date: new Date()
        });

        // insert new match object
        matchObj.save(function(err, doc) {
          if (err) {
            console.error(err);
            res.status(500);
            res.json({
              'status': 500,
              'message': 'Could not insert new match.'
            });
          } else {

            // save all people model objects
            for (var i = 0; i < people.length; i++) {
              people[i].save();
            }

            // return matches
            res.status(200);
            res.json({
              'status': 200
            });
          }
        });

      }

    });

  }

}

module.exports = matches;
