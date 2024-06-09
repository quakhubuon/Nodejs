
const mongoose = require('mongoose');
const categories = require('../models/Category')

const ProductSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ProductName: {
        type: String,
        unique: true,
        required: true
    },
    CategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    Status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    Picture: {
        type: String,
    },
    QuantityPerUnit: {
        type: String,
    },
    UnitPrice: {
        type: Number,
    },
    UnitsInStock: {
        type: Number,
    },
    UnitsOnOrder: {
        type: Number,
    },
    ReorderLevel: {
        type: Number,
    },
    Discontinued: {
        type: Boolean,
    }
});

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;
