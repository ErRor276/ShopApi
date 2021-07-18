const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema ({
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
    }
});

// fire a function before doc saved to db
adminSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    if(salt) {
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    throw Error('cannot encrypt the password');
  });
  
// static method to login admin
adminSchema.statics.login = async function(email, password) {
    const admin = await this.findOne({ email });
    if (admin) {
        const auth = await bcrypt.compare(password, admin.password);
        if (auth) {
          return admin;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('admin', adminSchema);

module.exports = User;