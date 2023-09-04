const express = require('express')
const router = express.Router()
const multer = require('multer');
const upload = multer(); 

const {newUser, getUsers, loginUser, deleteUser, getSingleUser, updateDetails, updateAvatar} = require('../controllers/userController')

router.route('/users').get(getUsers)
router.route('/user/delete/:id').delete(deleteUser)
router.route('/user/get/:id').get(getSingleUser)
router.route('/user/update/:id').put(updateDetails)
router.route('/user/new').post(newUser)
router.route('/user/login').post(loginUser)
router.post('/user/upload-avatar/:id', upload.single('image'), updateAvatar);





module.exports = router