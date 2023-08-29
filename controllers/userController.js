const User = require('../models/user')
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
// Create New User

exports.newUser =catchAsyncError( async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser) {
        return next(new ErrorHandler('Email already exist', 400))

        }
        const user = await User.create({
            name,
            email,
            password,
        });
        const token = user.getJwtToken()
        res.status(201).json({
            success: true,
            token
        });
    } catch (error) {
      
        next(error);
    }
});

// User login 

exports.loginUser = catchAsyncError(async(req,res,next) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new ErrorHandler('Enter email and password', 400))
    }

    const user = await User.findOne({email}).select('+password')
    if(!user) {
        return(next(new ErrorHandler('Invalid Emial or Password', 401)))
    }

    const isPassowrdMatched = await user.comparePassword(password)
    if(!isPassowrdMatched) {
        return(next(new ErrorHandler('Invalid Emial or Password', 401)))
    }

    const token = user.getJwtToken();
    res.status(200).json({
        success: true,
        token

    })
})

exports.getUsers = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "This is dummy route"
    })
}