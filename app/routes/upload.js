// upload.js

const multer = require('multer');

// Định nghĩa nơi lưu trữ và cách đặt tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './app/assets/images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Cấu hình bộ lọc tệp và giới hạn kích thước tệp
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // Chỉ cho phép tải lên định dạng png và jpg
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});

module.exports = upload;
