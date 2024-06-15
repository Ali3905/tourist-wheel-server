const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        unique : true,
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
    }
}, { timestamps: true })

const user = mongoose.model("user", userSchema);
module.exports = user;