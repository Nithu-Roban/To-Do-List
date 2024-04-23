

const mongoose = require('mongoose');

// Define the user schema
const ToDoSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.ObjectId, required: true, unique: true},
    task: {type: String, required: true},
    desc: {type: String, required: true},
    status:{type: String, required: true},
    date: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});

// Create a model from the schema
const ToDo = mongoose.model('ToDo', ToDoSchema);

module.exports = ToDo;
