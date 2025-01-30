const mongoose = require("mongoose")
const initData = require('./data.js')
const Listing = require("../model/listing.js")
 

mongo_url = "mongodb://127.0.0.1:27017/wanderlust"

async function main() {
    await mongoose.connect(mongo_url)
}
main().then(() => {
    console.log(`connected to DB`);

}).catch(err => {
    console.log(err);
})

const initDb = async ()=>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data)
    console.log("sample 30 data was added");
};

initDb();