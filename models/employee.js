const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },

    employeeType: {
        type: String,
        enum: ["MANAGER", "CLEANER", "OFFICE-BOY", "ACCOUNTANT", "TELECALLER"]
    },
    aadharCard: {
        type: String
    },
    photo: {
        type: String
    }
    
}, { timestamps: true })

const employee = mongoose.model("employee", employeeSchema)
module.exports = employee


