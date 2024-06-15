const mongoose = require("mongoose")

const driverSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email : {
        type : String,
        required : true
    },
    
    password: {
        type: String,
        required: true
    },
    driverType: {
        type: String,
        enum: ["ALL", "CAR", "BUS", "TRUCK"]
    },
    mobileNumber: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    
    state: {
        type: String
    },
    village : {
        type : String,
        required : true
    },
    aadharCard: {
        type: String
    },
    license: {
        type: String
    },
    photo: {
        type: String
    }
}, { timestamps: true })

const driver = mongoose.model("driver", driverSchema)
module.exports = driver