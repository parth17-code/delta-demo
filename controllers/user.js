const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");

module.exports.getSignUp = (req,res)=>{
    res.render("users/signUp.ejs");
}

module.exports.postSignUp = async(req,res)=>{
    try{
    let {username , password , email} = req.body;
    let newUser = new User({username ,email})
    const registeredUser = await User.register(newUser , password);
    req.login(registeredUser , (err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success" , "Welcome to Ventoura");
            let redirectUrl = res.locals.redirectedUrl || "/listings";
            res.redirect(redirectUrl);
        }
    })
    }
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

module.exports.getLogIn = async(req,res)=>{
    res.render("users/loginUser.ejs");
}

module.exports.postLogIn = async(req,res)=>{
    req.flash("success" , "Welcome to Ventoura!!")
    let redirectUrl = res.locals.redirectedUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.getLogOut =  (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next();
        }
        req.flash("success" , "You have successfully logged out!");
        res.redirect("/listings");
    })
}