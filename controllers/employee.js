const employee = require('../models/employee');
const user = require('../models/user');

async function handleCreateEmployee(req, res) {

    try {

        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key][0].path; // Add the URL to req.body
                }
            });
        }

        const { name, mobileNumber, employeeType, state, photo, aadharCard, password } = req.body

        if (!name || !mobileNumber || !employeeType || !state || !photo || !aadharCard || !password) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }

        if (!["MANAGER", "CLEANER", "OFFICE-BOY", "ACCOUNTANT", "TELECALLER"].includes(employeeType)) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid employee type"

            })
        }


        if (mobileNumber.length < 10 || mobileNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "number should be less than 10 and greater than 11"

            })
        }

        const createdEmployee = await employee.create({
            name, mobileNumber, employeeType, state, photo, password, aadharCard
        })

        const updatedUser = await user.findByIdAndUpdate(req.data._id, { $push: { employees: createdEmployee } }, { new: true })

        return res.status(201).json({
            success: true,
            createdEmployee
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllEmployees(req, res) {
    try {
        if (req.data.role === "AGENCY") {
            const foundEmployees = await user.findById(req.data._id).populate("employees")

            if (!foundEmployees) {
                return res.status(400).json({
                    success: false,
                    message: "Could find drivers"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundEmployees.employees
            })
        }
        else {
            const foundEmployees = await employee.find({})
            if (!foundEmployees) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find employees"
                })
            }
            return res.status(200).json({
                success: false,
                data: foundEmployees
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteEmployee(req, res) {
    try {
        const { employeeId } = req.query
        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of employee to delete"
            })
        }
        const foundEmployee = await employee.findById(employeeId)
        if (!foundEmployee) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid employee ID"
            })
        }
        await employee.findByIdAndDelete(employeeId)
        await user.findByIdAndUpdate(req.data._id, { $pull: { employees: employeeId } }, { new: true })
        return res.status(200).json({
            success: true,
            message: "Employee Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleUpdateEmployee(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key][0].path;
                }
            });
        }

        const { employeeId } = req.query
        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of employee to update"
            })
        }
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Provide the updated employee"
            })
        }
        await employee.findByIdAndUpdate(employeeId, req.body)
        return res.status(200).json({
            success: true,
            message: "Employee updated",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    handleCreateEmployee,
    handleGetAllEmployees,
    handleDeleteEmployee,
    handleUpdateEmployee
}




