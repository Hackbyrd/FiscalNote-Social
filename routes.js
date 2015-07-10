/* Postman testing:
 * chrome-extension://fdmmgilgnpjigdojojpjoooidkmcomcm/index.html
 */

// require express and router
var express = require('express');
var router = express.Router();

// require controllers
var users = require('./controllers/users');
var pages = require('./controllers/pages');

// Page routes
router.get('/', pages.index);
router.get('/home', pages.home);
// router.get('/fnuser', pages.user);

// User routes
router.get('/users?', users.getAll);
router.get('/user/:id', users.getOne);
router.post('/user/', users.create);
router.put('/user/:_id', users.update);
router.delete('/user/:id', users.delete);

// Match routes

module.exports = router;
