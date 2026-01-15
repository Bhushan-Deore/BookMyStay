const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        _id: false,
        filename:
            {
                type: String,
                default: "listingimage",
            },
        url: {
                type: String,
                default: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                set: (v) => v === "" ? "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
            },
        
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category:[
        {
        type: String,
        enum:["room","iconic","mountains","castels","pools","camping","farms","sea","arctic","boating"],
        default:"room",
        }
    ]
});

// When a listing is deleted, delete its linked reviews
listingSchema.post("findOneAndDelete", async function(doc){
    if(doc?.reviews?.length){                               //Prevents unnecessary database queries for example if doc.reviews = []
    await Review.deleteMany({_id: {$in: doc.reviews}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;