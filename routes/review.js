const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listings = require("../models/listings.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const {reviewController, deleteController} = require("../controllers/review.js");

//Reviews
//POST Route
router.post("/" ,isLoggedIn,validateReview, wrapAsync(reviewController));

//Delete Route
router.delete("/:review_id" ,isLoggedIn,isReviewAuthor, wrapAsync(deleteController))

module.exports = router;