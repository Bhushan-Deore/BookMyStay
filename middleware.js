const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

//This Middleware check is user logged in ? if no its redirects to the login page.
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to proceed!");
        return res.redirect("/login");
    }
    next();
};

//its saves the url to the locals from which we redirected to login page. So it will help us to redirect to the previous one.
module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//checks current user is owner of listing or not. Helps to authorization while edit and delete.
module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner");
    if (!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error",`You don't have permission to Proceed! This Listing is Owned by ${listing.owner.username}`);
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewOwner = async(req,res,next)=>{
    let{id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (review.username !== res.locals.currUser.username){
        req.flash("error",`You don't have permission to Delete this review! This Review is Owned by ${review.username}`);
        return res.redirect(`/listings/${id}`);
    }
    next();
}