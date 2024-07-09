const express = require("express")
const { handleGetAllTechnicians, handleCreateTechnician, handleDeleteTechnician, handleUpdateTechnician, handleGetTechnicianById } = require("../controllers/technician")
const router = express.Router()

router.post("/", handleCreateTechnician)
router.get("/", handleGetAllTechnicians)
router.get("/:technicianId", handleGetTechnicianById)
router.delete("/", handleDeleteTechnician)
router.patch("/", handleUpdateTechnician)

module.exports = router