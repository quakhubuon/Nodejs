const mongoose = require('mongoose');
const Category = require('../models/Category');

// Test function
exports.test = (req, res) => {
    res.send('Greetings from the Test controller!');
};

// Lấy tất cả categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Lấy category theo ID
exports.getIDCategories = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra và chuyển đổi ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Thêm category mới
exports.addCategory = async (req, res) => {
    try {
        const { CategoryName, Description, Status } = req.body;
        const Picture = req.file ? req.file.originalname : null; // Lấy tên của hình ảnh đã upload

        // Tạo category mới
        const newCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            CategoryName,
            Status,
            Description,
            Picture
        });

        // Lưu category vào database
        await newCategory.save();

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { CategoryName, Description, Status } = req.body;
        let Picture; // Khai báo biến Picture ở ngoài để có thể sử dụng ở cả hai khối if-else

        if (req.file) {
            Picture = req.file.originalname; // Nếu có, sử dụng tên của hình ảnh mới
        }

        // Tìm và cập nhật category trong database
        let updatedCategory;
        if (Picture) {
            updatedCategory = await Category.findByIdAndUpdate(id, { CategoryName, Description, Picture, Status }, { new: true });
        } else {
            updatedCategory = await Category.findByIdAndUpdate(id, { CategoryName, Description, Status }, { new: true });
        }

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Xóa category từ database
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully', category: deletedCategory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

