const mongoose = require('mongoose');


const dailyRouteVehicleSchema = new Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    otherVehicleNumber: {
        type: String,
        required: true,
        unique: true
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

    kmStarting :{
        type: String,
        required: true
    },
    perKmRateInINR :{
        type: Number,
        required: true
    },
    advanceAmountInINR :{
        type: Number,
        required: true
    },

    remainingAmountInINR :{         //both no and string
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
    TollInINR :{
        type: Number,
        required: true
    },
    otherStateTaxInINR :{  
        type: Number,
        required: true  
    },
    
    Note :{  
        type: String,
        required: true  
    },  
    instructions: {
        type: String
    }
}, {
    timestamps: true
});

const dailyRouteVehicle = mongoose.model('dailyRouteVehicle', dailyRouteVehicleSchema);

module.exports = dailyRouteVehicle;
