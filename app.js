const express = require ('express')
const app = express()
const cors = require('cors'); 
const users = require('./routes/user')
const behavior = require('./routes/behavior')
const errorMiddleware = require('./middlewares/errors')
const bodyparser = require('body-parser')
const cloudinary = require('cloudinary')

app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json())
app.use(cors());

// Set up cloudinary

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

app.use('/api/v1', users)
app.use('/api/v1', behavior )
app.use(errorMiddleware)

module.exports = app