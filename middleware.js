const Listings = require("./models/listings.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectedUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectedUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing  = await Listings.findById(id);
    if( !req.user || !listing.owner._id.equals(req.user._id)){
        req.flash("error" , "You do not have permission to acces this!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    console.log("BODY RECEIVED:", req.body);
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 , errorMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body , {abortEarly:false});
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400 , errorMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id , review_id} = req.params;
    let review = await Review.findById(review_id);
    if(!review.author._id.equals(req.user._id)){
        req.flash("error" , "You are NOT the author of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}