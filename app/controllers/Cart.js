const mongoose = require('mongoose');
const Product = require('../models/Product');

// Test function
exports.test = (req, res) => {
    res.send('Greetings from the Test controller!');
};

exports.addToCart = async (req, res) => {
    try {
        const product = await Product.findById(req.body.productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        if (!req.session.cart) {
            req.session.cart = { items: [], totalPrice: 0 };
        }

        const quantity = Number(req.body.quantity) || 1;  // Nếu không có quantity, đặt mặc định là 1

        const existingItemIndex = req.session.cart.items.findIndex(item => item.product._id.toString() === product._id.toString());

        if (existingItemIndex > -1) {
            req.session.cart.items[existingItemIndex].quantity += quantity;
        } else {
            req.session.cart.items.push({
                product: product,
                quantity: quantity
            });
        }

        req.session.cart.totalPrice += product.UnitPrice * quantity;

        res.status(201).send(req.session.cart);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

exports.getCart = (req, res) => {
    try {
        if (!req.session.cart) {
            return res.status(200).send({ items: [], totalPrice: 0 });
        }
        res.send(req.session.cart);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

exports.updateCartItemQuantity = async (req, res) => {
    try {
        const productId = req.body.productId;
        const newQuantity = Number(req.body.quantity);

        if (!productId || newQuantity === undefined) {
            return res.status(400).send('Product ID and new quantity are required');
        }

        if (!req.session.cart) {
            return res.status(404).send('Cart not found');
        }

        const existingItemIndex = req.session.cart.items.findIndex(item => item.product._id.toString() === productId);

        if (existingItemIndex === -1) {
            return res.status(404).send('Product not found in cart');
        }

        const existingItem = req.session.cart.items[existingItemIndex];

        // Tính toán sự chênh lệch giá trị
        const quantityDifference = newQuantity - existingItem.quantity;
        const priceDifference = quantityDifference * existingItem.product.UnitPrice;

        // Cập nhật số lượng sản phẩm
        existingItem.quantity = newQuantity;

        // Nếu số lượng sản phẩm bằng 0 hoặc ít hơn, xóa sản phẩm khỏi giỏ hàng
        if (existingItem.quantity <= 0) {
            req.session.cart.items.splice(existingItemIndex, 1);
        }

        req.session.cart.totalPrice += priceDifference;

        // Nếu không còn sản phẩm nào trong giỏ hàng, đặt lại tổng giá trị giỏ hàng về 0
        if (req.session.cart.items.length === 0) {
            req.session.cart.totalPrice = 0;
        }

        res.status(200).send(req.session.cart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.clearCart = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            }
            res.status(200).send('Cart cleared');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};
