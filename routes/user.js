const express = require('express')
const router = express.Router()


const {newUser, getUsers, loginUser} = require('../controllers/userController')

router.route('/users').get(getUsers)
router.route('/user/new').post(newUser)
router.route('/user/login').post(loginUser)



module.exports = router