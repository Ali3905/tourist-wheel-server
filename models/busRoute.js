const mongoose = require("mongoose")

const busRouteSchema = mongoose.Schema({
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref: "vehicle"
    },
    officeAddress: String,
    discount: Number,
    agencyName: String,
    departurePlace: String,
    destinationPlace: String,
    departureTime: Date,
    arrivalTime: Date,
    pickupPoint: String,
    dropoffPoint: String,
    ticketFare: Number,
    busPhotos: [String],
    isAC: Boolean,
    isSleeper: Boolean,
    amenities: [String],
    doesCarryTwoWheelers: Boolean,
    doesProvideCourierService: Boolean,
    doesBookTrainTickets: Boolean,
    phonepeNumber: String,
    phonepeName: String,
    QR: String,
    seatingArrangement: String,
    
}, { timestamps: true })


const busRoute = mongoose.model("busRoute", busRouteSchema)
module.exports = busRoute