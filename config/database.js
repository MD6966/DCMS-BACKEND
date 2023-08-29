const mongoose = require('mongoose')

const connectDataBase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log("DB connected Sucessfuly")
    })
}

module.exports = connectDataBase