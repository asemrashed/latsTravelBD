const mongoose = require('mongoose');
const locations= require('./location')
const Spot = require('../model/format');

mongoose.connect('mongodb://127.0.0.1:27017/travel');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', async () => {
    console.log('database connected');
    
    // Call the seed function here
    await seed();
    db.close()
});

// Move the seed function outside the db.once block
const seed = async () => {
    try{ 
        await Spot.deleteMany({});
    for (let i = 0; i < 25; i++) {
        const random = Math.floor(Math.random() * locations.length);
        // const price= Math.floor(Math.random()*500)+10;
        const spot = new Spot({
            auther:'666039ee588a44800eb8f813',
            title: locations[random].spotName,
            location: locations[random].city,
            type: locations[random].type,
            geometry: { 
                type: 'Point',  
                coordinates: [
                    locations[random].longitude,
                    locations[random].latitude
                ] },
            // price,
            images:  [
                {
                  url: 'https://res.cloudinary.com/dpfedgpdk/image/upload/v1717951100/travelBD/kilxxu5metdsrd45o42r.jpg',
                  filename: 'travelBD/kilxxu5metdsrd45o42r'
                },
                {
                  url: 'https://res.cloudinary.com/dpfedgpdk/image/upload/v1717951100/travelBD/b9gru2iav4mjsorcixkq.jpg',
                  filename: 'travelBD/b9gru2iav4mjsorcixkq'
                }
              ]
        })
        await spot.save();
    }
    }catch(err){
        console.error('error during seeding', err)
    }
    
};
