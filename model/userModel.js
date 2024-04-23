

const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true },
    uname: {type: String,required: true,unique: true},
    pass: {type: String, required: true},
    date: { type: Date, default: Date.now }
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
