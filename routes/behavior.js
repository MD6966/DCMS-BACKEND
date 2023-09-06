const express = require('express')
const router = express.Router()

const {newBehavior} = require('../controllers/behaviorController')

router.route('/new-behavior/:id').post(newBehavior)

module.exports = router