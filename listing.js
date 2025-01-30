const mongoose = require("mongoose")
const Review = require("./review.js")
const schema = mongoose.Schema

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-dirt-road-in-the-middle-of-a-forest-1b2uK_-uPIo",
        set: (v) => v === "" ? "https://unsplash.com/photos/a-dirt-road-in-the-middle-of-a-forest-1b2uK_-uPIo" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review', // Reference the Review model by its name as a string
        }
    ], 
})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing; // Remove the trailing period
