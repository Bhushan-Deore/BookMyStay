const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,validateReview,isReviewOwner} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//Reviews POST Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Reviews Delete Route
router.delete("/:reviewId", isLoggedIn,isReviewOwner, wrapAsync(reviewController.deleteReview))

module.exports = router;