const express = require ('express')
const app = express()
const users = require('./routes/user')
const errorMiddleware = require('./middlewares/errors')

app.use(express.json())
app.use('/api/v1', users)
app.use(errorMiddleware)

module.exports = app