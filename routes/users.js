const express = require('express');
const router = express.Router();
const User = require('../model/user');
const users= require('../controllers/users')
const errAsync = require('../util/asyncError');
const passport= require('passport')

router.route('/register')
    .get( users.renderRegister)
    .post( errAsync(users.registered));

router.route('/login')
    .get( users.renderLogin)

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    keepSessionInfo:true
}),users.authenticate)

router.get('/logout', users.logout);

module.exports = router;
 