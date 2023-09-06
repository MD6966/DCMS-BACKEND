const catchAsyncError = require('../middlewares/catchAsyncError')
const Behavior = require('../models/behavior')
const User = require('../models/user')
// Create new behavior

exports.newBehavior = catchAsyncError(async(req,res,next)=> {
    // const behavior = await Behavior.create(req.body)
    const userId = req.params.id;
    const user = await User.findById(userId)
    const { firstname, email, address } = req.body;
    const newBehavior = new Behavior({
        firstname,
        email,
        address,
        id:userId
    })
    const savedBehavior = await newBehavior.save()
    console.log(savedBehavior)
    user.behavior.push(savedBehavior._id)

    res.status(201).json({
        success: true,
        user
        // behavior,
    })
})