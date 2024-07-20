const formatDate = (mongoDate) => {
  // Convert mongoDate to a Date object if it is not already one
  // const date = new Date(mongoDate);
  console.log(mongoDate);
  
  // Extract the day, month, and year components
  // const day = date.getDate().toString().padStart(2, '0');
  // const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  // const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year

  // console.log(`${day}/${month}/${year}`);
  
  // Combine the components into the desired format
  // return `${day}/${month}/${year}`;
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' };
   const formated =  new Intl.DateTimeFormat('en-GB', options).format(mongoDate);
   console.log(formated);
   return formated


};

function formatTime(mongoDate) {
    // Convert mongoDate to a Date object if it is not already one
    const date = new Date(mongoDate);
  
    // Check if the date is valid
    if (isNaN(date)) {
      throw new Error('Invalid date');
    }
  
    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    // Determine AM or PM
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
  
    // Combine the components into the desired format
    return `${hours}:${minutes} ${ampm}`;
  }
  
  // Example usage
  try {
    const mongoDate = new Date(); // Example MongoDB date
    console.log(formatTime(mongoDate)); // Output: "12:00 am" (for example)
  } catch (error) {
    console.error(error.message);
  }
  

module.exports = {
    formatDate,
    formatTime
}