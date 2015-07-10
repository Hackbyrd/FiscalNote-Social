// http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#restful

var User = require('../models/user');

var users = {

  // return all users
  getAll: function(req, res) {

    // get what to sort by and if same, sort by index
    var sortStr = (req.query.sort === 'index' || req.query.sort === '-index') ? req.query.sort : (req.query.sort + ' index');

    User.find().sort(sortStr).exec(function(err, allUsers) {
      // if error, 500 Internal Server Error
      if (err) {
        console.error(err);
        res.status(500);
        res.json({
          'status': 500,
          'message': 'Internal Server Error'
        });
      } else {
        res.status(200);
        res.json(allUsers);
      }
    });
  },

  // return one user
  getOne: function(req, res) {

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
          res.status(200);
          res.json(user);

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

  // create a user
  create: function(req, res) {

    // store information in newUser variable
    var newUser = req.body.user;

    // check if user already exists
    User.findOne({ email: newUser.email }, function(err, user) {

      // if error
      if (err) {
        console.error(err);
        res.status(500);
        res.json({
          'status': 500,
          'message': 'Internal Server Error'
        });
      }

      console.log(user);

      // if user exist, send message back saying so
      if (user) {
        res.status(409);
        res.json({
          'status': 409,
          'message': 'User already exists'
        });

      // if user doesn't exist
      } else {

        // get number of users
        User.find(function(err, userArr) {

          // if error
          if (err) {
            console.error(err);
            res.status(500);
            res.json({
              'status': 500,
              'message': 'Internal Server Error'
            });
          }

          // set up new user
          var createUser = new User({
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            startdate: new Date(newUser.startdate),
            birthday: new Date(newUser.birthday),
            email: newUser.email,
            password: null,
            phone: newUser.phone,
            role: newUser.role,
            education: newUser.education,
            sex: newUser.sex,
            age: Number(newUser.age),
            religion: newUser.religion,
            ethnicity: newUser.ethnicity,
            nationality: newUser.nationality,
            position: newUser.position,
            hometown: newUser.hometown,
            fngroupid: Number(newUser.fngroupid),
            relationship: newUser.relationship,
            department: newUser.department,
            index: userArr.length,
            status: newUser.status,
            office: newUser.office,
            twitter: newUser.twitter,
            linkedin: newUser.linkedin,
            facebook: newUser.facebook,
            extention: newUser.extention,
            matches: null
          });

          // save user
          createUser.save(function(err, newCreatedUser) {
            if (err) {
              console.error(err);
              res.status(500);
              res.json({
                'status': 500,
                'message': 'Internal Server Error'
              });
            } else {
              res.json(newCreatedUser);
            }
          });

        });

      }

    });

  },

  // update a user
  update: function(req, res) {

    // store information in newUser variable
    var updateUser = req.body.user;

    // check if user already exists
    User.findOne({ email: updateUser.email }, function(err, user) {

      // if error
      if (err) {
        console.error(err);
        res.status(500);
        res.json({
          'status': 500,
          'message': 'Internal Server Error'
        });
      }

      console.log(user);

      // if user exist, update
      if (user) {

        // update password and matches here...
        updateUser.index = user.index;
        delete updateUser._id;
        delete updateUser.__v;

        // insert curUser into mongoDB
        User.findOneAndUpdate({ email: user.email }, updateUser, { new: true, upsert: false }, function(err, updatedUser) {
          if (err) {
            console.error(err);
            res.status(500);
            res.json({
              'status': 500,
              'message': 'Internal Server Error'
            });
          } else {
            res.send(updatedUser); // send new user back
          }
        });

      // if user doesn't exist
      } else {
        res.status(404);
        res.json({
          'status': 404,
          'message': 'User does not exist.'
        });
      }

    });
  },

  // delete a user
  delete: function(req, res) {

    var id = req.params.id;
    var query = {};

    // get correct keys
    if (id.indexOf('@fiscalnote.com') >= 0) {
      query.email = id;
    } else {
      query.index = id;
    }

    // remove user
    User.remove(query, function(err, deleteUser) {
      if (err) {
        console.error(err);
        res.status(500);
        res.json({
          'status': 500,
          'message': 'Internal Server Error'
        });
      } else {
        res.json(deleteUser);
      }
    });

  }

}

module.exports = users;
