const express= require('express')
const errAsync = require('../util/asyncError')
const appError = require('../util/appError')
const Spot= require('../model/format')
const Review= require('../model/review')
const {isLoggedIn,isReviewAuther,reviewValidate}= require('../middleware')
const reviews= require('../controllers/reviews')
const router= express.Router({ mergeParams: true}) // params are separeted in express(:id)



router.post('/',isLoggedIn, reviewValidate, errAsync(reviews.pushReview))

router.delete('/:reviewid',isLoggedIn,isReviewAuther, errAsync(reviews.deleteReview))

module.exports=router