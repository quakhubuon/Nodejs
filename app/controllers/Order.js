const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        if (!req.session.cart || req.session.cart.items.length === 0) {
            return res.status(400).send('Cart is empty');
        }

        const { phone, address } = req.body;

        if (!phone || !address) {
            return res.status(400).send('Phone and address are required');
        }

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        const order = new Order({
            user: req.user._id,
            totalPrice: req.session.cart.totalPrice,
            phone: phone,
            address: address,
            deliveryDate: deliveryDate
        });

        await order.save();

        const orderDetails = req.session.cart.items.map(item => ({
            order: order._id,
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.UnitPrice
        }));

        await OrderDetail.insertMany(orderDetails);

        // Clear the cart after creating the order
        req.session.cart = { items: [], totalPrice: 0 };

        res.status(201).send(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        const orderDetails = await OrderDetail.find({ order: order._id }).populate('product');
        res.status(200).send({ order, orderDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
                const orderDetails = await OrderDetail.find({ order: order._id }).populate('product');
                return { order, orderDetails };
            })
        );
        res.status(200).send(ordersWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { phone, address, deliveryDate, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        if (phone) order.phone = phone;
        if (address) order.address = address;
        if (status) order.status = status;
        if (deliveryDate) order.deliveryDate = new Date(deliveryDate);

        await order.save();

        res.status(200).send(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        await OrderDetail.deleteMany({ order: order._id });
        await Order.findByIdAndDelete(id);

        res.status(200).send({ message: 'Order deleted successfully', order: order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

