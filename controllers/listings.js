const Listing = require("../models/listing.js");
const cloudinary = require("../cloudConfig.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res) => {
    // 1. Create listing from form data
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // 2. Upload image to Cloudinary (if image exists)
    if (req.file) {
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: "BookMyStay",
                resource_type: "image",
                allowed_formats: ["jpg", "jpeg", "png", "webp"],
            }
        );

        // 3. Save image data in DB
        newListing.image = {
            url: result.secure_url,
            filename: result.public_id,
        };
    }

    // 4. Save listing
    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for, does not exists!");
        return res.redirect("/listings");        
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for, does not exists!");
        return res.redirect("/listings");        
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing  = await Listing.findByIdAndUpdate(id, { ...req.body.listing },{new:true});

    // if new image uploaded, update image field
    if (req.file) {
        // delete old image from cloudinary (if exists)
        if (listing.image?.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }

        //Upload New Image
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: "BookMyStay",
                resource_type: "image",
                allowed_formats: ["jpg", "jpeg", "png", "webp"],
            }
        );

        // save new image info
        listing.image = {
            url: result.secure_url,
            filename: result.public_id,
        };
        
        await listing.save();
      }
    req.flash("success","listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing Deleted!");
    res.redirect("/listings");
};