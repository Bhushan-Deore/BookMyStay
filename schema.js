const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    image: Joi.object({              // changed from string to object
      filename: Joi.string().allow("", null),
      url: Joi.string().allow("", null),
    }).optional(),                   // optional, defaults in Mongoose will apply
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required()
}).options({allowUnknown:true});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    username:Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});
