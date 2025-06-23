if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));

app.engine("ejs" , ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

main()
.then((res)=>{
    console.log("conected")
})
.catch((err)=>{
    console.log(err)
});

async function main(){
    const dbUrl = process.env.ATLASDB_URL;
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600

})

store.on("error" , (err)=>{
    console.log("Error in Mongo Session Store" , err);
})

const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*60*60*24*3,
        maxAge : 7 * 60*60*24*3,
        httpOnly : true
    }
};

/*app.get("/", (req,res)=>{
    res.send("Hello this is root");
}); */



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); /*  "Hey, when the time comes and a login request happens, use this method to check if the user is valid.   */

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

/*app.get("/demoUser" , async(req,res)=>{
    let fakeUser = new User({
        email : "abcd@gmail.com",
        username : "test user"
    })
    const registeredUser = await User.register(fakeUser , "helloWorld");
    res.send(registeredUser);
}) */

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);

 app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use((err,req,res,next)=>{
    let {statusCode =500, message="Something went wrong"} = err;
    res.render("error.ejs" , {message});
    //res.status(statusCode).send(message); 
 })

app.all('/{*any}', (err,req, res, next) => {
    // You can call next with an error or handle 404
    let {statusCode =500, message="Page not Found"} = err;
    res.render("error.ejs" , {message});
});


app.listen(8080 , ()=>{
    console.log("Listening");
});
