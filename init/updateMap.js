const mongoose = require('mongoose');
const Listings = require('../models/listings');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require('dotenv').config({ path: __dirname + '/../.env' });

console.log(process.env.MAP_TOKEN);
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

async function updateAllListingsGeometry() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Ventoura');

  const allListings = await Listings.find({});  // get all listings

  for (const listing of allListings) {
    try {
      const response = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
      }).send();

      const geometry = response.body.features[0].geometry;

      if (geometry) {
        listing.geometry = geometry;
        await listing.save();
        console.log(`Updated geometry for listing ${listing._id}`);
      } else {
        console.warn(`No geometry found for listing ${listing._id} (location: "${listing.location}")`);
      }
    } catch (err) {
      console.error(`Error updating listing ${listing._id}:`, err);
    }
  }

  console.log('All listings processed.');
  mongoose.connection.close();
}

updateAllListingsGeometry();
