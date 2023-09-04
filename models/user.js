const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    residence : {
        type: String,
        // required:[true, 'Enter your residence'],
    },
    email: {
        type: String,
        required:[true, 'Enter your email'],
        unique: true,
        validate : [validator.isEmail, 'Enter Valid Email Address']
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    contact: {
        type: String
    },
    behavior: {
        type: String
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    avatar: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],

})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    } ) ;
}

// Generrate password reset token

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  
    return resetToken;
  };

module.exports = mongoose.model('User', userSchema)