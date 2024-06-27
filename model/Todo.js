const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the project schema
const ToDoSchema = new mongoose.Schema({


    projectName: { type: String, required: true, unique:true },
    newTasks: [{
        task: { type: String, required: true },
        desc: { type: String, required: true },
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        updatedDate: { type: Date, default: Date.now }
    }]
});

// Create a model from the schema
const ToDo = mongoose.model('ToDo', ToDoSchema);

module.exports = ToDo;
