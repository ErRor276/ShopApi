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

// static method to check item stock
itemSchema.statics.checkStock = async function(item_code, amount) {
    if(amount > 0) {
        const item = await this.findOne({ item_code });
        if(item) {
            if(item.stock > 0) {
                if(item.stock >= amount) {
                    return item_code;
                }
                throw Error('stock is less than buying amount');
            }
            throw Error('stock is empty');
        }
        throw Error('item not found');
    }
    throw Error('buying amount is invalid');
};

// static method to sell item
itemSchema.statics.sellItem = async function(item_codes, amounts) {
    for(let i=0; i < item_codes.length; i++) {
        const item_code = item_codes[i];
        const amount = amounts[i] * -1;
        const result = await this.updateOne({ item_code }, { $inc: {stock: amount} });
        if(result.ok != 1) {
            throw Error('cannot update stock');
        }
    }
    return 1;
};

const Item = mongoose.model('item', itemSchema);

module.exports = Item;