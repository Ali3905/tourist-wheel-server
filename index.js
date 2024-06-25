const express = require("express")
const cors = require("cors")
require("dotenv").config()

const driverRoute = require("./routes/driver")
const cleanerRoute = require("./routes/cleaner")
const employeeRoute = require("./routes/employee")
const vehicleInspectionRoute = require("./routes/vehicleInspection")
const authRoute = require("./routes/user")
const technicianRoute = require("./routes/technician")
const dailyRouteRoute = require("./routes/dailyRoute")
const vehicleRoute = require("./routes/vehicle")
const packageBookingRoute = require("./routes/packageBooking")

const { connectToMongo } = require("./connections")

const PORT = process.env.PORT || 5000
const app = express()
connectToMongo(process.env.MONGO_URL)
.then(console.log("Mongo Connected"))
.catch(err => console.log(err.message))

app.use(express.urlencoded({extended :false}))
app.use(express.json())
app.use(cors())

// For Testing
app.get("/", (req, res)=>{
    res.send("Home page of tourist wheel")
})

// Routes
app.use("/api/driver", driverRoute);
app.use("/api/cleaner", cleanerRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/vehicleInspection", vehicleInspectionRoute);
app.use("/api/user", authRoute);
app.use("/api/technician", technicianRoute);
app.use("/api/dailyRoute", dailyRouteRoute);
app.use("/api/vehicle", vehicleRoute);
app.use("/api/packageBooking", packageBookingRoute)



app.listen(PORT, ()=>{
    console.log("Server is running on " + PORT);
})




