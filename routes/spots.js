const express = require('express');
const router = express.Router();
const Spot = require('../model/format');
const { isLoggedIn,spotValidate, isAuther } = require('../middleware');
const errAsync = require('../util/asyncError');
const appError = require('../util/appError');
const spots= require('../controllers/spots')
const {storage}= require('../cloudinary')
const multer= require('multer')
const upload= multer({storage: storage})

router.route('/')
    .get( spots.index)
    .post( isLoggedIn, upload.array('image'), spotValidate, errAsync(spots.createSpot));

router.get('/new', isLoggedIn, spots.renderNewSpot);

router.route('/:id')
    .get( errAsync(spots.detailsSpot))
    .put( isLoggedIn, isAuther, upload.array('image'), spotValidate, errAsync(spots.updateSpot))
    .delete( isLoggedIn, isAuther, errAsync(spots.deleteSpot));

router.get('/:id/edit', isLoggedIn,isAuther, errAsync(spots.renderEditSpot));


module.exports = router;
 