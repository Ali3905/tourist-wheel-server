const mongoose = require("mongoose")

const technicianSchema = mongoose.Schema({
    technicianType: {   //option  mechanical, electrician, psarepartshop, springwork, batterservices, vehiclebodyrepair
        type: String,
        enum: ["MECHANIC", "ELECTICIAN", "SPAREPARTSHOP", "SPRINGWORK", "BATTERYSERVICES", "VEHICLEBODYREPAIR"],
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
        enum: ["ALL", "CAR", "BUS", "TRUCK"],
        required: true
    }

}, { timestamps: true })

const technician = mongoose.model("technician", technicianSchema)
module.exports = technician






