const mongoose = require("mongoose")

const busSchema = mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    seatingCapacity: {
        type: Number,
        required: true
    },
    vehicleModel: {
        type: String,
        required: true
    },
    vehicleBodyName: {
        type: String,
        required: true
    },
    chassisBrand: {
        type: String,
        required: true
    },
    vehicleLocation: {
        type: String,
        required: true
    },
    
    contactNumber: {
        type: String,
        required: true
    },
    VehiclePhoto: {
        type: String
    },
    isAC: {
        type: Boolean,
        required: true
    },
    isNonAC: {
        type: Boolean,
        required: true
    },
    isForRent: {
        type: Boolean,
        required: true
    },
    isForSell: {
        type: Boolean,
        required: true
    }

}, { timestamps: true })

const bus = mongoose.model("bus", busSchema)
module.exports = bus


