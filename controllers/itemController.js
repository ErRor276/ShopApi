const Item = require('../models/item');
const Category = require('../models/category');

const handleErrors = (err) => {
    console.log(err.message, err.code);
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

module.exports.item_post = async (req, res) => {
    const { item_name, category_code, description, price, stock, options, discount } = req.body;

    try {
        if(category_code) {
            const item_code = await Category.generateItemCode(category_code);
            if(item_code) {
                const item = await Item.create({ 
                    item_code, 
                    item_name, 
                    category_code, 
                    description, 
                    price, stock, 
                    options, 
                    discount 
                });
                if(item) {
                    const itemCountIncreased = await Category.incrementItemCount(category_code);
                    if(itemCountIncreased) {
                        res.status(201).json({ item });
                    }
                }
            }
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.item_get_all = async (req, res) => {
    const category_code = req.query.category_code;
    try {
        const items = await Item.find(category_code ? {category_code} : {});
        if(items) {
            res.status(200).json({ items });
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.item_get = async (req, res) => {
    const item_code = req.params.item_code;
    try {
        const item = await Item.getByItemCode(item_code);
        if(item) {
            res.status(200).json({ item });
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.item_update = async (req, res) => {
    const { item_name, category_code, description, price, stock, options, discount } = req.body;
    const item_code = req.params.item_code;

    let updateItem = {
        item_code,
        item_name, 
        category_code, 
        description, 
        price, 
        stock, 
        options, 
        discount
    }

    try {
        const item = await Item.findOne({ item_code });
        if(item) {
            if(item.category_code != category_code) {
                const new_code = await Category.generateItemCode(category_code);
                if(new_code) {
                    const itemCountIncreased = await Category.incrementItemCount(category_code);
                    if(itemCountIncreased) {
                        const itemCountDecreased = await Category.decrementItemCount(item.category_code);
                        if(itemCountDecreased) {
                            updateItem.item_code = new_code;
                        }
                    }
                }
            }
            const success = await Item.updateOne({ item_code }, updateItem);
            if(success) {
                res.status(200).json({ success: 1 });
            }
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.item_delete = async (req, res) => {
    const item_code = req.params.item_code;
  
    try {
        const item = await Item.findOneAndDelete({ item_code });
        console.log(item);
        if(item) {
            const itemCountDecreased = await Category.decrementItemCount(item.category_code);
            if(itemCountDecreased) {
                res.status(200).json({ success: 1 });
            }
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
  }