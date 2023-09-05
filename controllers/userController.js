const User = require('../models/user')
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const sendToken = require('../utils/jwtToken')
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

  exports.updateAvatar = catchAsyncError(async (req, res, next) => {
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



// Forgot password 

exports.forgotPassword = catchAsyncError(async(req,res,next)=> {
    const user = await User.findOne({email: req.body.email})

    if(!user) {
        return next(new ErrorHandler('User Not found', 404))
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const message = ` Your password reset token is as follow:\n\n${resetUrl}
    \n\nIf you have not requested, so ignore this mail`

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Recovery Mail",
            message
        })
        res.status(200).json({
            success: true,
            message:`Email sent to ${user.email}`
        })
    }
    catch(error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message, 500))

    }   

    
})


// Reset Password

exports.resetPassword = catchAsyncError(async (req,res,next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire :{$gt : Date.now()}
    })

    if(!user) {
        return next(new ErrorHandler('Password Reset Token is invalid or has expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})

//update user password

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const user = await User.findById(req.params.id).select('+password');
      const isPassowrdMatched = await user.comparePassword(currentPassword)
      if(!isPassowrdMatched) {
        return(next(new ErrorHandler('Current Password is invalid', 401)))
    }
      if (newPassword !== confirmPassword) {
        return next(new ErrorHandler('New password and confirm password do not match', 400));
      }
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  });
  
