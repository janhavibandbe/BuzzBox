export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  export function convertISTtoUTC(istDate) {
    // Create a Date object from the IST time
    const date = new Date(istDate);
    
    // Convert IST to UTC (IST is UTC+5:30)
    // const utcDate = new Date(date.getTime() - (5.5 * 60 * 60 * 1000));

    return date.toISOString(); // Returns a string in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
}