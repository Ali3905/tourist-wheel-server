const express = require("express")
const { upload } = require("../middlewares/upload")
const { handleCreateService } = require("../controllers/vehicleService")
const router = express.Router()

router.post("/", upload.fields([{ name: "bill", maxCount: 1 }]), handleCreateService)

module.exports = router