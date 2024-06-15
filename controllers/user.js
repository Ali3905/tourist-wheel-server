const user = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function handleSignUp(req, res) {
    try {
        const { userName, companyName, mobileNumber, whatsappNumber, state, city, email, password } = req.body
        if (!userName || !companyName || !mobileNumber || !whatsappNumber || !state || !city || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }
        const alreadyUserWithThisUserName = await user.findOne({ userName })
        if (alreadyUserWithThisUserName) {
            return res.status(400).json({
                success: false,
                message: "This username is taken"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const createdUser = await user.create({ userName, companyName, mobileNumber, whatsappNumber, state, city, email, password: hashedPassword })

        const payload = {
            _id : createdUser._id
        }

        const authToken = jwt.sign(payload, process.env.JWT_SECRET)

        return res.status(201).json({
            success: true,
            data: createdUser,
            authToken
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleLogin(req, res) {
    try {
        const { userName, password } = req.body
        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }
        const foundUser = await user.findOne({ userName })
        if (!foundUser) {
            return res.status(400).json({
                success: false,
                message: "Please provide correct creds"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Please provide correct creds"
            })
        }
        const payload = {
            _id : foundUser._id
        }

        const authToken = jwt.sign(payload, process.env.JWT_SECRET)
        return res.status(300).json({
            success: false,
            data: foundUser,
            authToken
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

module.exports = {
    handleSignUp,
    handleLogin
}