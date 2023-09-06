const express = require('express')
const router = express.Router()
const multer = require('multer');
const upload = multer(); 

const {newUser, getUsers, loginUser, deleteUser, getSingleUser, 
    updateDetails, updateAvatar, forgotPassword, resetPassword, updatePassword,
    updateBehavior,
} = require('../controllers/userController')

router.route('/users').get(getUsers)
router.route('/user/delete/:id').delete(deleteUser)
router.route('/user/get/:id').get(getSingleUser)
router.route('/user/update/:id').put(updateDetails)
router.route('/user/new').post(newUser)
router.route('/user/login').post(loginUser)
router.post('/user/upload-avatar/:id', upload.single('image'), updateAvatar);
router.route('/password/forgot').post(forgotPassword)
router.route('/password/update/:id').put(updatePassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/update/behavior/:id').put(updateBehavior)







module.exports = router