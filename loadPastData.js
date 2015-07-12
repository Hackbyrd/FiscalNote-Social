var fs = require('fs'); // load file reader if file reader doesn't exist
var mongoose = require('mongoose');
var User = require('./models/user'); // load user modal
var Match = require('./models/match'); // load match modal

mongoose.connect('mongodb://localhost/FiscalNote-Social');
loadPastData('pastData.txt');

function loadPastData(filename) {

  // get all users
  User.find().sort('index').exec(function(err, allUsers) {
    // if error, 500 Internal Server Error
    if (err) {
      console.error(err);
    } else {

      // read file
      fs.readFile(filename, 'utf8', function(err, data) {
        var matchesArr = data.split('\n~\n');
        var matrix = [];
        var usersObj = {};

        // create Users Obj
        for (var i = 0; i < allUsers.length; i++) {
          usersObj[allUsers[i].email] = allUsers[i].index;
        }

        // console.log(usersObj);

        // create matrix of 0s
        for (var i = 0; i < allUsers.length; i++) {
          matrix.push([]);
          for (var j = 0; j < allUsers.length; j++) {
            matrix[i].push(0);
          }
        }

        // loop through each match
        for (var i = 0; i < matchesArr.length; i++) {
          var rowsArr = matchesArr[i].split('\n');
          var date = new Date(rowsArr[0]); // get date
          var numEmployees = rowsArr[1];
          var curMatrix = [];
          var matchObj = new Match();

          // create curMatrix of 0s
          for (var e = 0; e < allUsers.length; e++) {
            curMatrix.push([]);
            for (var j = 0; j < allUsers.length; j++) {
              curMatrix[e].push(0);
            }
          }

          // loop through each row
          for (var j = 2; j < rowsArr.length; j++) {
            var colsArr = rowsArr[j].split('|');

            // loop through all emails and update match
            for (var e = 0; e < colsArr.length; e++) {
              for (var f = 0; f < colsArr.length; f++) {
                if (colsArr[e] !== colsArr[f]) {
                  var matrixIdx1 = usersObj[colsArr[e]];
                  var matrixIdx2 = usersObj[colsArr[f]];

                  // update both matrixes
                  matrix[matrixIdx1][matrixIdx2]++;
                  curMatrix[matrixIdx1][matrixIdx2]++;
                }
              }
            } // end for

          } // end for

          var matrixStr = '';
          var curMatrixStr = '';

          for (var m = 0; m < matrix.length; m++) {
            matrixStr += matrix[m].join(' ');
            curMatrixStr += curMatrix[m].join(' ');
            if (m < matrix.length - 1) {
              matrixStr += '\n';
              curMatrixStr += '\n';
            }
          }

          matchObj.date = date;
          matchObj.current = curMatrixStr;
          matchObj.overall = matrixStr;
          matchObj.totalEmployees = numEmployees;
          matchObj.save();

          // update user matches
          for (var x = 0; x < allUsers.length; x++) {
            // console.log(matrixStr.split('\n')[x]);
            allUsers[x].matches = matrixStr.split('\n')[x];
            allUsers[x].save();
          }

          console.log(matchObj);

        } // end for

      }); // end file read

    } // end else

  }); // end find

} // end loadPastData
