const mongoose = require("mongoose")

const technicianSchema = mongoose.Schema({
    technicianType: {   //option  mechanical, electrician, psarepartshop, springwork, batterservices, vehiclebodyrepair
        type: String,
        enum: ["MECHANIC", "ELECTRICIAN", "SPAREPARTSHOP", "SPRINGWORK", "BATTERYSERVICES", "VEHICLEBODYREPAIR", "CRANESERVICES"],
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    alternateNumber: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ["ALL", "CAR", "BUS", "TRUCK", "TAMPO"],
        required: true
    }

}, { timestamps: true })

const technician = mongoose.model("technician", technicianSchema)
module.exports = technician