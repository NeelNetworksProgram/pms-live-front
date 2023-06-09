export const formatDateTime = (input) => {
  // Create a new Date object from the input string
  const dateObj = new Date(input);
  // Format the date in dd/mm/yyyy format
  const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}/${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateObj.getFullYear()}`;

  // Format the time in hh:mm AM/PM format
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const formattedTime = `${hours % 12 === 0 ? 12 : hours % 12}:${minutes
    .toString()
    .padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;

  // Output the formatted date and time
  const DateTime = `${formattedDate} | ${formattedTime}`;
  return DateTime;
};
