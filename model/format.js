const mongoose= require('mongoose')
const Review= require('./review')
const Schema= mongoose.Schema;

//https://res.cloudinary.com/dpfedgpdk/image"/upload/v_300/"v1717951100/travelBD/b9gru2iav4mjsorcixkq.jpg'
const imageSchema= new Schema({
    url:String, 
    filename:String
})
imageSchema.virtual('thumbnail').get(function(){
    return `${this.url.replace('/upload', '/upload/w_350')}` // for resizing,, 
})  // it will not take any space in DB. its just compressing size.

const opts = { toJSON: { virtuals: true } };

const travelSchema= new Schema({
    title:String,
    images:[imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price:Number,
    type:String,
    location:String,
    auther:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
}, opts)


travelSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/spots/${this._id}">${this.title}</a><strong>
    <p>${this.type}</p>`
});


travelSchema.post('findOneAndDelete', async(doc)=>{
    // await Review.deleteMany({_id: {$in: spot.reviews}})
    if(doc){            // same thing 
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Spot', travelSchema)
  