const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema ({
    category_code: {
        type: String,
        required: [true, 'Please enter category code']
    },
    category_name: {
        type: String,
        required: [true, 'Please enter category name']
    },
    item_count: {
        type: Number
    }
});

const Category = mongoose.Model('category', categorySchema);

module.exports = Category;