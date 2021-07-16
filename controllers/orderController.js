const Item = require('../models/item');
const Order = require('../models/order');

const handleErrors = (err) => {
    console.log(err);
    let errors = { 
        category_code: '', 
        item_count: '', 
        item: '', 
        item_code: '', 
        item_name: '',
        price: '', 
        stock: '', 
        name: '',
    };

    // item not found
    if (err.message === 'item not found') {
        errors.item = 'Item does not exist';
    }

    // duplicate email error
    if (err.code === 11000) {
      errors.duplication = 'that item is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('item validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

module.exports.order_post = async (req, res) => {
    const { delivery_info, receipt, confirmed, canceled } = req.body;
    let item_codes = [];
    let amounts = [];
    const { items } = receipt;
    
    try {
        for(let i=0; i < items.length; i++) {
            const { item_code, quantity } = items[i];
            const code = await Item.checkStock(item_code, quantity);
            item_codes.push(code);
            amounts.push(quantity);
        }
        const result = await Item.sellItem(item_codes, amounts);
        if(result) {
            const order = await Order.create({ delivery_info, receipt, confirmed, canceled });
            res.status(201).json({ order });
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.order_get_all = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json({ orders });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.order_get = async (req, res) => {
    const id = req.params.id;

    try {
        const order = await Order.findOne({ _id: id });
        res.status(200).json({ order });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.order_update = async (req, res) => {
    const id = req.params.id;
    const { customer_name, phone_no, address, appointed_time, note, confirm, cancel } = req.query;
  
    try {
        if(customer_name) {
            const order = await Order.findOne({ _id: id });
            if(order) {
                const delivery_info = order.delivery_info;
                delivery_info.customer_name = customer_name;
                const result = await Order.updateOne({ _id: id }, { delivery_info });
            }
        }
        if(phone_no) {
            const order = await Order.findOne({ _id: id });
            if(order) {
                const delivery_info = order.delivery_info;
                delivery_info.phone_no = phone_no;
                const result = await Order.updateOne({ _id: id }, { delivery_info });
            }
        }
        if(address) {
            const order = await Order.findOne({ _id: id });
            if(order) {
                const delivery_info = order.delivery_info;
                delivery_info.address = address;
                const result = await Order.updateOne({ _id: id }, { delivery_info });
            }
        }
        if(appointed_time) {
            const order = await Order.findOne({ _id: id });
            if(order) {
                const delivery_info = order.delivery_info;
                delivery_info.appointed_time = appointed_time;
                const result = await Order.updateOne({ _id: id }, { delivery_info });
            }
        }
        if(note) {
            const order = await Order.findOne({ _id: id });
            if(order) {
                const delivery_info = order.delivery_info;
                delivery_info.note = note;
                const result = await Order.updateOne({ _id: id }, { delivery_info });
            }
        }
        if(confirm) {
            const confirmVar = confirm == 0 ? false : true;
            const result = await Order.confirm(id, confirmVar);
        }
        if(cancel) {
            const cancelVar = cancel == 0 ? false : true;
            const result = await Order.cancel(id, cancelVar);
        }
        res.status(200).json({ success: 1 });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.order_delete = async (req, res) => {
    const id = req.params.id;
  
    try {
        const order = await Order.deleteOne({ _id: id });
        console.log(order);
        if(order) {
            res.status(200).json({ success: 1 });
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}