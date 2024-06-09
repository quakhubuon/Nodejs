const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, min: 1 }
});

module.exports = mongoose.model('CartItem', CartItemSchema);
