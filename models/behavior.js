const mongoose = require('mongoose')

const behaviorSchema = new mongoose.Schema({

    firstname:{
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String,
    },
    zipcode: {
        type: String
    },
    images:[
        {
            public_id: {
                type: String,
                required: true
                        },
                        url: {
                            type: String,
                            required: true
                                    },
        }
    ],
    date: {
        type: Date,
    },
    time: {
        type: String, 
    },
    locationOfAction: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    }

})

module.exports = mongoose.model('Behavior', behaviorSchema)