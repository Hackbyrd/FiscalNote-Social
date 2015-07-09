//************* testing purposes *************//
var mongoose = require('mongoose');
var User = require('./models/user');
var Match = require('./models/match');

mongoose.connect('mongodb://localhost/FiscalNote-Social');

var _excluded = [2];
var _included = [1, 52, 41];
var _custom = {
  matches: {
    0: [1],
    1: [0]
  },
  unmatches: {
    1: [6]
  }
};

// call _match_
_match_(_excluded, _included, _custom, 'Washington, D.C.', 2, 0, function(err, matches, matrix, people) {
  if (err) {
    console.error(err);
  } else {
    console.log('\nMatches:');
    console.log(matches);

    var overallMatrix = '';

    for (var i = 0; i < matrix.length; i++) {
      overallMatrix += matrix[i].join(' ');

      if (i < matrix.length - 1) {
        overallMatrix += '\n';
      }
    }

    console.log(overallMatrix);

    // create new match object
    // var matchObj = new Match({
    //   totalEmployees: numEmployees,
    //   current: matchMatrix,
    //   overall: matchMatrix,
    //   date: new Date()
    // });

    // // insert new match object
    // matchObj.save(function(err, doc) {
    //   if (err) {
    //     console.error(err);
    //     process.exit(1); // exit with error
    //   } else {
    //     console.log('Inserted Match Object:\n' + doc);
    //     console.log('-------------------');
    //   }
    // });

  }
});
//************* End testing purposes *************//

// shuffles array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// generates the matrix
function genMatrix(callback) {
  var matrix = []; //  the matrix representation of all the matches to date, initialized to all 0s

  // find all matches and create matrix
  Match.find({}).sort({ date: -1 }).exec(function(err, docs) {

    // if error
    if (err) {
      return callback(err);
    }

    // error if no match objects are found
    if (docs.length < 1) {
      return callback(new Error('There are no matches in database, please run the loadData.js script to populate database.'));
    }

    var overallStr = docs[0].overall; // get overall string
    var overallStrRows = overallStr.split('\n'); // get row data

    // loop through string rows
    for (var i = 0; i < overallStrRows.length; i++) {

      matrix.push([]); // add new array

      // get col data
      var overallStrCols = overallStrRows[i].split(' ');

      // loop through rows and get each col data
      for (var j = 0; j < overallStrCols.length; j++) {
        matrix[i].push(Number(overallStrCols[j]));
      }

    }

    // call next function passing in matrix
    callback(null, matrix);

  }); // end Match.find

} // end genMatrix

// generate array of people objects
function genPeople(callback) {
  User.find({}).sort({ index: 1 }).exec(function(err, people) {
    if (err)
      return callback(new Error('Error getting users'));

    // call next function passing in people
    callback(null, people);
  }); // end User.find
} // end genPeople

