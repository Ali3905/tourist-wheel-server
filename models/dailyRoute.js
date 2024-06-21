const mongoose = require('mongoose');


const dailyRouteSchema = mongoose.Schema({
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref : "vehicle",
        required: true,
    },
    departurePlace: {
        type: String,
        required: true
    },
    destinationPlace: {
        type: String,
        required: true
    },
    primaryDriver: {
        type: mongoose.Types.ObjectId,
        ref: "driver",
        required: true
    },
    secondaryDriver: {
        type: mongoose.Types.ObjectId,
        ref: "driver",
        required: true
    },
    cleaner: {
        type: mongoose.Types.ObjectId,
        ref: "cleaner",
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },

    instructions: {
        type: String
    },
    beforeJourneyPhotos: {
        type: Array,

    },
    afterJourneyPhotos: {
        type: Array,
    },
    
}, { timestamps: true });

const dailyRoute = mongoose.model('dailyRoute', dailyRouteSchema);

module.exports = dailyRoute;
