const Spot= require('../model/format')
const Review= require('../model/review')

module.exports.pushReview= async(req,res)=>{
    const spot=await Spot.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author= req.user._id
    spot.reviews.push(review)
    await spot.save()
    await review.save()
    res.redirect(`/spots/${spot._id}`)
}
module.exports.deleteReview= async(req,res)=>{
    const {id, reviewid}= req.params
    const review= await Review.findByIdAndDelete(reviewid)
    const spot= await Spot.findByIdAndUpdate(id,{$pull:{ review : reviewid} })
    res.redirect(`/spots/${id}`)
}