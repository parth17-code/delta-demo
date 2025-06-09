const mongoose = require("mongoose");
const initdata = require("./data");
const Listings = require("../models/listings"); // when you want to require from another folder, first move out of curr folder with ..


main()
.then((res)=>{
    console.log("conected")
})
.catch((err)=>{
    console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Ventoura');
};

const initDB = async()=>{
    await Listings.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj, owner:'680db7b73652181a9d750144'})) //returns us a new array which we stored in same array
    await Listings.insertMany(initdata.data);
    console.log("DB was init");
};

initDB();