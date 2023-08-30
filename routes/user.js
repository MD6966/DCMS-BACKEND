const express = require('express')
const router = express.Router()


const {newUser, getUsers, loginUser, deleteUser, getSingleUser, updateDetails} = require('../controllers/userController')

router.route('/users').get(getUsers)
router.route('/user/delete/:id').delete(deleteUser)
router.route('/user/get/:id').get(getSingleUser)
router.route('/user/update/:id').put(updateDetails)
router.route('/user/new').post(newUser)
router.route('/user/login').post(loginUser)




module.exports = router