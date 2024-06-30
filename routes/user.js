const express = require("express")
const { handleSignUp, handleLogin, handleUpdateUser, handleGetUserById } = require("../controllers/user")
const { handleGetUserByAuthToken } = require("../middlewares/auth")
const router = express.Router()

router.post("/", handleSignUp)
router.post("/login", handleLogin)
router.get("/", handleGetUserByAuthToken, handleGetUserById)
router.patch("/", handleGetUserByAuthToken, handleUpdateUser)

module.exports = router