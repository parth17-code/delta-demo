const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listings = require("../models/listings.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const {index , deleteController, showController, newController, createController, updateController , editController} = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//Create + Index route
router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(createController));

//New Route
router.get("/new" ,isLoggedIn ,newController)

//Update + Show Route
router.route("/:id")
.put(isLoggedIn,isOwner ,upload.single("listing[image]"),validateListing,wrapAsync(updateController))
.get(wrapAsync(showController))
.delete(isLoggedIn,isOwner,wrapAsync(deleteController));

//Edit Route
router.get("/:id/edit" ,isLoggedIn,isOwner,editController)

module.exports = router;