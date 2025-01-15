const cron = require('node-cron');
const packageBooking = require('../models/packageVehicleBooking');
const { sendSms } = require('../utils/sms');

module.exports = () => {
    cron.schedule('0 * * * *', async () => { // Runs at the start of every hour
        try {
            const currentTime = new Date();
            const fourHoursLater = new Date(currentTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now

            const bookingsToNotify = await packageBooking.find({
                departureTime: { $lt: fourHoursLater, $gt: currentTime }, // Departure in less than 4 hours
                isDriverNotified: { $ne: true } // Only those not already notified
            }).populate('primaryDriver secondaryDriver vehicle');

            if (bookingsToNotify.length === 0) {
                console.log("No drivers to notify");
                return;
            }

            bookingsToNotify.forEach(async (booking) => {
                const driver = booking?.primaryDriver;
                const secondaryDriver = booking?.secondaryDriver;
                // console.log({booking, driver, secondaryDriver});
                
                if (driver) {
                    const message = `"Dear ${driver?.name}, Reminder: You have an upcoming trip in 4 hours. Agency: ${booking?.agencyName} Vehicle: ${booking?.vehicle?.number} Departure Time: ${booking?.departureTime} Customer: ${booking?.customerName} and ${booking?.customerNo} Kindly reach the vehicle 2 hours before departure to inspect its condition. Important: It is compulsory to start the trip using the 'TJ Driver' app before departure and complete the trip details in the app upon return. Please ensure everything is in order for a smooth journey. Thank you!" Tourist Junction Team`;

                    await sendSms(driver.mobileNumber, message, process.env.DLT_DRIVER_PACKAGE_REMINDER_TEMPLATE_ID);
                    booking.isDriverNotified = true;
                    await booking.save();
                    // console.log(`SMS sent to driver ${booking.primaryDriver.name} for booking ID: ${booking._id}`);
                }
                if (secondaryDriver) {
                    const message = `"Dear ${secondaryDriver?.name}, Reminder: You have an upcoming trip in 4 hours. Agency: ${booking?.agencyName} Vehicle: ${secondaryDriver?.vehicle?.number} Departure Time: ${booking?.departureTime} Customer: ${booking?.customerName} and ${booking?.customerNo} Kindly reach the vehicle 2 hours before departure to inspect its condition. Important: It is compulsory to start the trip using the 'TJ Driver' app before departure and complete the trip details in the app upon return. Please ensure everything is in order for a smooth journey. Thank you!" Tourist Junction Team`;

                    await sendSms(secondaryDriver.mobileNumber, message, process.env.DLT_DRIVER_PACKAGE_REMINDER_TEMPLATE_ID);
                    booking.isDriverNotified = true;
                    await booking.save();
                    // console.log(`SMS sent to driver ${booking.secondaryDriver.name} for booking ID: ${booking._id}`);
                };
        })
        } catch (error) {
            console.error("Error in driver notification cron job:", error.message);
        }
    });
};
