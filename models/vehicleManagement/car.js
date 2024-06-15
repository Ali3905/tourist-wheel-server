const mongoose = require("mongoose")

const carSchema = mongoose.Schema({
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
    vehicleLocation: {
        type: String,
        required: true
    },
    carName: {
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

const car = mongoose.model("car", carSchema)
module.exports = car