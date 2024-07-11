const express = require("express")
const cors = require("cors")
require("dotenv").config()
const data = require("./data")

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

// For Testing
app.get("/", async (req, res) => {
    try {
        const bulkOps = data.map(doc => ({
            insertOne: {
                document: doc
            }
        }));

        const result = await technician.bulkWrite(bulkOps);
        res.send(`Inserted ${result.insertedCount} documents successfully`);
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({error: err.message});
    }
    // res.send("Home page of tourist wheel")
})

// Routes
app.use("/api/driver", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), driverRoute);
app.use("/api/cleaner", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), cleanerRoute);
app.use("/api/employee", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), employeeRoute);
app.use("/api/vehicleInspection", vehicleInspectionRoute);
app.use("/api/user", authRoute);
app.use("/api/technician", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), technicianRoute);
app.use("/api/dailyRoute", dailyRouteRoute);
app.use("/api/vehicle", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), vehicleRoute);
app.use("/api/packageBooking", packageBookingRoute)
app.use("/api/service", serviceRoute)



app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
})




