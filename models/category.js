const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema ({
    category_code: {
        type: String,
        unique: true,
        required: [true, 'Please enter category code']
    },
    category_name: {
        type: String,
        unique: true,
        required: [true, 'Please enter category name']
    },
    item_count: {
        type: Number
    }
});

// static method to generate item code for new item
categorySchema.statics.generateItemCode = async function(category_code) {
    const category = await this.findOne({ category_code });
    if (category) {
        return `${category.category_code}${category.item_count}`;
    }
    throw Error('category not found');
};

// static method to increase item count
categorySchema.statics.incrementItemCount = async function(category_code) {
    const res = await this.updateOne({ category_code }, {$inc: {item_count: 1}});
    if (res) {
        return res;
    }
    throw Error('cannot update item count');
};

// static method to decrease item count
categorySchema.statics.decrementItemCount = async function(category_code) {
    const res = await this.updateOne({ category_code }, {$inc: {item_count: -1}});
    if (res) {
        return res;
    }
    throw Error('cannot update item count');
};

const Category = mongoose.model('category', categorySchema);

module.exports = Category;