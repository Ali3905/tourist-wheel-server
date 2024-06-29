const user = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function handleSignUp(req, res) {
    try {
        const { userName, companyName, mobileNumber, whatsappNumber, state, city, email, password, type } = req.body
        if (!userName || !companyName || !mobileNumber || !whatsappNumber || !state || !city || !email || !password || !type) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }
        if (!email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid mobile NUmber"
            })
        }
        if (whatsappNumber.length < 10 || whatsappNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid whatsapp NUmber"
            })
        }
        if (password.length < 5) {
            return res.status(400).json({
                success: false,
                message: "Password must contain atleast 5 characters"
            })
        }
        if(!["ADMIN", "AGENCY"].includes(type)){
            return res.status(400).json({
                success : false,
                message : "Provide a valid user type"
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
        const createdUser = await user.create({ userName, companyName, mobileNumber, whatsappNumber, state, city, email, password: hashedPassword, type })

        const payload = {
            _id: createdUser._id,
            role: createdUser.type
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
            _id: foundUser._id,
            role: foundUser.type
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