// generate match
function genMatch(matrix, people, exclude, include, custom, office, groupSize, departmentWeight, callback) {

  var pool = []; // potential pool of match candidates [1, 4, 6, 9] (index 0 is person 1)
  var matches = {}; // object of arrays { 0: [2,3] } person at index 0 is matched with person at index 2 and 3

  // initialize matrix
  for (var i = 0; i < people.length; i++) {
    matches[i] = [];
  }

  // check groupSize
  if (groupSize < 2 || groupSize > 3) {
    return callback(new Error('groupSize(' + groupSize + ') cannot be less than 2 or greater than 3.'));
  }

  // run checks for custom.matches
  for (var key in custom.matches) {

    // check to see if custom matches are compliant to the groupSize
    if (custom.matches[key].length !== (groupSize - 1)) {
      return callback(new Error('custom.matches [' + custom.matches[key] + '] array length must equal ' + (groupSize - 1)));
    }

    // check to see if custom.matches contains same people in custom.unmatches
    if (custom.unmatches[key] !== undefined) {

      // go through array of key
      for (var i = 0; i < key.length; i++) {
        if (custom.unmatches[key].indexOf(custom.matches[key][i]) >= 0) {
          return callback(new Error(key + ' and ' + custom.matches[key][i] + ' cannot be in custom.matches and in custom.unmatches at the same time.'));
        }
      }

    }

    // check to see if custom and exclude has the same people
    if (exclude.indexOf(Number(key)) >= 0) {
      return callback(new Error(key + ' cannot be in excluded and in custom at the same time.'));
    }

    // check to see if people are matching with themselves
    if (custom.matches[key].indexOf(Number(key)) >= 0) {
      return callback(new Error(key + ' cannot be matched with itself.'));
    }
  }

  // run checks for custom.unmatches
  for (var key in custom.unmatches) {
    // check to see if people are unmatching with themselves
    if (custom.unmatches[key].indexOf(Number(key)) >= 0) {
      return callback(new Error(key + ' cannot be unmatched with itself.'));
    }
  }

  // go through each candidate and see if they should be in the pool based on arguments
  for (var i = 0; i < people.length; i++) {

    // cannot be in both exclude and include
    if ((include.indexOf(i) >= 0) && (exclude.indexOf(i) >= 0)) {
      return callback(new Error(i + ' cannot be included and excluded at the same time.'));
    }

    // if person is not in excludes and the office is the same or is in includes
    if (!(exclude.indexOf(i) >= 0) && (people[i].office === office || (include.indexOf(i) >= 0))) {
      pool.push(i);
    }

  } // end for

  // run this algorithm if groupsize is 2
  if (groupSize === 2) {

    // match custom.matches
    for (var key in custom.matches) {
      matches[key] = custom.matches[key];
      matrix[key][custom.matches[key][0]]++;

      var historyArr = people[key].matches.split(' ');
      for (var e = 0; e < historyArr.length; e++) {
        historyArr[e] = Number(historyArr[e]);

        if (e === custom.matches[key][0]) {
          historyArr[e]++;
        }
      }

      people[key].matches = historyArr.join(' ');
      pool.splice(pool.indexOf(Number(key)), 1); // remove from pool
    }

    // shuffle pool
    pool = shuffle(pool);

    // keep matching as long as the pool is not empty
    while (pool.length > 0) {

      // if there are 3 people left
      // TODO: this wont work if all 3 are in custom.unmatches
      if (pool.length === 3) {

        // store person indexes
        var a = pool[0];
        var b = pool[1];
        var c = pool[2];

        // update matrix
        matrix[a][b]++;
        matrix[a][c]++;
        matrix[b][a]++;
        matrix[b][c]++;
        matrix[c][a]++;
        matrix[c][b]++;

        // update people
        var aMatchHistoryArr = people[a].matches.split(' ');
        var bMatchHistoryArr = people[b].matches.split(' ');
        var cMatchHistoryArr = people[c].matches.split(' ');

        // convert to numbers and update counts
        for (var i = 0; i < aMatchHistoryArr.length; i++) {
          aMatchHistoryArr[i] = Number(aMatchHistoryArr[i]);
          if (i === b || i === c) {
            aMatchHistoryArr[i]++;
          }
        }

        for (var i = 0; i < bMatchHistoryArr.length; i++) {
          bMatchHistoryArr[i] = Number(bMatchHistoryArr[i]);
          if (i === a || i === c) {
            bMatchHistoryArr[i]++;
          }
        }

        for (var i = 0; i < cMatchHistoryArr.length; i++) {
          cMatchHistoryArr[i] = Number(cMatchHistoryArr[i]);
          if (i === a || i === b) {
            cMatchHistoryArr[i]++;
          }
        }

        // update people objects
        people[a].matches = aMatchHistoryArr.join(' ');
        people[b].matches = bMatchHistoryArr.join(' ');
        people[c].matches = cMatchHistoryArr.join(' ');

        // update matches
        matches[a].push(b);
        matches[a].push(c);
        matches[b].push(a);
        matches[b].push(c);
        matches[c].push(a);
        matches[c].push(b);

        // remove from pool and exit
        pool.splice(0, 3);
        break;
      }

      var matchPerson = pool[0]; // grab first Person in the pool
      var matchPersonArr = people[matchPerson].matches.split(' '); // grab first persons history array of matches. This is in string form, must convert to int

      // convert strings to numbers in array
      for (var i = 0; i < matchPersonArr.length; i++) {
        matchPersonArr[i] = Number(matchPersonArr[i]);
      }

      pool.splice(0, 1); // remove first Person from pool

      var bestCandidateIndex = 0; // the current person index of the pool being looped through
      var matchPersonMatchCount = matchPersonArr[pool[bestCandidateIndex]]; // the least amount of matches so far
      var randCount = 1; // The number of indexes that current person has been compared to already, for random number

      // loop though pool and find matches of 2
      for (var i = 1; i < pool.length; i++) {

        var unmatchFlag = false; // checker to see if match is included in unmatch list

        // check to see if match is included in the unmatch list
        if (custom.unmatches[matchPerson] !== undefined) {
          for (var j = 0; j < custom.unmatches[matchPerson].length; j++) {
            if (pool[i] === custom.unmatches[matchPerson][j]) {
              unmatchFlag = true;
              break;
            }
          }
        }

        // skip if match exist in unmatch list
        if (unmatchFlag) {
          break;
        }

        // check if number of matches with this person is less than current count
        if (matchPersonArr[pool[i]] < matchPersonMatchCount) {

          randCount = 1; // reset this count because found something lower
          matchPersonMatchCount = matchPersonArr[pool[i]]; // set the match count to what was just found cuz its lower
          bestCandidateIndex = i; // update best candidate

        // check if number of matches with this person is greater than current count
        } else if (matchPersonArr[pool[i]] === matchPersonMatchCount) {

          randCount++; // update randCount

          // randomly switch match if random number generated is equal to 0
          if (!Math.floor(Math.random() * randCount)) {
            matchPersonMatchCount = matchPersonArr[pool[i]];
            bestCandidateIndex = i; // update best candidate
          }

        } // end if

      } // end for

      // Note: if the last two people in the pool are in the unmatch list, still match them.

      // update people arrays
      matchPersonArr[pool[bestCandidateIndex]]++;

      var foundPerson = pool[bestCandidateIndex]; // grab best candidate index from the pool
      var foundPersonArr = people[foundPerson].matches.split(' '); // grab first persons history array of matches. This is in string form, must convert to int

      // convert strings to numbers in array
      for (var i = 0; i < foundPersonArr.length; i++) {
        foundPersonArr[i] = Number(foundPersonArr[i]);

        // if founder person, plus one to the count
        if (i === foundPerson) {
          foundPersonArr[i] = foundPersonArr[i] + 1;
        }

      }

      // update matrix
      matrix[matchPerson][foundPerson]++;
      matrix[foundPerson][matchPerson]++;

      // update people objects
      people[matchPerson].matches = matchPersonArr.join(' ');
      people[foundPerson].matches = foundPersonArr.join(' ');

      // update matches
      matches[matchPerson].push(foundPerson);
      matches[foundPerson].push(matchPerson);

      pool.splice(bestCandidateIndex, 1); // remove best candidate from pool

    } // end while loop

  } else if (groupSize === 3) {
    // TODO
  }

  // call callback passing in updated matches, matrix and people
  callback(null, matches, matrix, people);
} // end genMatch

