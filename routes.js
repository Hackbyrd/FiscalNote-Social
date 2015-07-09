/* Postman testing:
 * chrome-extension://fdmmgilgnpjigdojojpjoooidkmcomcm/index.html
 */

// require express and router
var express = require('express');
var router = express.Router();

// require models
var users = require('./controllers/users');

// home page
router.get('/', function(req, res) {
  console.log('Home')
  res.render('index.ejs', {
    title: "FiscalNote Social",
    name: 'Jonathan' // change later
  });
});

// User routes
router.get('/users?', users.getAll);
router.get('/user/:id', users.getOne);
router.post('/user/', users.create);
router.put('/user/:_id', users.update);
router.delete('/user/:id', users.delete);

// Match routes

module.exports = router;
