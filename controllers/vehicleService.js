const { vehicle } = require("../models/vehicle")
const service = require("../models/vehicleService")

async function handleCreateService(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key][0].path; // Add the URL to req.body
                }
            });
        }
        console.log(req.files);
        const { garageName, garageNumber, date, workDescription, bill, vehicleNumeber } = req.body
        if (!vehicleNumeber) {
            return res.status(400).json({
                success: false,
                message: "Provide vehicleNumber to add service"
            })
        }
        console.log({garageName, garageNumber, date, workDescription, bill});
        if (!garageName || !garageNumber || !date || !workDescription || !bill) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        const createdService = await service.create({ garageName, garageNumber, date, workDescription, bill })
        await vehicle.findOneAndUpdate({ number: vehicleNumeber }, { $push: { services: createdService } }, { new: true })
        return res.status(201).json({
            success: true,
            data: createdService
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    handleCreateService
}