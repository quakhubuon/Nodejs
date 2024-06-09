const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Order', OrderSchema);
