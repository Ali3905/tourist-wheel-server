const mongoose = require('mongoose');


const dailyRouteSchema = mongoose.Schema({
    vehicleNumber: {
        type: String,
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
        ref : "driver",
        required: true
    },
    secondaryDriver: {
        type: mongoose.Types.ObjectId,
        ref : "driver",
        required: true
    },
    cleaner: {
        type: mongoose.Types.ObjectId,
        ref : "cleaner",
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },

    instructions: {
        type: String
    }
}, { timestamps: true });

const dailyRoute = mongoose.model('dailyRoute', dailyRouteSchema);

module.exports = dailyRoute;
