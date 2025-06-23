const Listings = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const allListings = await Listings.find({});
    res.render("listings/index.ejs" , {allListings}); // remember when you use res.render you are already inside views dont use /listings
}

module.exports.deleteController = async(req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listings.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("deleted" , "Listing has been Deleted");
    res.redirect("/listings");
}

module.exports.showController = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id).populate({path :"reviews" , populate:{path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error" , "This listing no longer exists");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs" ,{listing});
}

module.exports.newController = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createController = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
       
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success" , "new Listing Created");
   res.redirect("/listings");
    }

module.exports.updateController = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listings.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file!== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }

    req.flash("success" , "Listing Editted Successfully!");
    res.redirect(`/listings/${id}`);
}    

module.exports.editController = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    if(!listing){
        req.flash("error" , "This listing no longer exists");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs" ,{listing,originalImageUrl})
}