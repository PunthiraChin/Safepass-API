const createError = (details) => {
  const error = new Error(details.message);
  error.statusCode = details.statusCode;
  error.field = details.field;
  throw error;
};
module.exports = createError;
