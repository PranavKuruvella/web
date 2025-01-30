const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./model/listing.js')
const path = require('path')
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const expressError = require("./utils/expressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require('./model/review')

app.listen(8080, () => {
    console.log("listening at port 8080");

})
const validateLisitng = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new expressError(400, errMsg)
    } else {
        next()
    }
}
const validateReview = ((req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
});

mongo_url = "mongodb://127.0.0.1:27017/wanderlust"
async function main() {
    await mongoose.connect(mongo_url)
}
main().then(() => {
    console.log(`connected to DB`);

}).catch(err => {
    console.log(err);
})

app.get("/", (req, res) => {
    res.send("hii this is ROOT ")
})


app.set("view engine", "ejs") // for ejs
app.set("views", path.join(__dirname, "views")); // for ejs
app.use(express.urlencoded({ extended: true })) // for post req
app.use(methodOverride("_method")) //for put pathc delete req
app.engine('ejs', ejsMate); // for ejsmate
app.use(express.static(path.join(__dirname, "/public")))

//home route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})

//create route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

//new listings route
app.post('/listings', validateLisitng, wrapAsync(async (req, res, next) => {
    let newlisting = new Listing(req.body.listing)
    await newlisting.save()
    res.redirect("/listings")
}))

//show route 
// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render(`listings/edit.ejs`, { listing })
}))

//update route
app.put("/listings/:id", validateLisitng, wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)
}))

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let id = req.params.id
    let deleted = await Listing.findByIdAndDelete(id)
    console.log(deleted);
    res.redirect("/listings")
}))

//reviews route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params
    let { review } = req.body
    let newreview = new Review({
        comment: review.comment,
        rating: review.rating,
    })
    let listing = await Listing.findById(id)
    if (!listing) {
        throw new Error('listing not found')
    }
    if (!listing.reviews) {
        listing.reviews = []
    }
    listing.reviews.push(newreview)
    await listing.save()
    console.log(newreview);
    res.redirect(`/listings/${id}`)

}))

app.get("*", (req, res, next) => { // if user tries to access pages of no route
    next(new expressError(404, `Page not Found`))
})

// app.use((err, req, res, next) => {
//     let { message = `Somthing Went Wrong`, status = 500 } = err
//     res.render(`listings/error.ejs`, { message, status })
//     // res.send(message).status(status)
//     console.log(`There was an error`);
// })

// app.get("/testlisting",async (req, res) => {
//     testlisting = new Listing({
//         title : `my home`,
//         description : `near beach`,
//         price: 1200,
//         location:`vizag`,
//         country:`india`, 
//     })

//     await testlisting.save()
//     console.log("sample saved");
//     res.send("successful testing")
// })

