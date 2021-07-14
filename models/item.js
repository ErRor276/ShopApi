const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema ({
    item_code: {
        type: String,
        required: [true, 'Cannot process item code'],
        unique: true
    },
    item_name: {
        type: String,
        required: [true, 'Please enter item name']
    },
    category_code: {
        type: String,
        required: [true, 'Please choose a category']
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'Please enter a price']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter stock amount']
    },
    options: [
        {
            name: {
                type: String,
                required: [true, 'Please enter option name']
            },
            choices: [],
        }
    ],
    discount: {
        discount_type: {
            type: String,
        },
        discount_amount: {
            type: Number,
        }
    }
});

// static method to generate item code for new item
itemSchema.statics.getByItemCode = async function(item_code) {
    const item = await this.findOne({ item_code });
    if (item) {
        return item;
    }
    throw Error('item not found');
};

const Item = mongoose.model('item', itemSchema);

module.exports = Item;