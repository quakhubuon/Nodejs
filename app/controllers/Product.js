const mongoose = require('mongoose');
const Product = require('../models/Product');

// Test function
exports.test = (req, res) => {
    res.send('Greetings from the Test controller!');
};

// Lấy tất cả products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Lấy product theo ID
exports.getIDProducts = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra và chuyển đổi ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Thêm product mới
exports.addProduct = async (req, res) => {
    try {
        const { ProductName, CategoryID, Status, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued } = req.body;
        const Picture = req.file ? req.file.originalname : null;

        // Tạo sản phẩm mới
        const newProduct = new Product({
            _id: new mongoose.Types.ObjectId(),
            ProductName,
            CategoryID,
            Status,
            Picture,
            QuantityPerUnit,
            UnitPrice,
            UnitsInStock,
            UnitsOnOrder,
            ReorderLevel,
            Discontinued
        });

        // Lưu sản phẩm vào database
        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { ProductName, CategoryID, Status, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued } = req.body;
        let Picture; // Khai báo biến Picture để lưu tên ảnh mới (nếu có)

        // Kiểm tra xem có file ảnh mới được gửi lên không
        if (req.file) {
            Picture = req.file.originalname; // Nếu có, sử dụng tên ảnh mới
        }

        // Tìm và cập nhật sản phẩm trong database
        let updatedProduct;
        if (Picture) {
            updatedProduct = await Product.findByIdAndUpdate(
                id, 
                { ProductName, CategoryID, Status, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued, Picture }, 
                { new: true }
            );
        } else {
            updatedProduct = await Product.findByIdAndUpdate(
                id, 
                { ProductName, CategoryID, Status, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued }, 
                { new: true }
            );
        }

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Xóa category từ database
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
