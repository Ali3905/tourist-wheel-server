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
    bodyType: {
        type: String,
        required: true
    },
    chassisBrand: {
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

const truckSchema = mongoose.Schema({
    noOfTyres : {
        type : Number,
    },
    vehicleWeightInKGS : {
        type : Number,
    }
})

const carSchema = mongoose.Schema({
    name: {
        type: String,
    },
})

vehicleSchema.set("discriminatorKey", "type")

const vehicle = mongoose.model("vehicle", vehicleSchema)
const truck = vehicle.discriminator("TRUCK", truckSchema)
const car = vehicle.discriminator("CAR", carSchema)
const bus = vehicle.discriminator("BUS", vehicleSchema)
const tampo = vehicle.discriminator("TAMPO", vehicleSchema)

module.exports = {
    vehicle,
    truck,
    car
}