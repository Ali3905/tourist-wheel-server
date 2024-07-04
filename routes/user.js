const express = require("express")
const { handleSignUp, handleLogin, handleUpdateUser, handleGetUserById, handleGetUserByType } = require("../controllers/user")
const { handleGetUserByAuthToken } = require("../middlewares/auth")
const axios = require("axios")
const router = express.Router()

router.post("/", handleSignUp)
router.post("/login", handleLogin)
router.get("/", handleGetUserByAuthToken, handleGetUserById)
router.get("/:userType", handleGetUserByAuthToken, handleGetUserByType)
router.patch("/", handleGetUserByAuthToken, handleUpdateUser)


module.exports = router