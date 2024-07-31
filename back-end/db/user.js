const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    name: { type: String, unique: true, required: true },  // Ensure name is unique and required
    email: { type: String, unique: true, required: true }, // Ensure email is unique and required
    password: { type: String, required: true },             // Ensure password is required
    image: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' } // Default role is 'user'

});

module.exports =mongoose.model("users",userSchema);