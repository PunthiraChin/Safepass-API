function convertDateTime(dateString) {
  // Parse the date string to a Date object
  const date = new Date(dateString);

  // Convert to ISO 8601 format
  return date.toISOString();
}
module.exports = convertDateTime;
