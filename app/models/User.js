const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Thêm dòng này để import thư viện bcryptj
const auth = require('../middleware/auth')

const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    role_ids: {
        type: [String],
        default: []
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});


userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    this.updated_at = Date.now();
    if (user.isModified('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 8)
    }
    next()
})

// Giới hạn số lượng token
const MAX_TOKENS = 3;

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    // Xóa các token cũ nếu vượt quá số lượng tối đa
    if (user.tokens.length >= MAX_TOKENS) {
        user.tokens.shift(); // Xóa token đầu tiên
    }
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model('users', userSchema);

module.exports = User;
