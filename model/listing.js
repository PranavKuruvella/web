const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema; // ✅ Corrected uppercase Schema

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://source.unsplash.com/600x400/?nature,landscape", // ✅ Fixed Unsplash URL
        set: (v) => v === "" ? "https://source.unsplash.com/600x400/?nature,landscape" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
