const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    whatsappNumber: {
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
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["ADMIN", "AGENCY"]
    },
    drivers: {
        type: [{ type: mongoose.Types.ObjectId, ref: "driver" }],
    },
    employees: {
        type: [{ type: mongoose.Types.ObjectId, ref: "employee" }],
    },
    technicians: {
        type: [{ type: mongoose.Types.ObjectId, ref: "technician" }],
    },
    cleaners: {
        type: [{ type: mongoose.Types.ObjectId, ref: "cleaner" }],
    },
    vehicles: {
        type: [{ type: mongoose.Types.ObjectId, ref: "vehicle" }],
    },
    dailyRoutes: {
        type: [{ type: mongoose.Types.ObjectId, ref: "dailyRoute" }],
    },
    packageBookings: {
        type: [{ type: mongoose.Types.ObjectId, ref: "packageBooking" }],
    },
    services: {
        type: [{ type: mongoose.Types.ObjectId, ref: "service" }],
    }
}, { timestamps: true })

const agencySchema = mongoose.Schema({
    isSubsciptionValid: {
        type: Boolean,
        default: false
    },
    subscription: {
        type: mongoose.Types.ObjectId,
        ref: 'subscription',
    },
    // razorpayCustomerId: String,
})

userSchema.set("discriminatorKey", "type")

const user = mongoose.model("user", userSchema);
const agency = user.discriminator("AGENCY", agencySchema)
const admin = user.discriminator("ADMIN", userSchema)

module.exports = {
    user,
    agency
}