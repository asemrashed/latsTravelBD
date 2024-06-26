const Spot= require('../model/format')
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const {cloudinary}= require('../cloudinary')

module.exports.index =async (req, res) => {
    const spot = await Spot.find({});
    res.render('pages/spots', { spot });
}

// amount & size of image will defined,,, not right now 
module.exports.renderNewSpot=(req, res) => {
    res.render('pages/new');
}

module.exports.createSpot= async (req, res) => {
    try{
        const geoData = await maptilerClient.geocoding.forward(req.body.spot.location, { limit: 1 });
        if (geoData.features.length === 0) {
            req.flash('error', 'Location not found. Please try again.');
            return res.redirect('/spots/new');
        }
        // const coordinates = geoData.features[0].geometry.coordinates;
        const spot = new Spot(req.body.spot);
        spot.geometry =  geoData.features[0].geometry;

        spot.images= req.files.map(f =>({ url: f.path, filename: f.filename}))
        spot.auther= req.user._id
        await spot.save();
        req.flash('success', 'Successfully made a new spot!');
        res.redirect(`/spots/${spot._id}`);
    }catch(err){
        console.log(err)
        req.flash('error', 'not able to creat Spot')
        res.redirect('/spots/new')
    }
}

module.exports.detailsSpot= async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id)
        .populate({
            path:'reviews',
            populate:{
                path:'author'
            }
        })
        .populate('auther');
    if (!spot) {
        req.flash('error', 'Spot not found');
        return res.redirect('/spots');
    }
    res.render('pages/details', { spot });
}

module.exports.renderEditSpot= async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    res.render('pages/edit', { spot });
}

module.exports.updateSpot = async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot }, { new: true });
    const geoData = await maptilerClient.geocoding.forward(req.body.spot.location, { limit: 1 });
    spot.geometry = geoData.features[0].geometry;
    const img= req.files.map( f=>({url: f.path, filename:f.filename}))
    spot.images.push(...img)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await spot.updateOne({ $pull:{images:{filename:{$in: req.body.deleteImages}}}})
    }
    await spot.save()  //findByID dilei hobe,,,,, then save..
    req.flash('success', 'Successfully updated spot!');
    res.redirect(`/spots/${spot._id}`);
}

module.exports.deleteSpot = async (req, res) => {
    const { id } = req.params;await Spot.findByIdAndDelete(id);
    req.flash('warning', 'Successfully deleted spot');
    res.redirect('/spots')
} 