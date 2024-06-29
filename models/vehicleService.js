const mongoose = require("mongoose")

const serviceSchema = mongoose.Schema({
    garageName: String,
    garageNumber: String,
    date: Date,
    workDescription: String,
    bill: String
}, { timestamps: true })

const service = mongoose.model("service", serviceSchema)
module.exports = service