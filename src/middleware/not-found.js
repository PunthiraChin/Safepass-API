const notFoundMiddleware = (req, res, next) => {
  res
    .status(404)
    .json({ message: `requested ${req.method} via ${req.url} is invalid` });
};
module.exports = notFoundMiddleware;
