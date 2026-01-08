const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const upload = require("../utils/multer.js");

// Index Route
router.get("/", wrapAsync(listingController.index));

//New Listing Route
router.get("/new", isLoggedIn,listingController.renderNewForm);

//Create new listing in DB-Route
router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing));

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//Update Route in DB
router.put("/:id", isLoggedIn,isOwner,upload.single('listing[image]'), validateListing,wrapAsync(listingController.editListing));

//Delete Listing Route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;