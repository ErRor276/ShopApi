const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema ({
    delivery_info: {
        customer_name: {
            type: String,
            required: [true, 'Please enter customer name']
        },
        phone_no: {
            type: String,
            required: [true, 'Please enter phone no.']
        },
        address: {
            type: String,
            required: [true, 'Please enter phone no.']
        },
        appointed_time: {
            type: Date,
            required: [true, 'Please enter appointed date and time']
            /* add a validator to check both date and time are present and the datetime is relevant */
        },
        note: {
            type: String
        }
    },
    receipt: {
        grand_total_price: {
            type: Number,
            required: [true, 'Cannot process grand total price']
        },
        items: [
            {
                item_code: {
                    type: String,
                    required: [true, 'There is no item code']
                },
                item_name: {
                    type: String,
                    required: [true, 'There is no item name']
                },
                quantity: {
                    type: Number,
                    required: [true, 'There is no item quantity']
                },
                price: {
                    type: Number,
                    required: [true, 'There is no item price']
                },
                options: [
                    {
                        name: {
                            type: String,
                            required: [true, 'There is no option name']
                        },
                        choice: {
                            type: String,
                            required: [true, 'There is no option choice']
                        }
                    }
                ],
                discount: {
                    discount_type: {
                        type: String,
                    },
                    discount_amount: {
                        type: Number,
                    }
                },
                total_price: {
                    type: Number,
                    required: [true, 'Cannot process total price']
                },
            }
        ],
        promo: {
            promo_code: {
                type: String
            },
            promo_discount: {
                type: Number
            }
        }
    },
    confirmed: {
        type: Boolean,
    },
    canceled: {
        type: Boolean,
    }
}, { timestamps: true });

const Order = mongoose.Model('order', orderSchema);

module.exports = Order;