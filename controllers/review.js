const Listings = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.reviewController = async(req,res,next)=>{
    
    let {id} = req.params;
    let listing = await Listings.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);

    await review.save();
    await listing.save();

    console.log("review saved");
    req.flash("success" , "New Review has been added!")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteController = async(req,res,next)=>{
    let {id , review_id} = req.params;
    
    await Listings.findByIdAndUpdate(id , {$pull : {reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("deleted" , "Review has been Deleted")
    res.redirect(`/listings/${id}`);
}