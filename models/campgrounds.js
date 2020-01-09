var mongoose = require("mongoose");
var Comment=require("./comment");
var campgroundSchema=new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    createdAt:{type: Date, default: Date.now},
    description:String,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }, username:String
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
module.exports = mongoose.model("Campground",campgroundSchema);