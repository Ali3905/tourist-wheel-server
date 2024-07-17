const express = require("express")
const cors = require("cors")
require("dotenv").config()
const data = require("./data")
const subscriptionCronJob = require("./cron/subscription")

const driverRoute = require("./routes/driver")
const cleanerRoute = require("./routes/cleaner")
const employeeRoute = require("./routes/employee")
const vehicleInspectionRoute = require("./routes/vehicleInspection")
const authRoute = require("./routes/user")
const technicianRoute = require("./routes/technician")
const dailyRouteRoute = require("./routes/dailyRoute")
const vehicleRoute = require("./routes/vehicle")
const packageBookingRoute = require("./routes/packageBooking")
const serviceRoute = require("./routes/vehicleService")
const subscriptionRoute = require("./routes/subscription")

const { handleGetUserByAuthToken, handleAuthorizeUserByRole } = require("./middlewares/auth")
const { connectToMongo } = require("./connections")
const technician = require("./models/technician")

const PORT = process.env.PORT || 5000
const app = express()
connectToMongo(process.env.MONGO_URL)
    .then(console.log("Mongo Connected"))
    .catch(err => console.log(err.message))


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const SMARTPING_API_KEY = 'your-smartping-api-key';
const SMARTPING_API_URL = 'https://api.smartping.io/send-otp';

// For Testing
app.get("/", async (req, res) => {
        res.send("Home page of tourist wheel")
})

app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const response = await axios.post(SMARTPING_API_URL, {
            apiKey: SMARTPING_API_KEY,
            phone: phoneNumber
        });

        if (response.data.success) {
            res.status(200).json({ message: 'OTP sent successfully.' });
        } else {
            res.status(500).json({ message: 'Failed to send OTP.' });
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP.' });
    }
});


// Routes
app.use("/api/driver", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), driverRoute);
app.use("/api/cleaner", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), cleanerRoute);
app.use("/api/employee", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), employeeRoute);
app.use("/api/vehicleInspection", vehicleInspectionRoute);
app.use("/api/user", authRoute);
app.use("/api/technician", handleGetUserByAuthToken, technicianRoute);
app.use("/api/dailyRoute", dailyRouteRoute);
app.use("/api/vehicle", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), vehicleRoute);
app.use("/api/packageBooking", packageBookingRoute)
app.use("/api/service", serviceRoute)
app.use("/api/subscription", subscriptionRoute)




app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
    subscriptionCronJob()
})




