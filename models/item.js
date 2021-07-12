const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema ({
    item_code: {
        type: String,
        required: [true, 'Cannot process item code']
    },
    item_name: {
        type: String,
        required: [true, 'Please enter item name']
    },
    category: {
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

const Item = mongoose.Model('item', itemSchema);

module.exports = Item;