const cleaner = require('../models/cleaner')

async function handleGetAllCleaners(req, res) {

    try {

        const foundCleaners = await cleaner.find({})
        if (!foundCleaners) {
            return res.status(400).json({
                sucess: false,
                message: "Could not find cleaners"
            })
        }
        return res.status(201).json({
            success: true,
            data: foundCleaners
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }


}

async function handleCreateCleaner(req, res) {
    try {

        if (req.files) {
            Object.keys(req.files).forEach((key) => {
              if (req.files[key][0] && req.files[key][0].path) {
                req.body[key] = req.files[key][0].path; // Add the URL to req.body
              }
            });
          }

        const { name, email, password, city, state, cleanerType, mobileNumber, photo, aadharCard } = req.body

        if (!name || !email || !password || !city || !state || !cleanerType || !mobileNumber || !photo || !aadharCard) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (!email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid Email"
            })
        }


        if (mobileNumber.length < 10 || mobileNumber.length > 11) {
            return res.status(400).json({
                success: false,
                message: "number should be less than 10 and greater than 11"

            })
        }

        const createdCleaner = await cleaner.create({
            name, email, password, city, state, cleanerType, mobileNumber, photo, aadharCard
        })
        return res.status(201).json({
            success: true,
            createdCleaner
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteCleaner(req, res) {
    try {
        const { cleanerId } = req.query
        if (!cleanerId) {
            return res.status(400).json({
                success: false,
                message: "Please provide cleaner ID to delete it"
            })
        }

        const foundCleaner = await cleaner.findById(cleanerId)
        if (!foundCleaner) {
            return res.status(400).json({
                success : false,
                message : "Provide a valid cleaner ID"
            })
        }

        await cleaner.findByIdAndDelete(cleanerId)
        return res.status(200).json({
            success: true,
            message: "Cleaner Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleUpdateCleaner(req, res) {
    try {
        if (req.files) {
            Object.keys(req.files).forEach((key) => {
                if (req.files[key][0] && req.files[key][0].path) {
                    req.body[key] = req.files[key][0].path; 
                }
            });
        }

        const { cleanerId } = req.query
        // const { updatedDriver } = req.body
        console.log({bo : req.body});
        if (!cleanerId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of clenaer to update"
            })
        }
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Provide the updated cleaner"
            })
        }
        await cleaner.findByIdAndUpdate(cleanerId, req.body)
        return res.status(200).json({
            success: true,
            message: "Cleaner updated",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    handleCreateCleaner,
    handleGetAllCleaners,
    handleDeleteCleaner,
    handleUpdateCleaner
}




