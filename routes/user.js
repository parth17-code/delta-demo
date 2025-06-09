const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");
const {getSignUp, postSignUp, getLogIn, postLogIn, getLogOut} = require("../controllers/user.js")

router.route("/signup")
.get(getSignUp)
.post(saveRedirectedUrl , wrapAsync(postSignUp))

router.route("/login")
.get(getLogIn)
.post(saveRedirectedUrl,passport.authenticate('local' , {failureRedirect: "/login" , failureFlash:true}) , postLogIn)

router.get("/logout" ,getLogOut)

module.exports = router;
