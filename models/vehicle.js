const mongoose = require("mongoose")

const vehicleSchema = mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    seatingCapacity: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    bodyName: {
        type: String,
        required: true
    },
    chassIsBrand: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

    contactNumber: {
        type: String,
        required: true
    },
    photos: {
        type: [String]
    },
    isAC: {
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
    },
    type: {
        type: String,
        enum: ["CAR", "TRUCK", "BUS", "TAMPO"]
    }
}, { timestamps: true })

const vehicle = mongoose.model("vehicle", vehicleSchema)
module.exports = vehicle