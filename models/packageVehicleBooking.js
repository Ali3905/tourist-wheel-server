const mongoose = require('mongoose');


const packageBookingSchema = mongoose.Schema({
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref: "vehicle",
        required: true,
    },
    otherVehicle: {
        type: mongoose.Types.ObjectId,
        ref: "vehicle",
        required: true,
    },
    customerName: {
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

    kmStarting: {
        type: String,
        required: true
    },
    perKmRateInINR: {
        type: Number,
        required: true
    },
    advanceAmountInINR: {
        type: Number,
        required: true
    },

    remainingAmountInINR: {
        type: Number,
        required: true
    },

    advancePlace: {
        type: String,
        required: true
    },

    departurePlace: {
        type: String,
        required: true
    },
    destinationPlace: {
        type: String,
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    returnTime: {
        type: Date,
        required: true
    },
    tollInINR: {
        type: Number,
        required: true
    },
    otherStateTaxInINR: {
        type: Number,
        required: true
    },

    note: {
        type: String,
        required: true
    },
    instructions: {
        type: String
    }
}, { timestamps: true });

const packageBooking = mongoose.model('packageBooking', packageBookingSchema);

module.exports = packageBooking;
