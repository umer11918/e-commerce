const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:String,
    price:String,
    category:String,
    userId:String,
    company:String,
    images: [String] // Array of image filenames
});

module.exports = mongoose.model("products",productSchema);