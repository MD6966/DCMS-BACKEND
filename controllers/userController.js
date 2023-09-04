const User = require('../models/user')
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

  exports.updateAvatar = catchAsyncError(async (req, res, next) => {
    console.log(req.file)
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }
  
      if (!req.file) {
        return next(new ErrorHandler('Avatar file missing', 400));
      }
  
      // Upload avatar to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.buffer);
  
      // Update user's avatar fields
      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        avatar: user.avatar,
      });
    } catch (error) {
      next(error);
    }
  });


// Create New User

exports.newUser =catchAsyncError( async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if(existingUser) {
        return next(new ErrorHandler('Email already exist', 400))

        }

        const user = await User.create(req.body);
        const token = user.getJwtToken()
        res.status(201).json({
            success: true,
            message: 'User Created Successfully'
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
        token,
        user

    })
})

// Get All users from DB

exports.getUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//Gwt Single User

exports.getSingleUser = catchAsyncError(async (req,res,next)=> {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
      res.status(200).json({
        success: true,
        user,
    });

})

//Update user details

exports.updateDetails = catchAsyncError(async(req,res,next)=> {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.residence = req.body.residence || user.residence;
    user.contact = req.body.contact || user.contact;
    user.behavior = req.body.behavior || user.behavior;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user,
    });
})


// Delete A user 

exports.deleteUser = catchAsyncError(async (req,res,next)=> {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
})



