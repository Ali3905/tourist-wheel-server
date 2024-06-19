const express = require("express")
const { handleGetAllTechnicians, handleCreateTechnician, handleDeleteTechnician, handleUpdateTechnician } = require("../controllers/technician")
const router = express.Router()

router.post("/", handleCreateTechnician)
router.get("/", handleGetAllTechnicians)
router.delete("/", handleDeleteTechnician)
router.patch("/", handleUpdateTechnician)

module.exports = router