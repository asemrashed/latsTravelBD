const express= require('express')
const Spot = require('./model/format');
const { spotSchema, reviewSchema } = require('./joiSchema');
const Review= require('./model/review')
const appError = require('./util/appError')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must log in first');
        return res.redirect('/login');
    }
    next();
};
module.exports.spotValidate = (req, res, next) => {
    const { error } = spotSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(',');
        throw new appError(errMsg, 400);
    } else {
        next();
    }
};
module.exports.isAuther= async(req,res,next)=>{
    const {id}= req.params;
    const spot= await Spot.findById(id);
    if(!spot){
        console.log(' spot not found in Author validation')
    }
    if(!spot.auther.equals(req.user._id)){
        req.flash('warning', 'You are not allow to do this')
        return res.redirect(`/spots/${id}`)
    }
    next()
}
module.exports.isReviewAuther= async(req,res,next)=>{
    const {id, reviewid}= req.params;
    const review= await Review.findById(reviewid);
    if(!review.author.equals(req.user._id)){
        req.flash('warning', 'You are not allow to do this')
        return res.redirect(`/spots/${id}`)
    }
    next()
}
module.exports.reviewValidate= (req,res,next)=>{
    const {error}= reviewSchema.validate(req.body)
    if(error){
        const errMsg= error.details.map(el => el.message).join(',')
        throw new appError(errMsg,500)
    }else{
        next() 
    }    
}