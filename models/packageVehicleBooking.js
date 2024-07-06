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
    primaryDriver: {
        type: mongoose.Types.ObjectId,
        ref: "driver",
    },
    secondaryDriver: {
        type: mongoose.Types.ObjectId,
        ref: "driver",
    },
    cleaner: {
        type: mongoose.Types.ObjectId,
        ref: "cleaner",
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
    instructions: {
        type: String
    },
    beforeJourneyPhotos: {
        type: Array,

    },
    beforeJourneyNote: {
        type: String,

    },
    afterJourneyPhotos: {
        type: Array,
    },
    afterJourneyNote: {
        type: String,
    },
    status: {
        type: String,
        enum: ["CREATED", "FINALIZED", "STARTED", "COMPLETED"]
    }
}, { timestamps: true });

const packageBooking = mongoose.model('packageBooking', packageBookingSchema);

module.exports = packageBooking;
