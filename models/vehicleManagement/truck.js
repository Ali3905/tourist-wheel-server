const mongoose = require("mongoose")

const truckSchema = mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    NoOfTyres: {
        type: Number,
        required: true
    },
    TruckWeight: {
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
    isForRent: {
        type: Boolean,
        required: true
    },
    isForSell: {
        type: Boolean,
        required: true
    }

}, { timestamps: true })

const truck = mongoose.model("truck", truckSchema)
module.exports = truck






