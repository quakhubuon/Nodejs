const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CategoryName: {type: String, required: true,unique: true, max: 100},
    Status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    Description: {type: String, required: false},
    Picture: {type: String, required: false},
});

// Export the model
module.exports = mongoose.model('categories', CategorySchema);
