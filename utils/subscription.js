const subscriptionPlans = {
    MONTHLY: {
      duration: 60, // days
      price: 300, // price in your currency
      id: process.env.RAZOR_PAY_MONTHLY_PLAN_ID
    },
    YEARLY: {
      duration: 120, // days
      price: 1000, // price in your currency
      id: process.env.RAZOR_PAY_YEARLY_PLAN_ID
    }
  };

module.exports = subscriptionPlans
  