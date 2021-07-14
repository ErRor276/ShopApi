const Category = require('../models/category');
const Item = require('../models/item');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { category_code: '', category_name: '', duplication: '', category: '' };

  // duplicate email error
  if (err.code === 11000) {
    errors.duplication = 'that category is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('category validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

module.exports.category_post = async (req, res) => {
    const { category_code, category_name } = req.body;

    try {
        const category = await Category.create({ category_code, category_name, item_count: 0 });
        if(category) {
            res.status(201).json({ category });
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.category_get_all = async (req, res) => {
    try {
        const categories = await Category.find({});
        if(categories) {
            res.status(200).json({ categories });
        }
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.category_get = async (req, res) => {
    const category_code = req.params.category_code;

    try {
        const category = await Category.findOne({ category_code });
        res.status(200).json({ category });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.category_update = async (req, res) => {
  const category_code = req.params.category_code;
  const { category_name } = req.body;

  try {
      const category = await Category.updateOne({ category_code }, { category_name });
      const success = category.ok;
      res.status(200).json({ success });
  }
  catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
  }
}

module.exports.category_delete = async (req, res) => {
  const category_code = req.params.category_code;

  try {
      let success = 0;
      const itemSuccess = await Item.deleteMany({ category_code });
      if(itemSuccess) {
        const result = await Category.deleteOne({ category_code });
        success = result.ok;
      }
      res.status(200).json({ success });
  }
  catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
  }
}
