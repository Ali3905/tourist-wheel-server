const user = require("../models/user")
const driver = require("../models/driver")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const employee = require("../models/employee")


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
        if (!["ADMIN", "AGENCY"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid user type"
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
        const { userName, password, mobileNumber } = req.body
        if ((!userName && !mobileNumber) || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }
        const foundUser = await user.findOne({ userName })
        if (!foundUser) {

            const foundDriver = await driver.findOne({ mobileNumber, password })

            if (foundDriver) {
                const payload = {
                    _id: foundDriver._id,
                    role: "DRIVER"
                }

                const authToken = jwt.sign(payload, process.env.JWT_SECRET)

                
                return res.status(200).json({
                    success: true,
                    data: foundDriver,
                    authToken
                })
            }

            const foundEmployee = await employee.findOne({ mobileNumber, password })
            const foundAgency = await user.findOne({ employees : foundEmployee._id })
            if (foundEmployee && (foundEmployee.employeeType === "MANAGER" || foundEmployee.employeeType === "OFFICE-BOY")) {
                const payload = {
                    _id: foundAgency._id,
                    employeeId: foundEmployee._id,
                    role: foundEmployee.employeeType
                }

                const authToken = jwt.sign(payload, process.env.JWT_SECRET)

                
                return res.status(200).json({
                    success: true,
                    data: foundEmployee,
                    authToken
                })
            }

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
        return res.status(200).json({
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

async function handleGetUserById(req, res) {
    try {
        if (!req.data._id) {
            return res.status(400).json({
                success: false,
                message: "Login with correct creds"
            })
        }
        const userId = req.data._id
        const foundUser = await user.findById(userId)
        if (!foundUser) {
            res.status(400).json({
                success: false,
                message: "Login with correct creds"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
async function handleUpdateUser(req, res) {
    try {
        if (!req.data._id) {
            return res.status(400).json({
                success: false,
                message: "Login with correct creds"
            })
        }
        const userId = req.data._id
        const updatedUser = await user.findByIdAndUpdate(userId, req.body, { new: true })
        if (!updatedUser) {
            res.status(400).json({
                success: false,
                message: "Login with correct creds"
            })
        }
        return res.status(200).json({
            success: true,
            data: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleGetUserByType(req, res) {
    try {
        const { userType } = req.params
        if (!userType) {
            return res.status(400).json({
                success: false,
                message: "Provide the user type you want to get"
            })
        }
        const foundUsers = await user.find({ type: userType })

        return res.status(200).json({
            success: true,
            data: foundUsers
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
    handleLogin,
    handleGetUserById,
    handleUpdateUser,
    handleGetUserByType
}