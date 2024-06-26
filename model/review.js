const { required } = require('joi')
const mongoose= require('mongoose')
const {Schema}= mongoose

const reviewSchema= Schema({
    body: String,
    rating:Number,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})
const Review= mongoose.model('Review', reviewSchema)
module.exports= Review