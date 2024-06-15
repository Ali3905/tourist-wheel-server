const express = require("express")
const { handleGetAllTechnicians, handleCreateTechnician, handleDeleteTechnician } = require("../controllers/technician")
const router = express.Router()

router.post("/", handleCreateTechnician)
router.get("/", handleGetAllTechnicians)
router.delete("/", handleDeleteTechnician)

module.exports = router