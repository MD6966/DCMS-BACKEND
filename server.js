const app = require('./app')
const dotenv = require('dotenv')
const connectDataBase = require('./config/database')
dotenv.config({path:'backend/config/config.env'})
connectDataBase()
app.listen(process.env.PORT , () => {
    console.log(`Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})