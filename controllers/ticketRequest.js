const busRoute = require("../models/busRoute")
const ticketRequest = require("../models/ticketsRequest")
const { user, customer } = require("../models/user")

async function handleCreateTicketRequest(req, res) {
    try {
        const { dateOfJourney, numberOfPeople, passengerGender } = req.body
        const { routeId } = req.query

        if (!dateOfJourney || !numberOfPeople || !passengerGender) {
            return res.status(400).json({
                success: false,
                message: "Kindly fill all the fields"
            })
        }

        if (!routeId) {
            return res.status(400).json({
                success: false,
                message: "Provide the Route ID to request ticket"
            })
        }
        const foundCustomer = await user.findById(req.data._id)
        const foundRoute = await busRoute.findById(routeId)

        if (!foundRoute) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid route ID"
            })
        }

        const createdTicketRequest = await ticketRequest.create({ dateOfJourney, numberOfPeople, passengerGender, customer: foundCustomer, route: foundRoute })
        const foundAgency = await user.findOne({ busRoutes: routeId })
        foundAgency.ticketRequests.push(createdTicketRequest)
        await foundAgency.save()

        return res.status(201).json({
            success: true,
            data: createdTicketRequest
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllTicketRequests(req, res){
    try {
        const foundUser = await user.findById(req.data._id).populate({
            path: "ticketRequests",
            options: {sort: { createdAt: -1 }},
            populate: [
                {path: "customer", model: "user"},
                {path: "route", model: "busRoute"}
            ]
        })

        if (!foundUser.ticketRequests) {
            return res.status(500).json({
                success: false,
                message: "Could not fetch the ticket requests"
            })
        }

        return res.status(200).json({
            success: true,
            data: foundUser.ticketRequests
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    handleCreateTicketRequest,
    handleGetAllTicketRequests
}