const joi = require("joi")

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        country: joi.string().required(),
        location: joi.string().required(),
        image: joi.string().allow("", null),
        price: joi.number().min(0).required(),
    }).required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().max(5).min(1).optional(),
        comment: joi.string().required(),
    }).required()
})

