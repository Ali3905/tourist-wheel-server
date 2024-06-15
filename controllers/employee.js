const employee = require('../models/employee')

async function handleCreateEmployee(req, res) {

    try {

        const { name, mobileNumber, employeeType, photo, aadharCard, password } = req.body

        if (!name || !mobileNumber || !employeeType || !photo || !aadharCard || !password) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }



        if (mobileNumber.length < 10 || mobileNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "number should be less than 10 and greater than 11"

            })
        }

        const createdEmployee = await employee.create({
            name, mobileNumber, employeeType, photo, password, aadharCard
        })

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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
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


module.exports = {
    handleCreateEmployee,
    handleGetAllEmployees,
    handleDeleteEmployee
}




