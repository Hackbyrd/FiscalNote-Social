/**
* Load all FiscalNote employee data into mongoDB
* Contact Information: https://docs.google.com/spreadsheets/d/1U6j4fQl_-HH4pVNE4G0B0JbpaEUXsON_yWwI4l9K4EM/edit#gid=0
* FN-Social Date: https://docs.google.com/spreadsheets/d/110nnrqy78xvH05JJo_cfWoHHnHGLRRioeY2qM6sayJ8/edit#gid=0
*/

var fs = require('fs'); // load file reader if file reader doesn't exist
var mongoose = require('mongoose');
var User = require('./models/user'); // load user modal
var Match = require('./models/match'); // load match modal

mongoose.connect('mongodb://localhost/FiscalNote-Social');
loadData('data.tsv', mongoose);

/**
* filename - name of file to extract FiscalNote employee data from
* mongoose - mongoose object to help update database
*/
function loadData(filename, mongoose) {

  // remove User collection
  User.remove({}, function(err) {
    // if error
    if (err) {
      return console.error(err);
    }

    console.log('User Collection removed');

    // remove Match collection
    Match.remove({}, function(err) {
      // if error
      if (err) {
        return console.error(err);
      }

      console.log('Match Collection removed');

      // read the file
      fs.readFile(filename, 'utf8', function(err, data) {

        // if error
        if (err) {
          return console.error(err);
        }

        // split all rows
        var rows = data.split('\n');

        // because first row is headers
        var numEmployees = rows.length - 1;

        // store keys/names
        var keys = rows[0].split('\t');

        // loop through all rows
        for (var r = 1; r < rows.length; r++) {

          // split the columns
          var cols = rows[r].split('\t');

          // set up current user
          var curUser = { password: null };

          // loop through the columns of each row
          for (var l = 0; l < cols.length; l++) {
            // console.log(keys[l] + ': ' + cols[l]); // testing

            // change type if neccessary, and then insert into curUser Model
            if (keys[l] === 'age' || keys[l] === 'index' || keys[l] === 'fngroupid') {
              curUser[keys[l]] = Number(cols[l]); // convert to number

            } else if (keys[l] === 'startdate' || keys[l] === 'birthday') {
              curUser[keys[l]] = new Date(cols[l]); // convert to date

            } else {
              if (cols[l] === '') {
                curUser[keys[l]] = null;
              } else {
                curUser[keys[l]] = cols[l];
              }
            }

          } // end for

          // handle matches string
          var matchStr = '';

          // create matchStr '0 0 0 0 0 0 0 ...'
          for (var i = 0; i < numEmployees; i++) {
            if (i === 0) {
              matchStr += '0';
            } else {
              matchStr += ' 0';
            }
          }

          // set matches string
          curUser.matches = matchStr;

          // console.log(curUser); // testing

          // insert curUser into mongoDB
          User.findOneAndUpdate({ email: curUser.email }, curUser, { new: true, upsert: true }, function(err, doc) {
            if (err) {
              console.error(err);
              process.exit(1); // exit with error
            } else {
              console.log('Updated:\n' + doc);
              console.log('-------------------');
            }
          });

        } // end for

        // insert into Match table

        // create match string
        var matchMatrix = '';

        // create 0s for matchMatrix
        for (var i = 0; i < numEmployees; i++) {
          for (var j = 0; j < numEmployees; j++) {

            // only put space if it's the first col in each row
            if (j === 0) {
              matchMatrix += '0';
            } else {
              matchMatrix += ' 0';
            }
          }

          // Don't put newline if it's the last row
          if (i !== numEmployees - 1) {
            matchMatrix += '\n'
          }
        }

        // create match object
        var matchObj = new Match({
          totalEmployees: numEmployees,
          current: matchMatrix,
          overall: matchMatrix,
          date: new Date()
        });

        // insert match object
        matchObj.save(function(err, doc) {
          if (err) {
            console.error(err);
            process.exit(1); // exit with error
          } else {
            console.log('Inserted Match Object:\n' + doc);
            console.log('-------------------');
          }
        });

      }); // end fs.readFile

    }); // end Match remove

  }); // end User remove

} // end loadFN
