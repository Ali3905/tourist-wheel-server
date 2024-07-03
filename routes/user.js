const express = require("express")
const { handleSignUp, handleLogin, handleUpdateUser, handleGetUserById } = require("../controllers/user")
const { handleGetUserByAuthToken } = require("../middlewares/auth")
const axios = require("axios")
const router = express.Router()

router.post("/", handleSignUp)
router.post("/login", handleLogin)
router.get("/", handleGetUserByAuthToken, handleGetUserById)
router.patch("/", handleGetUserByAuthToken, handleUpdateUser)

router.post('/send-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    const apiKey = "NGU2NDYyNDc3NjU1NDM1MzZiMzc3MjQ4MzM3YTZmMzY=";
    const sender = 'TXTLC';
    const message = `Your OTP code is`;

    const url = `https://api.textlocal.in/send/`;

    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('numbers', [7249005806]);
    params.append('sender', sender);
    params.append('message', message);

    try {
        const response = await axios.post(url, params);
        const body = response.data;

        if (body.status === 'success') {
            res.status(200).send(`OTP sent to ${phoneNumber}`);
        } else {
            res.status(500).send(body);
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router