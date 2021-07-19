const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, "Please enter a name"],
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: { 
          validator: isEmail, 
          message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Minimum password length is 6 characters"]
    },
    personal_info: {
        dob: String,
        linked_acc: String
    },
    delivery_info: {
        phone_no: String,
        address: String,
        note: String
    },
    wishlist: [{
        item_code: String
    }]
});

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    if(salt) {
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    throw Error('cannot encrypt the password');
  });
  
// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;