/* Description: Create matches for the whole team.
 * Author: Jonathan Chen
 * Args:
 *  matrix -> An array of arrays(matrix) for all past matches
 *  people -> Array of people objects.
 *   [
 *     {
 *       firstname: ,
 *       lastname: ,
 *       email: ,
 *       index: ,
 *       department: ,
 *       ...
 *      }
 *   ]
 *  exclude           -> Array of indexes to exclude in the matching
 *  include           -> Array of indexes to include in the matching
 *  custom            -> An object with two arrays. One array of arrays for custom matchings, another array of arrays for custom unmatches
 *    { matches: { 0: [1, 2], 1: [0, 2], 2: [0, 1] }, unmatches: { 0: [1, 2], 1: [0, 2], 2: [0, 1] } }
 *  office            -> String to specify which office to match
 *  groupSize         -> Integer to show the number of people in a group
 *  departmentWeight  -> Integer to add weight to people in the same department
 *  done              -> Callback function
 */
function _match_(exclude, include, custom, office, groupSize, departmentWeight, callback) {
  genMatrix(function(err, matrix) {
    genPeople(function(err, people) {
      genMatch(matrix, people, exclude, include, custom, office, groupSize, departmentWeight, function(err, matches, matrix, people) {
        if (err) {
          return callback(err);
        }
        callback(null, matches, matrix, people);
      });
    });
  });
}

module.exports = _match_;
